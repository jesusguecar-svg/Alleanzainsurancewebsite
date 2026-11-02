import { existsSync, readFileSync, statSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const isFile = (path) => existsSync(path) && statSync(path).isFile();

export async function resolve(specifier, context, next) {
  let base;
  if (specifier.startsWith("@/")) base = fileURLToPath(new URL(specifier.slice(2), root));
  else if (/^\.\.?\//.test(specifier) && context.parentURL?.startsWith(root.href)) base = fileURLToPath(new URL(specifier, context.parentURL));
  if (base) {
    for (const file of [base, `${base}.ts`, `${base}/index.ts`]) {
      if (isFile(file)) return { url: pathToFileURL(file).href, shortCircuit: true };
    }
  }
  try {
    return await next(specifier, context);
  } catch (error) {
    // Packages without an exports map, e.g. "next/server" → next/server.js.
    if (!specifier.startsWith(".") && !specifier.startsWith("node:")) return next(`${specifier}.js`, context);
    throw error;
  }
}

export async function load(url, context, next) {
  if (url.startsWith(root.href) && url.endsWith(".json")) {
    return { format: "module", source: `export default ${readFileSync(new URL(url), "utf8")};`, shortCircuit: true };
  }
  // Project TypeScript is ES modules (package.json has no "type" field to say so).
  if (url.startsWith(root.href) && url.endsWith(".ts")) return next(url, { ...context, format: "module-typescript" });
  return next(url, context);
}

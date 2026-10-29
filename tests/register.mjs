// Lets `node --test` run the TypeScript sources directly (Node strips the types): resolves the
// "@/..." alias and extensionless imports the way Next's bundler does, and loads JSON as a module.
import { register } from "node:module";

register("./resolve-hooks.mjs", import.meta.url);

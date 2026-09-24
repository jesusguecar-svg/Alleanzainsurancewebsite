import { products, type Product } from "./products";

export type ContactRequest = {
  name: string;
  phone: string;
  email?: string;
  productId?: string;
  message?: string;
  consent: boolean;
};

export type FieldErrors = Partial<Record<keyof ContactRequest, string>>;

export function optionsForLines(lines: readonly Product["line"][]) {
  return [
    { value: "", label: "Prefiero que me orienten" },
    ...products
      .filter((product) => lines.includes(product.line))
      .map((product) => ({ value: product.id, label: product.name })),
  ];
}

export const productOptions = optionsForLines(["health", "life", "property"]);

export const consentText =
  "Autorizo que un agente de seguros con licencia me contacte por teléfono, mensaje de texto o correo electrónico sobre estas coberturas. Puedo pedir que dejen de contactarme en cualquier momento.";

/**
 * Hidden bot field. Do not name this `website`, `url`, or `email` — browsers
 * autofill those and would drop a real lead when the server treats a filled
 * honeypot as spam.
 */
export const honeypotFieldName = "company_fax_hp";

const phonePattern = /^[\d\s()+.-]{7,}$/;
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Shared by the form and the API route so the browser and the server apply the
 * same rules — client-side validation is a convenience, not a trust boundary.
 */
export function validateContact(input: Partial<ContactRequest>): FieldErrors {
  const errors: FieldErrors = {};

  const name = input.name?.trim() ?? "";
  if (name.length < 2) errors.name = "Escribe tu nombre.";
  else if (name.length > 120) errors.name = "El nombre es demasiado largo.";

  const phone = input.phone?.trim() ?? "";
  if (!phone) errors.phone = "Escribe un teléfono donde podamos llamarte.";
  else if (!phonePattern.test(phone)) errors.phone = "Revisa el número de teléfono.";

  const email = input.email?.trim() ?? "";
  if (email && !emailPattern.test(email)) errors.email = "Revisa el correo electrónico.";

  const message = input.message?.trim() ?? "";
  if (message.length > 2000) errors.message = "El mensaje es demasiado largo.";

  if (input.productId && !products.some((product) => product.id === input.productId)) {
    errors.productId = "Selecciona una opción válida.";
  }

  if (!input.consent) errors.consent = "Necesitamos tu autorización para contactarte.";

  return errors;
}

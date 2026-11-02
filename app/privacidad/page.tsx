import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { ConsentPreferencesButton } from "@/components/analytics/ConsentPreferencesButton";
import { officeAddressLines, phones } from "@/lib/config/contact";

const title = "Política de privacidad | Alleanza Insurance Corp.";
const description =
  "Cómo Alleanza Insurance Corp. recopila, usa, comparte y conserva los datos que envías por el sitio, incluidos los formularios de salud y de contacto.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidad", languages: { "es-US": "/privacidad", "en-US": "/en/privacy", "x-default": "/privacidad" } },
  openGraph: {
    type: "website",
    locale: "es_US",
    url: "/privacidad",
    siteName: "Alleanza Insurance Corp.",
    title,
    description,
  },
};

export default function Page() {
  return (
    <LegalDocument title="Política de privacidad" updated="1 de noviembre de 2026">
      <p>
        <a href="/en/privacy" hrefLang="en" lang="en">Read this policy in English</a>
      </p>
      <p>
        Esta política describe cómo Alleanza Insurance Corp. (“Alleanza”, “nosotros”) trata la información
        personal que recibimos a través de este sitio. No es un contrato de seguro ni un aviso de
        prácticas de una compañía aseguradora.
      </p>

      <h2>Quiénes somos</h2>
      <p>
        Alleanza Insurance Corp. es una agencia de seguros con oficina en {officeAddressLines.join(", ")}.
        Para ejercer tus derechos o hacer una pregunta sobre tus datos, escríbenos por el{" "}
        <a href="/contacto">formulario de contacto</a> o llámanos al{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>

      <h2>Qué recopilamos</h2>
      <p>Cuando usas nuestros formularios de salud, contacto, empleadores o empleo, podemos recibir:</p>
      <ul>
        <li>Nombre, teléfono y correo electrónico. El correo es obligatorio en algunos formularios y opcional en otros.</li>
        <li>En el formulario de salud: estado, interés de cobertura e idioma.</li>
        <li>En los demás formularios: mensaje e interés de cobertura y, en el caso de empleadores, organización y tamaño del equipo.</li>
        <li>Tu autorización para que un agente con licencia te contacte por teléfono, mensaje de texto o correo.</li>
        <li>Datos técnicos del envío: fecha y hora, la página desde la que escribes y el origen de tu visita. También podemos procesar tu dirección IP para proteger los formularios contra abusos.</li>
      </ul>
      <p>
        No te pedimos números de Seguro Social, datos de pago ni información médica a través de este
        sitio. No uses el formulario para enviar esa información.
      </p>

      <h2>Para qué la usamos</h2>
      <p>
        Usamos estos datos para responderte, orientarte sobre coberturas disponibles, dar seguimiento a
        una conversación que tú iniciaste y llevar nuestros registros operativos y de cumplimiento. No
        vendemos listas de contactos.
      </p>

      <h2>Registro operativo interno</h2>
      <p>
        Si nos envías una solicitud de orientación o contacto sobre seguros desde el formulario de salud,
        de contacto o de empleadores, podemos crear un registro interno para dar seguimiento a la
        solicitud, medir resultados y cumplir nuestras obligaciones. Este registro es seudónimo, no
        anónimo: usa una referencia interna en lugar de tu nombre, pero Alleanza puede relacionar esa
        referencia con tu solicitud.
      </p>
      <p>El registro puede incluir:</p>
      <ul>
        <li>la referencia interna;</li>
        <li>el tipo de formulario y la categoría de producto;</li>
        <li>el estado, si lo indicaste, y el idioma;</li>
        <li>la fuente, el medio y la campaña de tu visita;</li>
        <li>la ruta de la página de llegada (por ejemplo, /health);</li>
        <li>fechas y el estado del seguimiento, incluida la inscripción, si corresponde.</li>
      </ul>
      <p>
        No copiamos al registro, como campos de contacto, tu nombre, correo electrónico, teléfono ni el
        mensaje que escribas. Esos datos pueden mantenerse por separado en nuestro correo interno u otros
        sistemas operativos que necesitamos para responderte.
      </p>
      <p>Las solicitudes de empleo llegan a nuestro correo interno y no generan este registro.</p>

      <h2>Con quién la compartimos</h2>
      <p>
        Tu envío pasa por nuestros servidores a nuestro correo interno y a nuestros sistemas operativos,
        incluido el registro operativo interno. Estos servicios funcionan con proveedores tecnológicos.
        También podemos compartir lo necesario con agentes
        con licencia de Alleanza y, si pides una cotización, con compañías aseguradoras u otros
        proveedores que participen en esa gestión. Exigimos a esos encargados que traten la
        información solo para prestar el servicio.
      </p>

      <h2>Medición del sitio</h2>
      <p>
        <strong>Analítica (opcional).</strong> Si la aceptas en el aviso de medición, cargamos Google Tag
        Manager y Google Analytics 4 para medir de forma agregada las visitas, los clics en botones de
        contacto y cuántas solicitudes se envían. No se cargan hasta que aceptas, y puedes rechazarlos y
        seguir usando el sitio. Nunca les enviamos tus respuestas de formularios ni datos personales como
        tu nombre, correo, teléfono o estado de salud. No usamos publicidad, remarketing ni anuncios
        personalizados.
      </p>
      <p>
        <strong>Origen de tu visita.</strong> Si aceptas la analítica, guardamos en tu navegador, hasta 90
        días, de qué campaña o sitio llegaste (por ejemplo, una búsqueda en Google o un enlace de una
        campaña). Si la rechazas, no guardamos ese dato en tu navegador.
      </p>
      <p>
        Si envías una solicitud, el origen se incluye en el correo interno que recibe nuestro equipo y
        puede incluirse en el registro operativo interno. Si rechazaste la analítica, solo se incluye el
        origen de la visita en curso. Google Analytics no recibe esta información ni el registro operativo
        interno.
      </p>
      <p>
        Rechazar la analítica no impide que tratemos la información necesaria para atender una solicitud
        que nos envíes, ni que mantengamos nuestros registros operativos y de cumplimiento.
      </p>
      <p>
        <strong>Rendimiento del sitio.</strong> Usamos Vercel Web Analytics y Vercel Speed Insights para
        conocer el tráfico total y la velocidad del sitio. No usan cookies ni reciben datos de tus
        formularios.
      </p>
      <p>
        Tu elección se guarda en tu navegador; quitar el almacenamiento local del sitio o usar otro
        dispositivo vuelve a mostrar el aviso.{" "}
        <ConsentPreferencesButton label="Cambiar mis preferencias de medición" />
      </p>

      <h2>Conservación y eliminación</h2>
      <p>
        Conservamos las solicitudes y los datos de contacto el tiempo necesario para atenderte y para
        cumplir obligaciones legales o de supervisión.
      </p>
      <p>
        Conservamos el registro operativo interno de la inscripción abierta 2027 hasta el 15 de enero de
        2037, salvo que la ley, los requisitos de los Centros de Servicios de Medicare y Medicaid (CMS),
        obligaciones contractuales, auditorías, disputas o retenciones legales exijan conservarlo más
        tiempo. Ese plazo se aplica a este registro; el correo interno y otros sistemas pueden tener
        plazos distintos.
      </p>
      <p>
        Puedes pedirnos que eliminemos o actualicemos tus datos de contacto llamándonos o usando el
        formulario. Atenderemos tu pedido en lo que corresponda, pero podemos conservar la información que
        debamos mantener por obligaciones legales, regulatorias, contractuales o de auditoría, incluido el
        registro operativo interno.
      </p>

      <h2>Tus opciones</h2>
      <ul>
        <li>Puedes pedir que dejemos de llamarte, escribirte o enviarte mensajes en cualquier momento.</li>
        <li>Puedes rechazar la analítica, o cambiar tu elección después, y seguir usando el sitio.</li>
        <li>Puedes solicitar acceso o corrección de la información de contacto que nos hayas enviado.</li>
      </ul>

      <h2>Menores</h2>
      <p>Este sitio no está dirigido a menores de 18 años y no buscamos recopilar sus datos a propósito.</p>

      <h2>Cambios</h2>
      <p>
        Si cambiamos esta política de forma relevante, actualizaremos la fecha de esta página. El uso
        continuado del sitio después de un cambio significa que has podido revisar la versión vigente.
      </p>
    </LegalDocument>
  );
}

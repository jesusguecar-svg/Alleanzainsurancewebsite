import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { ConsentPreferencesButton } from "@/components/analytics/ConsentPreferencesButton";
import { officeAddressLines, phones } from "@/lib/config/contact";

const title = "Política de privacidad | Alleanza Insurance Corp.";
const description =
  "Cómo Alleanza Insurance Corp. recopila, usa y comparte los datos personales que envías por el sitio, incluido el formulario de contacto.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/privacidad" },
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
    <LegalDocument title="Política de privacidad" updated="28 de octubre de 2026">
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
      <p>Cuando usas el formulario de contacto o el de empleadores, podemos recibir:</p>
      <ul>
        <li>Nombre, teléfono y, si lo indicas, correo electrónico.</li>
        <li>Mensaje, interés de cobertura y, en el caso de empleadores, organización y tamaño del equipo.</li>
        <li>Tu autorización para que un agente con licencia te contacte por teléfono, mensaje de texto o correo.</li>
        <li>Datos técnicos básicos del envío (fecha y hora). El formulario de empleadores puede incluir parámetros de campaña de la URL y el referente del navegador, si existen.</li>
      </ul>
      <p>
        No te pedimos números de Seguro Social, datos de pago ni información médica a través de este
        sitio. No uses el formulario para enviar esa información.
      </p>

      <h2>Para qué la usamos</h2>
      <p>
        Usamos estos datos para responderte, orientarte sobre coberturas disponibles y, si corresponde,
        dar seguimiento a una conversación que tú iniciaste. No vendemos listas de contactos.
      </p>

      <h2>Con quién la compartimos</h2>
      <p>
        El envío se retransmite desde nuestros servidores a un destino configurado por Alleanza (por
        ejemplo un CRM o un servicio de correo). También podemos compartir lo necesario con agentes
        con licencia de Alleanza y, si pides una cotización, con compañías aseguradoras u otros
        proveedores que participen en esa gestión. Exigimos a esos encargados que traten la
        información solo para prestar el servicio.
      </p>

      <h2>Medición opcional</h2>
      <p>
        Al entrar te preguntamos por dos categorías opcionales. No se cargan hasta que las aceptas y puedes
        rechazarlas y seguir usando el sitio:
      </p>
      <ul>
        <li>
          <strong>Analítica:</strong> Google Analytics, a través de Google Tag Manager, para medir de forma
          agregada las visitas y cuántas solicitudes se envían. No le enviamos tus respuestas de formularios
          (nombre, correo, teléfono, estado de salud u otros datos personales). Con este permiso también
          guardamos en tu navegador, hasta 90 días, de qué campaña o sitio llegaste, para saber qué canales
          nos traen solicitudes; esa referencia se incluye en tu solicitud interna, nunca en Google Analytics.
        </li>
        <li>
          <strong>Marketing:</strong> un píxel de Whop (<code>t.whop.tw</code>). Lo configuramos para que no lea
          los campos de los formularios.
        </li>
      </ul>
      <p>
        Además usamos Vercel Web Analytics y Speed Insights, que no usan cookies, para conocer el tráfico
        total y el rendimiento técnico del sitio. Tu elección se guarda en tu navegador; quitar el
        almacenamiento local del sitio o usar otro dispositivo vuelve a mostrar el aviso.{" "}
        <ConsentPreferencesButton label="Cambiar mis preferencias de medición" />
      </p>

      <h2>Conservación</h2>
      <p>
        Conservamos las solicitudes el tiempo necesario para atenderte y para obligaciones legales o
        de supervisión. Si quieres que borremos o actualicemos tus datos de contacto, llámanos o
        usa el formulario.
      </p>

      <h2>Tus opciones</h2>
      <ul>
        <li>Puedes pedir que dejemos de llamarte, escribirte o enviarte mensajes en cualquier momento.</li>
        <li>Puedes rechazar la medición opcional, o cambiar tu elección después, y seguir usando el sitio.</li>
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

import type { Metadata } from "next";
import { LegalDocument } from "@/components/LegalDocument";
import { ConsentPreferencesButton } from "@/components/analytics/ConsentPreferencesButton";
import { officeAddressLines, phones } from "@/lib/config/contact";

const title = "Privacy Policy | Alleanza Insurance Corp.";
const description =
  "How Alleanza Insurance Corp. collects, uses, shares, and retains the information you send through this site, including the health and contact forms.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/en/privacy", languages: { "es-US": "/privacidad", "en-US": "/en/privacy", "x-default": "/privacidad" } },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/en/privacy",
    siteName: "Alleanza Insurance Corp.",
    title,
    description,
  },
};

export default function Page() {
  return (
    <LegalDocument locale="en" title="Privacy Policy" updated="November 1, 2026">
      <p>
        <a href="/privacidad" hrefLang="es" lang="es">Leer esta política en español</a>
      </p>
      <p>
        This policy describes how Alleanza Insurance Corp. (“Alleanza,” “we”) handles the personal
        information we receive through this site. It is not an insurance contract or an insurance
        company’s notice of practices.
      </p>

      <h2>Who we are</h2>
      <p>
        Alleanza Insurance Corp. is an insurance agency with an office at {officeAddressLines.join(", ")}.
        To exercise your rights or ask a question about your information, write to us through the{" "}
        <a href="/en/health#contacto">contact form</a> or call us at{" "}
        <a href={`tel:${phones[0].href}`}>{phones[0].label}</a>.
      </p>

      <h2>What we collect</h2>
      <p>When you use our health, contact, employer, or careers forms, we may receive:</p>
      <ul>
        <li>Your name, phone number, and email address. Email is required on some forms and optional on others.</li>
        <li>On the health form: state, coverage interest, and language.</li>
        <li>On the other forms: message and coverage interest and, for employers, organization and team size.</li>
        <li>Your authorization for a licensed agent to contact you by phone, text message, or email.</li>
        <li>Technical details of the submission: date and time, the page you are writing from, and the origin of your visit. We may also process your IP address to protect the forms against abuse.</li>
      </ul>
      <p>
        We do not ask for Social Security numbers, payment details, or medical information through this
        site. Do not use the form to send that information.
      </p>

      <h2>How we use it</h2>
      <p>
        We use this information to respond to you, guide you on available coverage, follow up on a
        conversation you started, and keep our operational and compliance records. We do not sell contact
        lists.
      </p>

      <h2>Internal operational record</h2>
      <p>
        If you send us a request for insurance guidance or contact through the health, contact, or employer
        form, we may create an internal record to follow up on the request, measure results, and meet our
        obligations. This record is pseudonymous, not anonymous: it uses an internal reference instead of
        your name, but Alleanza can connect that reference to your request.
      </p>
      <p>The record may include:</p>
      <ul>
        <li>the internal reference;</li>
        <li>the form type and product category;</li>
        <li>your state, if you provided it, and language;</li>
        <li>the source, medium, and campaign of your visit;</li>
        <li>the path of the landing page (for example, /health);</li>
        <li>dates and follow-up status, including enrollment, when applicable.</li>
      </ul>
      <p>
        We do not copy your name, email address, phone number, or the message you write into the record as
        contact fields. That information may be kept separately in our internal email or other operational
        systems we need in order to respond to you.
      </p>
      <p>Careers applications go to our internal email and do not create this record.</p>

      <h2>Who we share it with</h2>
      <p>
        Your submission passes through our servers to our internal email and operational systems, including
        the internal operational record. These services run on technology providers. We may also share what
        is necessary with Alleanza’s licensed agents and, if you request a quote, with insurance companies
        or other providers involved in that process. We require those processors to handle the information
        only to provide the service.
      </p>

      <h2>Site measurement</h2>
      <p>
        <strong>Analytics (optional).</strong> If you accept it in the measurement notice, we load Google Tag
        Manager and Google Analytics 4 to measure, in aggregate, visits, clicks on contact buttons, and how
        many requests are sent. They do not load until you accept, and you can decline them and keep using
        the site. We never send them your form answers or personal information such as your name, email,
        phone number, or health status. We do not use advertising, remarketing, or personalized ads.
      </p>
      <p>
        <strong>Origin of your visit.</strong> If you accept analytics, we store in your browser, for up to
        90 days, which campaign or site brought you here (for example, a Google search or a campaign link).
        If you decline, we do not store that information in your browser.
      </p>
      <p>
        If you send a request, the origin is included in the internal email our team receives and may be
        included in the internal operational record. If you declined analytics, only the origin of the
        current visit is included. Google Analytics does not receive this information or the internal
        operational record.
      </p>
      <p>
        Declining analytics does not prevent us from processing the information needed to handle a request
        you send us, or from keeping our operational and compliance records.
      </p>
      <p>
        <strong>Site performance.</strong> We use Vercel Web Analytics and Vercel Speed Insights to understand
        total traffic and site speed. They do not use cookies or receive data from your forms.
      </p>
      <p>
        Your choice is saved in your browser; clearing the site’s local storage or using another device
        shows the notice again.{" "}
        <ConsentPreferencesButton label="Change my measurement preferences" />
      </p>

      <h2>Retention and deletion</h2>
      <p>
        We keep requests and contact information for as long as needed to assist you and to meet legal or
        supervisory obligations.
      </p>
      <p>
        We keep the internal operational record for the 2027 open enrollment through January 15, 2037,
        unless applicable law, requirements of the Centers for Medicare &amp; Medicaid Services (CMS),
        contractual obligations, audits, disputes, or legal holds require keeping it longer. That period
        applies to this record; internal email and other systems may have different periods.
      </p>
      <p>
        You can ask us to delete or update your contact information by calling us or using the form. We will
        act on your request as appropriate, but we may keep information we must retain for legal, regulatory,
        contractual, or audit obligations, including the internal operational record.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can ask us to stop calling, emailing, or texting you at any time.</li>
        <li>You can decline analytics, or change your choice later, and keep using the site.</li>
        <li>You can request access to or correction of the contact information you sent us.</li>
      </ul>

      <h2>Children</h2>
      <p>This site is not directed to children under 18, and we do not knowingly collect their information.</p>

      <h2>Changes</h2>
      <p>
        If we materially change this policy, we will update the date on this page. Continued use of the site
        after a change means you have had the opportunity to review the current version.
      </p>
    </LegalDocument>
  );
}

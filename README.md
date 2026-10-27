# Alleanza Insurance

Experiencia web cinematográfica para familias hispanas en Texas, construida con Next.js 15, Tailwind CSS y Framer Motion.

## Desarrollo

```bash
npm install
npm run dev
```

## Build de producción

```bash
npm ci        # instalación reproducible desde package-lock.json
npm run build
npm start
```

## Variables de entorno

Copia `.env.example` a `.env.local` y ajusta los valores.

| Variable | Requerida | Descripción |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | No | Sustituye el dominio canónico. Sin ella, todo build de producción usa `https://alleanzainsurance.org` (`lib/config/site.ts`) para enlaces canónicos, Open Graph, `robots.txt`, `sitemap.xml` y datos estructurados; `next dev` usa `localhost`. |
| `CONTACT_WEBHOOK_URL` | **Sí, antes de lanzar** | Destino de los envíos del formulario de contacto (CRM, proveedor de formularios o servicio de correo). El reenvío ocurre en el servidor. Sin esta variable, `/api/contacto` responde `503` y el formulario avisa al visitante en lugar de recoger datos personales sin destino. |

> `NEXT_PUBLIC_SITE_URL` se resuelve durante el build, así que debe estar
> definida en el entorno de build, no solo en tiempo de ejecución.

## Despliegue

El proyecto se despliega en Vercel desde la rama `main`. Solo el entorno
`VERCEL_ENV=production` se indexa: el HTML lleva `noindex` y `robots.txt`
disallow en preview, desarrollo y un `next start` local.

## Migración desde el sitio WordPress

Las URL del sitio anterior (`alleanzainsurance.org`) redirigen de forma permanente
a la página equivalente según `lib/config/legacy-redirects.json`, que también
documenta el motivo de cada destino. Para validar redirecciones, canónicos,
sitemap, robots, enlaces internos y formularios contra un servidor en marcha:

```bash
npm run build && VERCEL_ENV=production npm start -- -p 3100
BASE_URL=http://localhost:3100 npm run validate:migration
# después del cambio de DNS:
BASE_URL=https://alleanzainsurance.org npm run validate:migration
```

`docs/migration/` contiene la revisión de afirmaciones pendientes de
aprobación y el plan de cambio de dominio.

## Contenido verificado

Las cifras y afirmaciones públicas (número de agentes, clientes atendidos, años
de experiencia, estados con licencia, relaciones con aseguradoras y
testimonios) viven en `lib/config/company.ts` y permanecen ocultas hasta que un
revisor registre un valor **y** su fuente. La interfaz nunca debe inferir estos
datos a partir de textos de marketing.

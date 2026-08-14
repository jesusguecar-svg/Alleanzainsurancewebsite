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
| `NEXT_PUBLIC_SITE_URL` | Recomendada | URL absoluta de producción, sin barra final. Se usa para enlaces canónicos, Open Graph, `robots.txt` y `sitemap.xml`. En Vercel se deduce automáticamente del dominio de producción; conviene fijarla al conectar un dominio propio. |
| `CONTACT_WEBHOOK_URL` | **Sí, antes de lanzar** | Destino de los envíos del formulario de contacto (CRM, proveedor de formularios o servicio de correo). El reenvío ocurre en el servidor. Sin esta variable, `/api/contacto` responde `503` y el formulario avisa al visitante en lugar de recoger datos personales sin destino. |

> `NEXT_PUBLIC_SITE_URL` se resuelve durante el build, así que debe estar
> definida en el entorno de build, no solo en tiempo de ejecución.

## Despliegue

El proyecto se despliega en Vercel desde la rama `main`. Los despliegues de
`preview` se marcan como `noindex` automáticamente para que no compitan con
producción en los buscadores.

## Contenido verificado

Las cifras y afirmaciones públicas (número de agentes, clientes atendidos, años
de experiencia, estados con licencia, relaciones con aseguradoras y
testimonios) viven en `lib/config/company.ts` y permanecen ocultas hasta que un
revisor registre un valor **y** su fuente. La interfaz nunca debe inferir estos
datos a partir de textos de marketing.

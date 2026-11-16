# Mini Podcast Studio — Cloudflare Pages

React + TypeScript estricto + Vite. El frontend se aloja en Cloudflare Pages. Supabase es opcional y **no es necesario para ver la página**.

## Local
```bash
cd web
npm install
npm run build
npm run dev
```

## Cloudflare Pages
En Cloudflare → Workers & Pages → Create application → Pages → Connect to Git:
- GitHub: `blex-ing/mini_podcast`
- Production branch: `master`
- Root directory: `web`
- Build command: `npm run build`
- Output directory: `dist`
- Node.js: 22

Cloudflare genera Preview deployments de las ramas y PR configuradas. El proyecto de Pages debe conectarse a GitHub desde la cuenta del propietario; subir archivos a GitHub no crea automáticamente la URL pública.

## Persistencia opcional
Cuando se quiera guardar borradores entre dispositivos, crear proyecto Supabase, ejecutar `supabase/migrations/0001_episodes.sql` y configurar variables públicas `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`. No poner jamás una `service_role` key en variables VITE. Configurar correctamente los Redirect URLs en Supabase Auth para los dominios Cloudflare.

## Alcance inicial
La versión Preview valida el formato de las URLs y muestra interfaz, biblioteca de ejemplo y pasos futuros. **No extrae artículos ni genera audio**. Las tarjetas de biblioteca son ejemplos visuales. La extracción Python heredada sigue intacta.

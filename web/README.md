# Mini Podcast Studio — Cloudflare Workers

Interfaz React + TypeScript estricto + Vite. Se despliega como **Cloudflare Workers Static Assets** con `wrangler.jsonc` en la raíz del repositorio. No requiere Supabase para mostrar la interfaz.

## Desarrollo local

```bash
cd web
npm install
npm run build
npm run dev
```

## Cloudflare Workers Builds — GitHub

Conecta el repositorio `blex-ing/mini_podcast` en Cloudflare → Workers & Pages → Create → Import Git repository → Worker.

- Project name: `mini-podcast`
- Production branch: `master` (importante: el default de GitHub sigue siendo `main` hasta cambiarlo)
- Path (repositorio): `/`
- Build command: `cd web && npm install && npm run build`
- Deploy command: `npx wrangler deploy`
- Preview command: `npx wrangler preview`
- Enable Preview builds: activado
- Protect with Cloudflare Access: opcional, desactivado para demo pública
- Build token: preferentemente específico del proyecto

**Atención:** `wrangler.jsonc` en la raíz es imprescindible. Publica `./web/dist` como assets estáticos con fallback SPA. El ajuste de directorio web se hace en el comando de build; no hay que cambiar el Path del repositorio a `web`.

Cloudflare crea URL `*.workers.dev` al completar el primer deploy; este repositorio no acredita por sí solo que exista un despliegue publicado.

## Persistencia opcional

Si en el futuro se activa Supabase, añadir `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` como variables públicas del build, crear el esquema `supabase/migrations/0001_episodes.sql` y configurar los Redirect URLs de Auth. Nunca introducir claves privadas en variables VITE.

## Alcance

La demo valida el formato básico de URLs y permite visualizar el estudio, las etapas y la biblioteca. Sin Supabase no guarda datos. No extrae artículos ni genera audio todavía. Las tarjetas son ejemplos visuales; Python legado permanece intacto.

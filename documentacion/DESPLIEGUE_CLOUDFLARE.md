# Despliegue en Cloudflare Workers

## Arquitectura

```text
GitHub feature/* → CI → Workers Preview → PR a develop
GitHub develop   → CI → Workers Preview integración
GitHub release/* → CI → Workers Preview candidato a release
GitHub master    → CI → Workers Production
                                 |
                                 └─ Vite build en web/dist como Static Assets
```

La aplicación Vite se compila en `web/`. El Worker y `wrangler.jsonc` están en la **raíz**. Los assets publicados son `web/dist`; SPA fallback: `single-page-application`.

## Configuración de Workers Builds

- Repositorio: `blex-ing/mini_podcast`
- Producción: `master`
- Nombre: `mini-podcast`
- Path: `/`
- Build: `cd web && npm install && npm run build`
- Deploy: `npx wrangler deploy`
- Preview: `npx wrangler preview`
- Enable Preview builds: sí
- Access: opcional; no para demo pública.

Estas instrucciones se refieren a **Workers Builds**, no al formulario clásico de Cloudflare Pages.

## Validación de release

1. CI Python y web sin fallos.
2. URL Preview de la rama de release responde y muestra el estudio.
3. QA móvil/escritorio y enlaces de navegación.
4. Publicar a `master` mediante PR `release/*`.
5. Verificar URL de producción y crear tag de GitHub Release.
6. Sincronizar `master` a `develop`.

## Backend futuro

La extracción de artículos debe hacerse en servidor con límites, timeouts y protección SSRF. Los secretos IA/TTS no se introducen jamás en el navegador; Supabase es opcional para Auth/datos. El deploy de la UI no implica que la generación de podcasts esté operativa.

**Estado:** configuración versionada en GitHub; la URL Workers real solo se confirma consultando Cloudflare tras conectar y desplegar el repositorio.

## Diagnóstico 2026-11-16 — Error de Preview

El build de Vite terminó correctamente, pero Wrangler falló porque faltaba `previews: {}` en `wrangler.jsonc`. Este bloque es obligatorio para ejecutar `npx wrangler preview` en Cloudflare Workers actuales.

**Distinguir los dos comandos en el panel Cloudflare:**
- **Deploy command:** `npx wrangler deploy` (producción, rama `master`).
- **Preview command:** `npx wrangler preview` (otras ramas).

Si el log dice «Executing user deploy command: npx wrangler preview», el campo Deploy command está mal configurado: cambiarlo desde Cloudflare → Worker → Settings → Build. El cambio en GitHub no altera esos campos del Dashboard.

Después de corregir el panel, lanzar un despliegue nuevo desde la rama `master` y comprobar la URL `workers.dev`.

## Corrección 2026-11-16 — Error 100324 (`_redirects`)

Workers Static Assets rechazó `web/public/_redirects` con `/* /index.html 200` porque generaba un bucle infinito. Vite copia automáticamente `public/_redirects` a `web/dist/_redirects`; Wrangler lo interpreta durante el despliegue.

**Resolución:** eliminar `web/public/_redirects`. La aplicación ya tiene `assets.not_found_handling: single-page-application` en el archivo raíz `wrangler.jsonc`, suficiente para el fallback de una SPA en Workers.

No reintroducir reglas `/* /index.html 200` al utilizar Workers Static Assets. Comprobar en un despliegue real que desaparece el error 100324.

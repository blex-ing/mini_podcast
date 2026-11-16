# Changelog

## v0.5.0 — Glass híbrido, QA visual y CI segura
- Glass híbrido compartido en navegación, los dos paneles de Studio y los tres KPI de Roadmap.
- Fallback ligero de KPI en móviles y soporte para transparencia/movimiento reducidos.
- Pruebas Playwright con capturas automáticas y detección de problemas responsive (8/8 tests).
- GitHub Actions oficiales actualizadas a v7 verificadas, fijadas por SHA, con Node.js 24 y permisos mínimos.
- Instalación reproducible mediante package-lock + npm ci; Dependabot semanal y auditoría npm.
- Registro de requisitos evolutivos, decisiones visuales y seguridad del pipeline.
- Pendiente: validación visual tras despliegue Cloudflare en Safari real; issue #20 para avisos moderados del tooling.

## v0.4.0 — Sistema de diseño
- Tokens de paleta, tipografía, espaciado, radios y sombras.
- Primitivas compartidas para superficies, controles y estados.
- Refactorización Studio/Roadmap con identidad visual consistente.
- Quality gate de diseño en CI y documentación canónica.
- Roadmap: 13 features, 100 puntos ponderados.

## v0.3.0 — Arquitectura y Roadmap
- Visión de producto y definición del MVP general de podcasts.
- Arquitectura modular reutilizable para perfiles especializados, incluido Un Capítulo con Jesús.
- Página /#roadmap con 5 hitos, 12 features y avance ponderado de desarrollo y producción.
- Consulta GitHub para detectar PRs integrados y publicaciones en master.
- Comprobación de integridad del roadmap en CI.

## v0.2.2 — Cloudflare Workers redirect fix
- Eliminar `web/public/_redirects` por bucle infinito (Cloudflare 100324).
- Conservar el fallback SPA nativo de Workers en `wrangler.jsonc`.

## v0.2.1 — Cloudflare Preview fix
- Habilitar `previews: {}` para Workers Previews.
- Aclarar comandos separados de publicación y vista previa.

## v0.2.0 — Interfaz Studio y Cloudflare Workers
- Primer frontend responsive React/Vite/TypeScript con formulario y biblioteca de ejemplo.
- Configuración `wrangler.jsonc` para publicar assets estáticos en Cloudflare Workers.
- Supabase opcional y persistencia por usuario con RLS.
- CI ampliada para build y lint web; notas de release dinámicas.
- La generación de audio y la extracción remota quedan pendientes.

## v0.1.0 — Base de desarrollo
- Adopción del flujo de ramas y releases de Yachay Kichwa.
- Documentación de arquitectura de desarrollo para Python.
- CI, plantilla de Pull Requests y reglas de archivos ignorados.
- Automatización de limpieza de ramas y publicación de GitHub Releases.
- No se modifica la lógica del script histórico.

> Esta versión prepara la infraestructura; todavía no genera podcasts completos.

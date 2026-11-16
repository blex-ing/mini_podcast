# Arquitectura de Cloudflare Pages

GitHub es la fuente única de verdad.

```text
feature/*  → CI → Cloudflare Preview → PR develop
develop    → CI → Cloudflare Preview (integración)
release/*  → CI → Cloudflare Preview (release candidate)
master     → CI → Cloudflare Production
```

El proyecto de Pages debe configurar:
- Repositorio: `blex-ing/mini_podcast`.
- Rama de producción: `master`.
- Directorio raíz: `web`.
- Comando de build: `npm run build`.
- Directorio de salida: `dist`.
- Node.js: 22.

La UI estática funciona sin backend, usando una vista previa. El backend futuro podrá implementarse con Cloudflare Workers / backend Python independiente; Supabase se mantiene como opción para autenticación y metadatos.

No exponer claves privadas en el cliente. La integración de extracción URL necesita controles SSRF en el backend. La generación de audio no debe ejecutarse directamente desde el navegador con claves privadas.

**Estado:** preparado para conectar; no hay despliegue ni URL pública confirmada hasta que se cree el proyecto Pages en Cloudflare.

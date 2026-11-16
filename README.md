# Mini Podcast — motor general de podcasts con inteligencia artificial

**Visión:** convertir artículos, documentos y textos en episodios de audio mediante un motor reutilizable y diferentes perfiles editoriales, incluido **Un Capítulo con Jesús**.

## Estado actual
- Web responsive de Mini Podcast Studio desplegable en Cloudflare Workers.
- Primera página de **Roadmap** (`/#roadmap`) con hitos, features, criterios de aceptación, avance ponderado de desarrollo/producción y referencias GitHub.
- Procesamiento completo URL → guion → MP3 **aún pendiente**. El script Python original de extracción HTML es experimental.
- Supabase preparado como opción; no es obligatorio para la web informativa.

## Documentación canónica
- [Visión y alcance MVP](documentacion/VISION_Y_MVP_V1.md)
- [Arquitectura modular v1](documentacion/ARQUITECTURA_V1.md)
- [Roadmap, porcentajes y seguimiento](documentacion/ROADMAP_Y_SEGUIMIENTO.md)
- [Flujo Git y releases](documentacion/FLUJO_GIT_Y_RELEASES.md)
- [Cloudflare Workers](documentacion/DESPLIEGUE_CLOUDFLARE.md)

## Desarrollo
```bash
cd web
npm install
npm run validate:roadmap
npm run build
npm run lint
npm run dev
```

## Roadmap
El catálogo versionado vive en `web/src/data/roadmap.json` y debe totalizar 100 puntos ponderados. `web/src/data/roadmap.ts` calcula estados desde Pull Requests GitHub fusionados a `develop` y verifica la presencia en `master`. Sin red muestra la línea base verificada; no se afirma sincronización en vivo. Las futuras features deben usar su branch registrada para permitir el seguimiento automático. Por ahora no se necesita un backend para este tablero.

## Flujo de publicación
`feature/* → PR a develop → release/vX.Y.Z → PR a master → tag → sincronización master→develop`.

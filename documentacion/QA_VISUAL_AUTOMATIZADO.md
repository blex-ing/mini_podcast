# QA visual automatizado — Mini Podcast

**Estado:** piloto en `feature/hybrid-liquid-glass`, pendiente de aprobación visual y posterior promoción a `develop` / `master`.

## Metodología reproducible
El job `Visual QA (Chromium screenshots)` de `.github/workflows/ci.yml` compila Vite y ejecuta `npm run test:visual` con Playwright/Chromium **sin desplegar en Cloudflare**. Produce capturas completas de Studio y Roadmap a 1440×900, 768×1024, 390×844 y 320×740, además de la comprobación del cursor y preferencia de movimiento reducido. Publica un artefacto ZIP con PNG y reporte HTML para cada ejecución.

Ver pruebas: `web/tests/visual/visual.spec.ts`, configuración: `web/playwright.visual.config.ts`.

## Ejecución y evidencias
- Primer ciclo: run [43793063733](https://github.com/blex-ing/mini_podcast/actions/runs/43793063733). **5/6 aprobadas**; la prueba de puntero falló por apuntar fuera del viewport. Se corrigió desplazando primero el panel a pantalla.
- Segundo ciclo: run [43793237010](https://github.com/blex-ing/mini_podcast/actions/runs/43793237010). **6/6 aprobadas**. Se descargaron y revisaron visualmente las capturas.
- Auditoría visual detectó defecto **NAV-320-001**: a 320 px el enlace Roadmap quedaba cortado en el extremo derecho aunque no existía scroll horizontal visible; `.site { overflow: hidden; }` ocultaba el problema. Se reforzó la prueba comprobando los límites de cada enlace visible.
- Último ciclo: run [43793598033](https://github.com/blex-ing/mini_podcast/actions/runs/43793598033). **6/6 aprobadas** con la nueva comprobación. Se inspeccionó la captura corregida `studio-small-mobile.png` y ahora «Estudio» y «Roadmap» quedan dentro de los 320 px.

## Evaluación visual humana asistida (no confundir con CI)
Inspección de capturas reales generadas en Chromium:
| Aspecto | Nota orientativa | Observación |
|---|---:|---|
| Coherencia cromática | 8/10 | Tinta nocturna y lila consistentes entre Studio y Roadmap |
| Jerarquía/espaciado | 8/10 | Paneles y titulares ordenados, proporciones desktop correctas |
| Adaptación móvil | 8/10 | Se detectó y corrigió enlace Roadmap recortado a 320 px |
| Coherencia Glass | 8/10 | Ambos paneles de Studio usan `HybridGlassSurface`; puntero probado |
| Estado funcional | Sin nota | Generación de audio todavía pendiente, fuera del alcance del QA visual |

**Evaluación global orientativa de diseño: 8/10.** Es una valoración de capturas, **no** un análisis automático de estética ni medición en Safari real. La prueba Chromium valida geometría y eventos; no sustituye comprobar efectos de transparencia, brillo, autonomía y rendimiento en iPhone.

## Hallazgos abiertos
1. **ROADMAP-STATUS-001 (baja):** las capturas de CI muestran en Roadmap el estado `Consultando GitHub…` y la línea base (20 %), por depender de una consulta asíncrona de la API pública. Evitar usar esa cifra temporal para valorar el avance real. Recomendación: esperar explícitamente en el test a `Sincronizado`/`Sin conexión` y revisar la actualización de la línea base verificada cuando corresponda.
2. **SAFARI-QA-001 (pendiente):** revisar en Safari iPhone real la estética del Glass, la fluidez y `prefers-reduced-transparency`.
3. **REGRESSION-001 (futuro):** al aprobar la identidad visual, introducir capturas base versionadas y comparaciones visuales con tolerancias, evitando que pequeños cambios inadvertidos alteren el diseño.

## Criterio de promoción
No fusionar el PR #19 hasta validar la Preview Cloudflare y contar con aprobación explícita del usuario. La aprobación de CI significa **pasa pruebas automatizadas**, no que todas las cuestiones estéticas estén resueltas.

## Trazabilidad
`REQUISITOS_EVOLUTIVOS.md`: RNF-VIS-001, RNF-GLASS-005, RNF-GLASS-004.

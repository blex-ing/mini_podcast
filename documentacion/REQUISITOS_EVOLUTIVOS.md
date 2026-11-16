# Requisitos evolutivos — Mini Podcast

**ID documental:** MP-REQ · **Versión:** 1.0 (inicial) · **Estado:** vivo, versionado por Pull Requests.

## Propósito y mantenimiento
Este documento constituye el registro acumulativo de requisitos del producto. No sustituye la visión, arquitectura ni sistema de diseño: los referencia. Cada nueva feature debe **añadir** o versionar requisitos, indicar su estado, criterios de aceptación y evidencias (rama/PR/QA/release). No borrar requisitos históricos sin registrar la decisión. Estados válidos: `propuesto`, `en_desarrollo`, `validado_en_preview`, `integrado_develop`, `publicado_master`, `descartado`.

## Trazabilidad (índice)
| ID | Tipo | Requisito | Estado | Feature | Evidencia |
|---|---|---|---|---|---|
| RF-001 | Funcional | Crear borrador de episodio mediante URL validada | publicado_master (solo borrador opcional Supabase) | studio-ui | v0.2.0 |
| RF-002 | Funcional | Roadmap con hitos y estados GitHub | publicado_master | roadmap-management | v0.3.0 |
| RNF-001 | Calidad visual | Sistema de tokens y reglas CI compartidos | publicado_master | frontend-design-system | v0.4.0 |
| RF-GLASS-001 | UI | Activar Glass híbrido únicamente en navegación y superficies de alto valor | en_desarrollo | feature/hybrid-liquid-glass | PR #19 |
| RNF-GLASS-001 | Rendimiento | Restringir blur intensivo y evitar filtros caros en listas / tarjetas | en_desarrollo | feature/hybrid-liquid-glass | QA móvil pendiente |
| RNF-GLASS-002 | Accesibilidad | Reducir movimiento/transparencia según preferencias y fallback sin filtros | en_desarrollo | feature/hybrid-liquid-glass | QA pendiente |
| RNF-GLASS-003 | Consistencia | Usar tokens y componentes canónicos sin colores arbitrarios | en_desarrollo | feature/hybrid-liquid-glass | CI GitHub Actions correcta (PR #19) |
| RNF-VIS-001 | Control visual | Generar capturas de Studio y Roadmap y detectar desbordamientos, colisiones y fallos de interacción antes de Cloudflare | en_desarrollo | feature/hybrid-liquid-glass | Playwright + GitHub Actions, validación en curso |
| RNF-GLASS-005 | Coherencia UI | Paneles equivalentes comparten componente y respuesta al cursor | en_desarrollo | feature/hybrid-liquid-glass | Studio: 2 paneles; Roadmap: 3 KPI con HybridGlassSurface; revisión de PR #19 |
| RNF-GLASS-004 | Despliegue | Validar en Preview de Cloudflare antes de fusionar a develop/master | en_desarrollo | feature/hybrid-liquid-glass | URL Preview y revisión visual pendientes |

## Feature: Glass híbrido (MP-GLASS-001)

**Problema:** la v0.4.0 utiliza glassmorphism con `backdrop-filter` real, pero no tiene reflejos direccionales ni respuesta a interacción. Se desea aproximar selectivamente el efecto visual de Liquid Glass en iPhone sin afirmar que sea el material nativo de iOS.

### RF-GLASS-001 — Alcance funcional
1. Cabecera/navegación: material translúcido avanzado con iluminación de borde, profundidad y respuesta al puntero **solo donde sea útil**.
2. Controles destacados: acciones principales y filtros de selección con realces definidos y transiciones discretas.
3. Paneles destacados: **ambas cajas hermanas** de Studio («Nuevo proyecto» y «De la lectura al audio») deben compartir el mismo material y la misma respuesta al cursor, y **las tres métricas KPI del Roadmap** («Avance de desarrollo», «Publicado en master», «Features completadas»), que deben compartir el mismo tratamiento interactivo; el resto conserva superficies Soft/Glass básico.
4. Layout coherente en 320/390/768/1440 px y navegación usable con teclado o touch.
5. El material debe apoyarse en `tokens.css` y clases documentadas de `primitives.css`; ningún color nuevo dentro de los componentes.

### RNF-GLASS-001 — Rendimiento
- Aplicar el material a una navegación, los dos paneles principales de Studio y al grupo de tres KPI del Roadmap. Los KPI constituyen un mismo grupo jerárquico y comparten componente, pero cada tarjeta responde de forma independiente.
- En pantallas de 900 px o menos y dispositivos táctiles, desactivar el filtro de fondo **en los KPI** y mantener solo un reflejo estático y una superficie sólida. Evitar filtros de fondo repetidos en listas de features, hitos y tarjetas densas.
- `backdrop-filter` solo cuando esté soportado y el usuario no solicite transparencia reducida; fallback sólido siempre disponible.
- Sin WebGL, `feTurbulence` animado, `requestAnimationFrame` permanente ni seguimiento de puntero en cada tarjeta.
- Interacción con eventos de puntero únicamente en dispositivos `hover: hover` y `pointer: fine`; sin cálculo React por frame.
- Objetivo de revisión: sin desplazamiento entrecortado ni sobrecalentamiento apreciable en Safari iPhone; medir después con DevTools/inspección real. No afirmar métricas aún no medidas.

### RNF-GLASS-002 — Accesibilidad
- `prefers-reduced-motion`: desactivar reflejos animados y movimientos.
- `prefers-reduced-transparency`: sustituir material translúcido por superficie sólida.
- `@supports` para respaldo de navegadores sin `backdrop-filter`.
- Contraste adecuado en textos, foco visible y objetivos táctiles ≥44 px donde corresponda.

### RNF-GLASS-003 — Calidad
- Utilizar tokens ya existentes o declarar nuevos tokens semánticos en `web/src/styles/tokens.css` con documentación.
- CI `npm run check:design`, `npm run build`, `npm run lint` y `npm run validate:roadmap` en verde.
- Sin alterar flujo de autenticación, borradores, roadmap ni API.

### RNF-GLASS-005 — Paridad entre componentes equivalentes
- Los paneles vecinos de una misma sección y jerarquía visual deben usar el mismo componente reutilizable `HybridGlassSurface`: los dos de Studio y los tres KPI superiores de Roadmap.
- El material y la respuesta del reflejo al cursor se definen en un único lugar; queda prohibido actualizar una caja y dejar otra equivalente con tratamiento antiguo.
- Criterio de aceptación visual: mover el cursor sobre los dos paneles de Studio o sobre cualquiera de los tres KPI produce el mismo tipo de iluminación, con intensidad y transición coherentes; comprobar superficies en móvil sin cursor. Las tarjetas de hitos y las filas de features siguen siendo ligeras.
- Evidencia: comentario del usuario y captura de pantalla recibida durante la revisión del PR #19. Validación visual corregida aún pendiente.

### RNF-GLASS-004 — Promoción controlada
1. Crear `feature/hybrid-liquid-glass` desde `develop`.
2. Implementar y abrir PR **sin fusionar**; confirmar en GitHub Actions que pasa CI.
3. Probar el despliegue Preview de Cloudflare correspondiente a la rama/PR. No suponer la URL hasta verificarla en Cloudflare.
4. Recoger aprobación visual explícita del usuario para escritorio y móvil.
5. **Solo tras aprobación:** PR feature → `develop`, `release/vX.Y.Z` → `master`; etiqueta y GitHub Release automáticas.
6. Actualizar en este registro estado, PR y release reales, y en el Roadmap si se decide incorporarlo como feature ponderada.

### Decisión UI — ADR-GLASS-002 (16-11-2026)
Tras revisar la captura aportada por el usuario del Roadmap, se detectó que solo «Avance de desarrollo» usaba reflejos interactivos, mientras «Publicado en master» y «Features completadas» no. Se decide mantener el Glass híbrido en los **tres KPI equivalentes**, compartiendo componente, y limitar el trabajo gráfico mediante fallback sólido y sin backdrop-filter en KPI móviles. Los hitos, filas de features y biblioteca conservan superficies ligeras. La corrección queda sujeta a QA automático y aprobación visual de la Preview antes de fusionar.

## Evidencias del prototipo
- Pull Request borrador: https://github.com/blex-ing/mini_podcast/pull/19
- Validación automatizada de la feature: https://github.com/blex-ing/mini_podcast/actions/runs/43791176949 (Python, build TypeScript/Vite, lint, validación del roadmap y del sistema de diseño: correctas).
- Validación visual en Cloudflare Worker Preview, Safari iPhone y escritorio: **pendiente de usuario**. Este prototipo no se considera publicado ni aceptado.
- Nota técnica: `backdrop-filter` es real; los reflejos y capas especulares son CSS. No existe refracción óptica nativa de iOS.

## RNF-VIS-001 — Quality gate visual antes de Cloudflare

El frontend debe ejecutarse localmente en CI con Chromium (Playwright), sin depender de un despliegue remoto. Para cada feature UI, guardar capturas reproducibles de Studio y Roadmap a 1440×900, 768×1024, 390×844 y 320×740, más capturas/trace de fallo. Comprobar:
- Ausencia de scroll horizontal inesperado en esas resoluciones.
- Ausencia de colisiones entre elementos de navegación visibles.
- Paneles y elementos principales existentes y visibles.
- Errores JavaScript no capturados.
- Paridad del efecto Glass en las cajas hermanas.
- Navegación con movimiento reducido.

Las capturas y el HTML report se conservarán como artefactos descargables de GitHub Actions, incluso si fallan las pruebas. **Las capturas no equivalen por sí solas a una inspección estética humana ni aseguran compatibilidad idéntica con Safari iOS.** El asistente podrá calificar subjetivamente los materiales, la jerarquía, los espacios y los contrastes cuando tenga acceso a las imágenes, y deberá diferenciar las observaciones visuales de los resultados medidos del navegador.

En futuros cambios visuales importantes, comparar capturas con las de la última versión aprobada y adjuntar hallazgos/reparaciones al PR antes de solicitar la validación humana en Cloudflare.

## Referencias
- [Visión y MVP](VISION_Y_MVP_V1.md)
- [Arquitectura](ARQUITECTURA_V1.md)
- [Sistema de diseño](DESIGN_SYSTEM_MINI_PODCAST.md)
- [Seguimiento y Git Flow](ROADMAP_Y_SEGUIMIENTO.md)

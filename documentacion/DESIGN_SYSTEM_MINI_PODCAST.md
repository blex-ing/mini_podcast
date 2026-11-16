# Sistema de diseño — Mini Podcast Studio

**Versión visual:** 1.0.0  
**Estado:** contrato obligatorio para nuevas features de frontend.  
**Inspiración de proceso:** `documentacion/DESIGN_SYSTEM_YACHAY.md` de Yachay Kichwa. Se adoptan sus principios de gobernanza, no su paleta verde.

## 1. Objetivo
Mantener una única identidad visual entre Studio, Biblioteca, Roadmap y futuros productos. Ninguna feature debe inventar colores, radios, tipografías, sombras o materiales sin registrarlos previamente en la fuente canónica.

**Principio:** una identidad violeta/tinta con jerarquía estable, no un color diferente para cada componente.

## 2. Fuente de verdad
- `web/src/styles/tokens.css` es el **único archivo donde se definen los colores en hexadecimal** y tokens semánticos.
- `web/src/styles/primitives.css` contiene los **materiales y controles reutilizables**.
- `web/src/styles.css` contiene el layout y estilos históricos de páginas. Sus colores y radios ya referencian tokens.
- `web/scripts/check-design-system.mjs` impide en CI introducir colores literales en el frontend fuera de `tokens.css`.
- Nuevos colores o escalas requieren documentación, justificación y PR de design system; nunca se improvisan en una feature.

## 3. Identidad
- Fondo: tinta nocturna `--color-background`.
- Texto principal: marfil/lavanda muy clara `--color-text`.
- Primario: lila `--color-primary` (botones/acento), hover `--color-primary-soft`.
- Secundario: `--color-text-muted`; metadatos: `--color-text-faint`.
- Paneles: `--color-surface`, `--color-glass`, `--color-glass-strong`.
- Acentos excepcionalmente documentados: `--color-rose` y `--color-blue` para ilustraciones o categorías; **no** para estados de éxito/error por estética.
- Contraste de texto: comprobar al menos WCAG AA en combinaciones principales; no usar textos poco legibles por estética.

## 4. Tipografía
`--font-ui` (DM Sans) para lectura, formularios y controles; `--font-heading` (Manrope) para titulares; `--font-editorial` (Georgia) solo para énfasis editorial. Los tamaños comunes están definidos como `--font-size-*`. No elegir una fuente distinta en una feature.

## 5. Escalas
- Espaciado: `--space-1` (4), `--space-2` (8), `--space-3` (12), `--space-4` (16), `--space-5` (20), `--space-6` (24), `--space-8` (32), `--space-10` (40), `--space-12` (48).
- Radios: `--radius-xs`, `--radius-sm`, `--radius-control`, `--radius-card`, `--radius-panel`, `--radius-shell`, `--radius-pill`.
- Elevaciones: `--shadow-card` y `--shadow-glass`.
- Movimiento: `--motion-fast`, `--motion-normal`.

## 6. Materiales y jerarquía
| Tipo | Clase compartida | Uso |
|---|---|---|
| Glass Primary | `.ui-glass-primary` | Panel principal, modal, área de trabajo |
| Glass Card | `.ui-glass-card` | Resúmenes, tarjetas independientes |
| Soft Surface | `.ui-soft-surface` | Contenido interior, filtros, filas |
| Editorial / Info | `.ui-editorial-surface` | Notas, procedencia, advertencias informativas |
| Botón primario | `.ui-button.ui-button-primary` | Una acción principal por contexto |
| Botón secundario | `.ui-button.ui-button-secondary` | Alternativas sin competir visualmente |
| Etiqueta | `.ui-chip` | Estados, categorías y metadatos |

No anidar varias superficies glass con blur y sombra completos. Un contenido dentro de un panel utiliza Soft Surface, sin elevación redundante.

## 7. Reglas de implementación
1. Antes de crear una página o componente, elegir material y token semántico.
2. Reutilizar `ui-*` y las clases de componente que ya existen; CSS de feature define estructura/layout, no colores nuevos.
3. No escribir `#hex`, `rgb()`, `hsl()` u otros literales de color en CSS/TSX fuera de `tokens.css`. Usar `var(--color-*)`; transparencia mediante `color-mix(in srgb, var(--color-*) N%, transparent)`.
4. Un cambio de identidad debe modificar tokens y actualizar este documento y QA visual; no distribuir cambios en múltiples componentes.
5. Para productos especializados (p. ej. *Un Capítulo con Jesús*), se permite una capa de tema declarativa con nombres semánticos, heredando espaciados y componentes; no introducir paletas ad hoc en las vistas.
6. Cambiar tokens implica revisar impacto transversal en Studio y Roadmap.
7. Usar variantes semánticas de estado; no comunicar `error` o `completado` exclusivamente mediante color.

## 8. Responsive y accesibilidad
- Comprobar 320, 390, 768 y 1440 px, con navegación y controles táctiles ≥44 px cuando sea interactivo.
- Revisar tabulación y `:focus-visible`.
- Respetar `prefers-reduced-motion` y `prefers-reduced-transparency`. Glass pasa a una superficie sólida en transparencia reducida.
- Mantener equivalencia visual móvil/escritorio: cambia el layout, no la paleta ni la semántica.
- No se añaden nuevos efectos si empeoran lectura, CPU o batería en móviles.

## 9. Quality gate obligatorio para PR frontend
- `cd web && npm run check:design && npm run validate:roadmap && npm run build && npm run lint`.
- Revisar Studio, Biblioteca, Roadmap, modal de autenticación y estados vacíos.
- Validar hover, focus, disabled, error, completado y scroll anclado.
- Revisar los cuatro anchos indicados, teclado y preferencias de accesibilidad.
- No se aprueba el PR si introduce literales visuales no autorizados. Si aparece una necesidad nueva, primero se amplían los tokens mediante un PR justificado.

## 10. Auditoría inicial
La interfaz anterior acumulaba **170 usos de color hexadecimal y 144 valores distintos** en `web/src/styles.css` (incluido Roadmap). Se han transformado en referencias a una paleta deliberada y tokens semánticos, conservando la dirección estética lila/tinta y centralizando asimismo las familias tipográficas y radios. Los microajustes visuales deben validarse en Cloudflare Preview antes de producción.


## 11. Material híbrido — feature/hybrid-liquid-glass (propuesta en validación)

El material `ui-hybrid-glass` es **una aproximación web** a Liquid Glass, no el material nativo de Apple ni una refracción óptica exacta. Combina `backdrop-filter` real, capas de luz especular, gradientes de borde y posición luminosa reactiva al puntero. No se utilizan efectos 3D costosos ni simulaciones de refracción sobre todo el documento.

Aplicar **solo** a:
- Cabecera (`nav.ui-hybrid-glass`).
- Panel principal para crear un episodio (`editor.ui-hybrid-glass`).
- Métrica principal del Roadmap (`roadmap-main-stat.ui-hybrid-glass`).
- Botones principales con `ui-hybrid-control`.

El resto mantiene Glass básico o Soft Surface, evitando múltiples `backdrop-filter` simultáneos en bibliotecas y listas. Los tokens canónicos se encuentran en `web/src/styles/tokens.css` con prefijo `--glass-hybrid-*`.

**Calidad y accesibilidad:** `@supports` ofrece fondo sólido cuando el blur no existe; `prefers-reduced-transparency` elimina transparencia; `prefers-reduced-motion` elimina desplazamientos; el seguimiento del puntero no usa estado React, y en móviles touch se mantiene la iluminación fija.

**Trazabilidad:** requisitos RF-GLASS-001 y RNF-GLASS-001–004 en [REQUISITOS_EVOLUTIVOS.md](REQUISITOS_EVOLUTIVOS.md). Está pendiente la validación visual de la Preview Cloudflare; no promocionar a `develop` o `master` hasta contar con aprobación.

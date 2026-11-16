# Seguridad y mantenimiento del pipeline de Mini Podcast

**Estado:** política de CI implantada en `feature/hybrid-liquid-glass`, revisión de PR #19. **Fecha:** 16-11-2026. Esta documentación describe la política efectiva de la rama; su incorporación a `master` dependerá del flujo de release y la aprobación de la feature.

## Decisión técnica SEC-CI-001 — Acciones oficiales, actuales y verificadas

El aviso de GitHub [deprecación de Node.js 20 (2025)](https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/) es histórico y está marcado como *Retired*. La [retirada definitiva de Node.js 20](https://github.blog/changelog/2026-09-23-node-20-is-no-longer-available-in-github-actions/) ocurrió el **23 de septiembre de 2026**. Mantener `actions/*@v4` o `setup-python@v5` generaba avisos de compatibilidad: aunque GitHub forzaba Node24 al ejecutar las acciones, debíamos migrarlas.

El 16-11-2026 se comprobó la última release estable de cada **repositorio oficial** mediante GitHub Releases y se resolvió la etiqueta exacta a un objeto commit mediante la API de GitHub:

| Acción | Release estable | Commit íntegro verificado |
|---|---|---|
| actions/checkout | v7.0.1 | `3d3c42e5aac5ba805825da76410c181273ba90b1` |
| actions/setup-node | v7.1.0 | `949feb2413d6458794dcd2491c4babbbce0c15c1` |
| actions/setup-python | v7.1.0 | `6d4fd22b20465ccc0f7354476588e8df7c9ca0e0` |
| actions/upload-artifact | v7.0.2 | `cf430e030ddbb5b0abf93d22962f4752f3646cd9` |

Usar en YAML `uses: actions/<acción>@<SHA>` con comentario legible `# vX.Y.Z`: los tags son referencias móviles, los SHA exactos son reproducibles. No asumir que una versión mayor es la más reciente sin consultar el upstream y revisar los cambios incompatibles.

## Runtime y dependencias
- Los workflows CI de web y Playwright usan **Node.js 24** (LTS) para el proyecto. Las acciones v7 usan un runtime interno Node24; ambas cosas son independientes.
- Python del pipeline permanece en la rama 3.12, soportada; cambios de versión de Python se validarán antes de migrarlos.
- `web/package-lock.json` se genera mediante npm en el runner Node24 y se **versiona**. `npm ci --no-audit --no-fund` instala versiones fijadas; `npm install` no debe sustituir a `npm ci` en CI cuando existe un lockfile.
- La comprobación `npm audit --audit-level=high` analiza **dependencias de producción y desarrollo** y bloquea la CI ante vulnerabilidades altas o críticas. Los avisos de paquetes ya fuera de soporte se gestionan también mediante revisión de versiones, no únicamente con `npm audit`.
- `npm run test:visual` usa Playwright real en Chromium local. `actions/upload-artifact` conserva capturas/HTML report durante un período limitado. No se captura ni publica información real de usuarios.
- No desactivar errores con `continue-on-error` ni reemplazar pruebas oficiales por herramientas inventadas.

## Autorización mínima de GitHub Actions
- `ci.yml`: `contents: read`, checkout con `persist-credentials: false`.
- `publish-release.yml`: permiso global lectura; **solo** el job de publicación posee `contents: write`, indispensable para tag y GitHub Release.
- `cleanup-temporary-branches.yml`: permiso global lectura; **solo** el job de limpieza posee `contents: write`.
- No insertar secrets, tokens o datos personales en logs de prueba ni en artefactos públicos. No usar permisos `write-all`.

## Mantenimiento automatizado
`.github/dependabot.yml` solicita actualizaciones semanales con Pull Requests de dependencias npm y GitHub Actions dirigidos a `develop`. No se aprueban ni fusionan automáticamente; validar impacto, cambios incompatibles y QA antes de promoverlos a producción. El uso de SHA explícitos no elimina la necesidad de actualizaciones.

## Flujo de verificación obligatorio de herramientas externas
1. Identificar la dependencia/acción que necesitamos y buscar primero la solución oficial disponible.
2. Leer release oficial, cambios incompatibles y requisitos de runtime.
3. Resolver referencia concreta a commit en el repositorio del mantenedor y **no fabricar hashes** ni asumir compatibilidad.
4. Modificar en `feature/*`, crear PR, ejecutar CI y visual QA, revisar warnings y artefactos.
5. Registrar evidencia GitHub Actions y decisión antes de fusionar. Nunca declarar ausencia de riesgos sin auditoría.
6. Promoción a `master` sujeta a la aprobación acordada y flujo `develop → release → master`.

## Controles complementarios para siguientes features
Revisar periódicamente la conveniencia de los *workflow dependency lockfiles* nativos de GitHub (generalmente disponibles desde octubre 2026), que también verifican la identidad y dependencias transitivas de las acciones. No se ha generado uno en este cambio; el pinning por SHA es nuestro control efectivo actual.

Consultar también [REQUISITOS_EVOLUTIVOS.md](REQUISITOS_EVOLUTIVOS.md) y [DESIGN_SYSTEM_MINI_PODCAST.md](DESIGN_SYSTEM_MINI_PODCAST.md).

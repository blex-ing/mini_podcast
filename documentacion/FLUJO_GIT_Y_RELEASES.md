# Flujo Git, QA y releases — mini_podcast

## Fuente de verdad
GitHub es la fuente de verdad. Se adopta el proceso probado en Yachay Kichwa, adaptado a una aplicación Python. Solo `develop` y `master` son ramas permanentes. `main` se conserva temporalmente como referencia histórica del repositorio original; no se usa para el desarrollo nuevo.

## Ramas
- `master`: versión estable y publicada.
- `develop`: integración de cambios aceptados.
- `feature/<nombre>`: desarrollo aislado desde `develop`.
- `release/vX.Y.Z`: estabilización de una versión congelada desde `develop`.

## Ciclo de feature
1. Crear `feature/<nombre>` desde `develop`.
2. Implementar, documentar, probar localmente y actualizar pruebas.
3. Abrir PR hacia `develop`, nunca hacia `master`.
4. Exigir CI satisfactoria, revisión del diff y QA relevante.
5. Fusionar mediante PR y eliminar la rama solo tras merge exitoso.

## Ciclo de release
1. Crear `release/vX.Y.Z` desde `develop` con una selección coherente de cambios.
2. Congelar funcionalidades: solo fixes, documentación, versión y estabilización.
3. Ejecutar CI + QA de flujos: URL → extracción → resumen → generación de audio, según los módulos implementados.
4. PR `release/vX.Y.Z` → `master` y merge tras aprobación.
5. Crear tag `vX.Y.Z` y GitHub Release con notas.
6. Sincronizar `master` → `develop` para recuperar fixes de release.
7. Eliminar rama temporal cuando sea seguro.

## Versionado
SemVer `MAJOR.MINOR.PATCH`. Hasta tener producto distribuible no se presupone una versión publicada. El primer tag se decidirá en la primera release real.

## Quality gates
- Sintaxis Python válida, lint y pruebas automatizadas disponibles.
- No subir secretos ni API keys, tokens, audios de usuarios o artefactos temporales.
- Pruebas unitarias sin servicios externos; pruebas de integración con credenciales en entornos controlados.
- PR con descripción, pruebas ejecutadas, riesgos y rollback.
- No publicar una versión si fallan las comprobaciones.

## Seguridad y limpieza
No borrar ramas sin comprobar que el PR quedó fusionado y que el SHA esperado coincide. La automatización de limpieza debe seguir el enfoque `force-with-lease` del proyecto Yachay, no un borrado por nombre sin verificar.

## Desarrollo mediante ChatGPT
Todo cambio realizado mediante el asistente sigue feature → PR a develop → release → PR a master. Nunca editar directamente `master`. Los cambios tienen que ser verificables en GitHub.

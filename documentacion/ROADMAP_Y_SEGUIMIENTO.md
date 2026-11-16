# Roadmap y seguimiento — Mini Podcast

## Fuente de datos
`web/src/data/roadmap.json` es el inventario de **alcance aprobado**: hitos, features, pesos, criterios de aceptación, ramas y referencias históricas. La página `/#roadmap` consume ese inventario. No es una lista de commits ni un porcentaje de líneas de código.

El estado de una feature futura se resuelve consultando en GitHub los PR fusionados a `develop` de la rama exacta declarada. Para confirmar publicación, se verifica que el commit de merge del PR esté incluido en `master` mediante la comparación de commits GitHub. La web jamás marca como completado un PR solo por estar cerrado, ni atribuye un PR con branch distinta.

**Si GitHub no está accesible:** se conserva el estado verificado de referencia del JSON y se informa claramente de que no hay sincronización en vivo. Así no se declara un éxito que no podamos comprobar.

## Porcentajes y alcance
- Cada feature tiene `weight` positivo y fijo durante su alcance; el total del plan vigente debe ser **100**.
- Avance de desarrollo = suma de pesos de features completadas e integradas en `develop`.
- Avance publicado = suma de pesos de features presentes en `master`.
- Pendiente = 100 menos avance de desarrollo (o, según contexto, 100 menos publicado).
- Feature en curso: etiqueta `en desarrollo`, sin porcentaje parcial ficticio.
- Hito: suma de pesos completados del hito / suma de todos los pesos del hito × 100, redondeo a entero.
- En caso de ampliar alcance, versión nueva del plan y anotación en el changelog: los porcentajes históricos pueden variar al redefinir el denominador.

## Flujo operativo
1. Abrir `feature/<nombre>` desde `develop` y utilizar **exactamente la rama registrada** en el inventario (o registrar una nueva feature antes del PR).
2. Desarrollar y añadir tests/QA y criterios de aceptación. Registrar el PR en su descripción.
3. GitHub Actions en verde, review y merge a `develop`.
4. La página consulta PRs GitHub y actualiza automáticamente el estado visible; no necesita editar JSON para marcar completada una feature registrada.
5. Congelar `release/vX.Y.Z`, QA y PR a `master`; tras merge, la página verifica la presencia del commit en `master`.
6. Mantener detalles en documentación/CHANGELOG y preservar referencias a PRs para trazabilidad.

## Estado verificado inicial
- Flujos Git y CI: PR #1, release v0.1.0.
- Interfaz Studio: PR #4, release v0.2.0.
- Integración Cloudflare: PRs #7 y #10, release v0.2.2.
- Estas tres features base suman **20 % del alcance actual**. No confundir con un 20 % de tiempo, coste o funcionalidad totalmente desplegada del sistema final.

## Criterios de integridad
- IDs de hito y feature únicos, pesos positivos que totalizan 100 y criterios de aceptación no vacíos.
- Cada feature futura tiene rama `feature/*` única y no se pueden declarar por error fechas/PRs completados.
- El histórico verificado no cambia sin revisión explícita.
- No usar tokens GitHub privados en la web: consulta pública de repo. La API pública puede imponer rate limit; en tal caso se usa estado de referencia y mensaje visible.
- Las pruebas CI validan el manifiesto del roadmap.

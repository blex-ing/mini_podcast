# Mini Podcast — Arquitectura objetivo v1

**Estado:** propuesta de diseño, no infraestructura ya desplegada. El código existente de React/Vite/Cloudflare se conserva. La implementación se dividirá en features aisladas.

## Separación de responsabilidades
1. **Clientes:** Mini Podcast Studio React y futuras experiencias por perfil.
2. **API (Cloudflare Worker):** autenticación, permisos, validación de solicitud, contratos HTTP, consultas de estados y enlaces de descarga. No almacenar llaves de IA en frontend.
3. **Orquestador de trabajos:** solicitud asíncrona, idempotencia, reintentos limitados, fallos, eventos y costes.
4. **Motor Python:** dominio, ingesta/limpieza, guiones, síntesis TTS, procesado de audio y adaptadores de proveedores.
5. **Persistencia:** PostgreSQL o Supabase (metadatos/autenticación con RLS cuando aplique) y R2 para MP3 privados. Soluciones definitivas pendientes de ADR.
6. **Productos:** perfiles declarativos independientes: general, Un Capítulo con Jesús y otros futuros.

```text
React/Vite (Cloudflare Workers Static Assets)
            │
      API Cloudflare Worker
            │
      Cola / gestor de jobs
            │
        Python Engine
    ┌───────┼────────┐
  Ingesta  Guion LLM  TTS/audio
    └───────┼────────┘
       Datos + archivos
```

## Módulos previstos
- `engine/domain`: Source, Project, Episode, ScriptVersion, GenerationJob, AudioAsset, ProviderUsage.
- `engine/ingestion`: adaptadores URL/texto, extracción, limpieza y referencia a origen.
- `engine/scripting`: plantillas, generación y revisión del guion, adaptador LLM.
- `engine/speech`: adaptadores TTS intercambiables y configuración de voz.
- `engine/audio`: normalización de audio, MP3 y validación de duración.
- `engine/orchestration`: casos de uso, cambios de estado, idempotencia, reintentos.
- `engine/providers`: configuración y clientes de proveedores.
- `products/general` y `products/un_capitulo_con_jesus`: perfiles editoriales, plantillas y validación.
- `apps/api`: contrato HTTP con frontend; integración asíncrona.
- `web/src/features`: estudio, biblioteca, reproductor, proyectos, roadmap.

## Contratos iniciales a desarrollar
- `POST /api/episodes`: crea borrador (URL/texto + proyecto), retorna ID.
- `POST /api/episodes/{id}/script`: crea trabajo de guion, retorna job ID.
- `PUT /api/episodes/{id}/script`: guarda revisión del texto y versión.
- `POST /api/episodes/{id}/audio`: crea job TTS idempotente (guion/version/voz).
- `GET /api/jobs/{id}`: estado y error sanitizado.
- `GET /api/episodes/{id}`: metadatos, duración y archivo disponible mediante URL temporal autorizada.

Los contratos HTTP no deben implementarse hasta contar con autenticación, límites y controles por usuario. Los nombres/rutas son propuesta versionable; definir schemas precisos en feature de API.

## Dominio y estados
`Project` identifica perfil y propietario; `Source` registra fuente y su procedencia; `Episode` agrupa guiones y audios; `ScriptVersion` preserva texto revisado; `GenerationJob` registra etapas; `AudioAsset` contiene metadata/ruta privada; `ProviderUsage` registra tokens/minutos/coste estimado.

Estados de trabajos y episodios: `draft → queued → processing → ready`, o `failed` con reintento limitado, idempotencia y auditoría. Publicación posterior solo con aprobación editorial donde aplique.

## Seguridad y fiabilidad
- Extracción de URLs solo desde backend: bloquear localhost, IPs privadas y reservadas, DNS rebinding, redirecciones a destinos privados y URLs que no sean HTTP(S); verificar DNS/IP de cada salto, limitar tamaño, tipos de contenido, tiempo y redirects.
- No exponer claves LLM/TTS ni service role en cliente; gestionar secretos del Worker/motor.
- Autenticación, autorización por proyecto y registro; RLS en tablas públicas; enlaces de audio firmados de corta duración.
- Rate limits, presupuesto/cupo, trazabilidad, minimización de datos y contenido.
- Aislar llamadas pagadas en tests mediante mocks; CI para Python/TypeScript y pruebas end-to-end futuras.
- Fallos de proveedor con reintentos acotados y sin duplicar cobros.

## Estrategia de despliegue
Mantener Cloudflare Workers para hosting de la SPA actual. Motor Python empaquetado y desplegado por separado (Docker/servicio elegido tras prototipo). La cola Cloudflare Queues es una opción para cargas y fiabilidad, no un requisito del primer incremento. Mantener salida reproducible en local y CI.

## Reglas de ampliación
La UI y los perfiles nunca acoplan directamente SDK de proveedores IA/TTS. Cada adaptación implementa contratos; migraciones de datos compatibles y documentación ADR. Un cambio de proveedor o de reglas editoriales no requiere cambiar el núcleo.

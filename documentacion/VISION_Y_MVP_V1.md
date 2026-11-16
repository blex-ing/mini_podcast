# Mini Podcast — Visión y MVP v1

## Origen y visión
El README original (diciembre de 2023) proponía extraer artículos desde URL con Python, resumirlos mediante ChatGPT y convertirlos en audio con IA. La prueba original implementó solo extracción HTML básica.

**Visión de producto (propuesta aprobada):** desarrollar un motor general y reutilizable de generación de podcasts a partir de contenido, con productos y perfiles especializados. Mini Podcast Studio será el primer cliente; **Un Capítulo con Jesús** será un primer perfil especializado. Podrán añadirse aprendizaje, noticias u otros perfiles sin duplicar los servicios de IA y audio.

**Promesa:** «Convierte lo que lees en lo que escuchas».

## Problema y usuario
Las personas encuentran artículos, documentos o textos interesantes que no siempre pueden leer. Se busca transformar esos contenidos en narraciones breves, fieles a la fuente, consultables desde distintos dispositivos.

## Objetivos
1. Generar un episodio corto a partir de una URL pública o un texto aportado.
2. Permitir revisar y editar el guion antes de sintetizar voz.
3. Reproducir, descargar y recuperar el audio generado.
4. Compartir la infraestructura entre productos manteniendo perfiles editoriales separados.
5. Mantener trazabilidad de la fuente, revisiones, estado y uso de proveedores.

## MVP funcional — definición de terminado
- Introducir URL HTTP(S) pública o texto; extraer y mostrar vista previa limpia con título y procedencia.
- Generar un guion breve (objetivo 3–5 min) mediante proveedor LLM desacoplado, citando/atribuyendo la fuente; permitir edición humana.
- Generar un MP3 con una voz TTS configurable y sin música.
- Mostrar estados draft / queued / processing / ready / failed y recuperar errores.
- Reproducir y descargar el audio; conservar episodios e historial por propietario.
- Pruebas unitarias e integración del flujo, manejo de coste, timeouts y autenticación antes de servicio público.

**No incluido en MVP:** conversación entre dos voces, RSS/Spotify, red social, efectos musicales, app nativa, edición de audio avanzada ni generación autónoma programada.

## Producto especializado: Un Capítulo con Jesús
Usará el mismo motor con sus propias plantillas, identidad, voz y guion editorial: introducción, lectura autorizada, contexto, explicación, reflexión y cierre. Reglas: identificar traducción, libro y versículos; no inventar citas o atribuir reflexiones a la Biblia; respetar licencias de traducciones; aprobación editorial humana antes de publicar.

## Alcance implementado vs propuesta
- Implementado: frontend React/Vite en Cloudflare Workers; formulario y biblioteca de ejemplo; persistencia opcional Supabase bajo configuración; flujo Git/CI.
- No implementado: extracción remota segura, generación de guiones, TTS, proceso asíncrono, almacenamiento de audios y perfiles activos.
- Se evitará atribuir progreso de producto a features que aún no cumplan sus criterios de aceptación.

## Decisiones principales
Arquitectura modular, Python para motor, API ligera Cloudflare para entrada/autorización, cola de trabajos cuando sea necesaria; PostgreSQL/Supabase y R2 como opciones para datos/archivos, no requisitos operativos actuales. Ver [ARQUITECTURA_V1.md](ARQUITECTURA_V1.md) y [ROADMAP_Y_SEGUIMIENTO.md](ROADMAP_Y_SEGUIMIENTO.md).

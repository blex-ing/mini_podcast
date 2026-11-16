# Arquitectura de desarrollo — mini_podcast

## Estado inicial constatado
Repositorio Python experimental con `2_recopilacion_info/procesar_texto.py`, que descarga una URL mediante `requests`, analiza HTML con BeautifulSoup y extrae texto. El script ejecuta una URL de ejemplo al importarse, carece de manejo explícito de errores y aún no ofrece pipeline completo de podcast. Se conserva sin modificaciones en la fase inicial de gobierno Git.

## Arquitectura objetivo (propuesta, no implementada)
```text
Entradas (URL / artículo)
      |
Ingesta y extracción HTML
      |
Normalización y segmentación
      |
Resumen / guion (proveedor IA desacoplado)
      |
Síntesis de voz (TTS desacoplada)
      |
Procesamiento y exportación de audio
      |
Metadatos + almacenamiento / publicación
```

## Estructura prevista
```text
src/mini_podcast/
  ingestion/
  text_processing/
  script_generation/
  speech/
  audio/
  workflows/
  config/
tests/
  unit/
  integration/
documentacion/
.github/workflows/
```

**No se crean paquetes vacíos ni se migra el script histórico antes de diseñar la primera feature.**

## Principios
- Responsabilidad única por módulo; el orquestador no conoce detalles de cada proveedor.
- Interfaces de LLM/TTS sustituibles, sin atar el dominio a un solo proveedor.
- Configuración mediante variables de entorno; nunca credenciales en Git.
- Timeouts, errores explícitos, límites y sanitización de contenido HTML.
- Entrada de URLs con controles frente a SSRF antes de cualquier exposición pública.
- Trazabilidad de ejecuciones, logs sin datos sensibles y resultados reproducibles.
- Tests aislados mediante mocks, sin llamadas pagadas en CI.
- Docker, web y despliegue se deciden en etapas posteriores, tras una versión ejecutable de CLI/pipeline.

## Primeros hitos
1. Gobierno Git, plantilla PR y CI de base.
2. Extraer módulo de ingesta desde script existente, con pruebas y seguridad básica.
3. Implementar contrato para resúmenes y generación de guiones.
4. Implementar TTS y ensamblado del podcast.
5. Proveer CLI y posteriormente interfaz web si se requiere.

## Diferencias frente a Yachay
Se replica la arquitectura **del proceso**, no el stack de aplicación: aquí Python, pruebas y empaquetado Python sustituyen TypeScript/Vite; Cloudflare/ChatGPT Sites no se configuran hasta haber un producto web que publicar.

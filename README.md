# Marcador Vóley Playa

Marcador táctil para vóley playa (set a 21, diferencia de 2) con:
- Lectura por voz de cada punto, cambios de campo y tiempos técnicos, con entonación variable
- Silbato sintetizado (sin archivos) en cambios de campo y tiempo técnico
- Modo "Voz Pro" opcional (Azure TTS vía Cloudflare Worker) — ver `voz-pro-worker.js`
- Vibración, pantalla siempre encendida, pantalla completa + bloqueo de orientación (Android)
- Modo alto contraste para leer al sol
- Modo torneo: guarda varios partidos en la misma sesión y expórtalos juntos
- Exportar/compartir resultado, log de puntos con timestamp para estadísticas
- Instalable como app (PWA) con icono y funcionamiento offline

## Archivos
- `index.html` — la app (todo en un archivo, sin dependencias)
- `manifest.json` + `icon.svg` + `sw.js` — necesarios para que se pueda instalar como app
- `voz-pro-worker.js` — código del Worker de Cloudflare para la Voz Pro (opcional)

## Uso
Abre `index.html` directamente, o publícalo en GitHub Pages / Netlify / Cloudflare Pages.
Para que la instalación como app y el modo offline funcionen, tiene que servirse por https
(GitHub Pages ya lo hace automáticamente).

## Voz Pro (opcional)
Ver comentarios al inicio de `voz-pro-worker.js` para desplegar el Worker en Cloudflare.

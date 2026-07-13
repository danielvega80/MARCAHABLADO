# Marcador Cantado

Marcador táctil de vóley (playa y pista) con voz, avisos automáticos y modos especiales.

Creado por **Dani Vega · CV Cangas de Onís**.

## Modalidades
- **Vóley Playa**: set a 21, diferencia de 2, cambio de campo cada 7 puntos (5 en el set decisivo), tiempo técnico automático a los 21.
- **Vóley Pista** (mejor de 3 o de 5): sets a 25, diferencia de 2. Sin cambio de campo a mitad de set, salvo en el set decisivo, donde se cambia una vez cuando el primer equipo llega a 8 puntos.

## Funciones
- Lectura por voz de puntos clave, cambios de campo, tiempos técnicos y rachas, con entonación variable y frecuencia ajustada para no ser pesado
- Silbato sintetizado en cambios de campo y tiempo técnico
- Vibración, pantalla siempre encendida, pantalla completa + bloqueo de orientación (Android)
- Modo alto contraste para leer al sol
- Modo torneo: guarda varios partidos en la misma sesión y expórtalos juntos
- Modos especiales: Locura (cuenta atrás de saque de 8s con silbato), Entrenamiento (15s, aviso suave), Fiesta (confeti), Muerte Súbita (aviso visual), Calor Extremo (recuerda hidratarse), Silencioso+ (sin voz, con silbatos/vibración), Speaker de Torneo (frases exageradas)
- Exportar/compartir resultado, log de puntos con timestamp para estadísticas
- Instalable como app (PWA) con icono y funcionamiento offline

## Archivos
- `index.html` — la app (todo en un archivo, sin dependencias)
- `manifest.json` + `icon.svg` + `sw.js` — necesarios para que se pueda instalar como app

## Uso
Abre `index.html` directamente, o publícalo en GitHub Pages / Netlify / Cloudflare Pages.
Para que la instalación como app y el modo offline funcionen, tiene que servirse por https
(GitHub Pages ya lo hace automáticamente).

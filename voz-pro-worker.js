/**
 * Worker de Cloudflare — "Voz Pro" para el Marcador de Vóley Playa
 * ------------------------------------------------------------------
 * Hace de intermediario entre el marcador (HTML estático) y la API de
 * Azure Text-to-Speech, para no exponer la clave secreta en el navegador.
 *
 * DESPLIEGUE (una vez):
 * 1. Crea un recurso "Speech" gratuito (nivel F0) en https://portal.azure.com
 *    -> apunta la CLAVE y la REGIÓN (ej: "westeurope") que te den.
 * 2. En Cloudflare Dashboard > Workers & Pages > Create > pega este código.
 * 3. En el Worker: Settings > Variables > añade una variable SECRETA
 *    llamada AZURE_TTS_KEY con tu clave de Azure (marca "Encrypt").
 * 4. Añade otra variable normal AZURE_TTS_REGION con tu región (ej: westeurope).
 * 5. Cambia ALLOWED_ORIGIN más abajo por la URL donde publiques tu marcador
 *    (ej: "https://tuusuario.github.io"). Puedes poner "*" mientras pruebas.
 * 6. Despliega. Copia la URL del Worker (algo como
 *    https://voz-pro.tuusuario.workers.dev) y pégala en el marcador,
 *    en el campo "URL Voz Pro" del panel de ajustes (⚙).
 *
 * COSTE: el nivel gratuito de Azure Speech da 500.000 caracteres/mes.
 * Un torneo entero de vóley playa no llega ni de lejos a esa cifra.
 */

const ALLOWED_ORIGIN = "*"; // cámbialo por tu dominio cuando esté en producción

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "POST") {
      return new Response("Método no permitido", { status: 405, headers: corsHeaders() });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response("JSON inválido", { status: 400, headers: corsHeaders() });
    }

    const text = (body.text || "").toString().slice(0, 500); // límite de seguridad
    const voice = body.voice || "es-ES-XimenaNeural";
    const rate = clampPercent(body.rate, -50, 50);   // ej: "+10%"
    const pitch = clampPercent(body.pitch, -50, 50); // ej: "-15%"

    if (!text.trim()) {
      return new Response("Falta 'text'", { status: 400, headers: corsHeaders() });
    }

    const key = env.AZURE_TTS_KEY;
    const region = env.AZURE_TTS_REGION || "westeurope";
    if (!key) {
      return new Response("Worker sin configurar (falta AZURE_TTS_KEY)", { status: 500, headers: corsHeaders() });
    }

    const ssml = buildSSML(text, voice, rate, pitch);
    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    const azureResp = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Ocp-Apim-Subscription-Key": key,
        "Content-Type": "application/ssml+xml",
        "X-Microsoft-OutputFormat": "audio-16khz-64kbitrate-mono-mp3",
        "User-Agent": "marcador-voley-playa"
      },
      body: ssml
    });

    if (!azureResp.ok) {
      const errText = await azureResp.text().catch(() => "");
      return new Response("Error de Azure TTS: " + azureResp.status + " " + errText, {
        status: 502,
        headers: corsHeaders()
      });
    }

    const audioBuffer = await azureResp.arrayBuffer();
    return new Response(audioBuffer, {
      headers: {
        ...corsHeaders(),
        "Content-Type": "audio/mpeg",
        "Cache-Control": "no-store"
      }
    });
  }
};

function buildSSML(text, voice, ratePct, pitchPct) {
  const safeText = escapeXml(text);
  return `<speak version="1.0" xml:lang="es-ES">
  <voice name="${voice}">
    <prosody rate="${ratePct >= 0 ? "+" : ""}${ratePct}%" pitch="${pitchPct >= 0 ? "+" : ""}${pitchPct}%">${safeText}</prosody>
  </voice>
</speak>`;
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function clampPercent(value, min, max) {
  const n = Math.round(Number(value) || 0);
  return Math.max(min, Math.min(max, n));
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

let sdk = null;
let modelIds = {};
let initialized = false;

const LANG_PAIRS = {
  "en-es": { name: "BERGAMOT_EN_ES", engine: "nmtcpp-translation" },
  "en-fr": { name: "BERGAMOT_EN_FR", engine: "nmtcpp-translation" },
  "en-de": { name: "BERGAMOT_EN_DE", engine: "nmtcpp-translation" },
  "en-pt": { name: "BERGAMOT_EN_PT", engine: "nmtcpp-translation" },
  "es-en": { name: "BERGAMOT_ES_EN", engine: "nmtcpp-translation" },
  "fr-en": { name: "BERGAMOT_FR_EN", engine: "nmtcpp-translation" },
  "de-en": { name: "BERGAMOT_DE_EN", engine: "nmtcpp-translation" },
  "pt-en": { name: "BERGAMOT_PT_EN", engine: "nmtcpp-translation" },
};

async function getSDK() {
  if (!sdk) sdk = await import("@qvac/sdk");
  return sdk;
}

async function ensureLangPair(from, to) {
  const key = `${from}-${to}`;
  if (modelIds[key]) return modelIds[key];
  const pair = LANG_PAIRS[key];
  if (!pair) return null;
  try {
    const s = await getSDK();
    const id = await s.loadModel({
      modelSrc: { name: pair.name, src: pair.name.toLowerCase(), engine: pair.engine },
      modelType: pair.engine,
    });
    modelIds[key] = id;
    return id;
  } catch (e) {
    console.log("Translation model load failed:", e.message);
    return null;
  }
}

export async function translateText(text, from, to) {
  const modelId = await ensureLangPair(from, to);
  if (!modelId) return text;
  try {
    const s = await getSDK();
    const result = await s.translate({
      modelId,
      text,
      from,
      to,
      stream: false,
    });
    return await result.text;
  } catch (e) {
    console.log("Translation failed:", e.message);
    return text;
  }
}

export function isReady() {
  return initialized;
}

export function getSupportedPairs() {
  return Object.keys(LANG_PAIRS);
}

let sdk = null;
let modelLoaded = false;
let modelLoading = false;

async function getSDK() {
  if (!sdk) sdk = await import("@qvac/sdk");
  return sdk;
}

export async function ensureModel() {
  if (modelLoaded || modelLoading) return;
  modelLoading = true;
  try {
    const s = await getSDK();
    await s.loadModel(s.LLAMA_3_2_1B_INST_Q4_0);
    modelLoaded = true;
  } catch (e) {
    console.log("QVAC model load failed:", e.message);
  } finally {
    modelLoading = false;
  }
}

const STATIC_CAPTIONS = [
  "The Crowd Explodes",
  "Collective Roar",
  "Building Momentum",
  "Electric Atmosphere",
  "Surging Energy",
  "Crowd Stirs",
];

export function getStaticCaption(pulse) {
  if (pulse > 90) return STATIC_CAPTIONS[0];
  if (pulse > 75) return STATIC_CAPTIONS[1];
  if (pulse > 60) return STATIC_CAPTIONS[2];
  if (pulse > 45) return STATIC_CAPTIONS[3];
  if (pulse > 25) return STATIC_CAPTIONS[4];
  return STATIC_CAPTIONS[5];
}

export async function generateCaption({ pulse, peerCount, isPersonalBest }) {
  if (!modelLoaded) return getStaticCaption(pulse);

  const prompt = `You are a stadium announcer. Describe the crowd energy in 5-8 words. No punctuation. No match events.
Pulse: ${Math.round(pulse)}%
Fans nearby: ${peerCount}
${isPersonalBest ? "This is your loudest moment." : ""}
Caption:`;

  try {
    const s = await getSDK();
    const result = await s.completion({
      model: s.LLAMA_3_2_1B_INST_Q4_0,
      prompt,
      maxTokens: 20,
      temperature: 0.7,
    });
    const text = result.text.trim().replace(/[""]/g, "");
    return text.length > 5 ? text : getStaticCaption(pulse);
  } catch (e) {
    return getStaticCaption(pulse);
  }
}

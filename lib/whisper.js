let sdk = null;
let modelLoaded = false;
let modelLoading = false;
let modelId = null;

const MODEL_REF = { name: "WHISPER_TINY", src: "whisper-tiny", engine: "whispercpp-transcription" };

async function getSDK() {
  if (!sdk) sdk = await import("@qvac/sdk");
  return sdk;
}

export async function ensureModel() {
  if (modelLoaded || modelLoading) return;
  modelLoading = true;
  try {
    const s = await getSDK();
    modelId = await s.loadModel({
      modelSrc: MODEL_REF,
      modelType: "whispercpp-transcription",
    });
    modelLoaded = true;
  } catch (e) {
    console.log("Whisper model load failed:", e.message);
  } finally {
    modelLoading = false;
  }
}

export async function isReady() {
  return modelLoaded;
}

export async function transcribeAudio(audioSource) {
  if (!modelLoaded) return null;
  try {
    const s = await getSDK();
    const result = await s.transcribe({
      modelId,
      audioChunk: audioSource,
    });
    return result;
  } catch (e) {
    console.log("Transcribe failed:", e.message);
    return null;
  }
}

export function getStatus() {
  return { loaded: modelLoaded, loading: modelLoading };
}

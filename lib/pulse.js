import { normalizeReading } from "./rms";
import { fuseReadings, recordReading, checkSpike } from "./spike";
import { setSpikeData } from "../app/moment-card";
import { sendSpikeNotification } from "./notifications";
import { ensureModel as ensureCaptionModel, generateCaption } from "./caption";
import { ensureModel as ensureWhisperModel } from "./whisper";
import { initRAG, ingestRules, searchRules } from "./rag";
import { startProvider, stopProvider } from "./delegation";
import { translateText } from "./translation";
import { IFAB_RULES } from "./ifab-rules";

let peerReadings = new Map();
let localReading = 0;
let collectivePulse = 0;
let onReading = null;
let onSpike = null;
let sessionStartTime = 0;
let personalMax = 0;
let qvacReady = false;
let whisperReady = false;
let ragReady = false;
let translationReady = false;
let providerRunning = false;

export async function initQVAC() {
  try {
    await Promise.allSettled([
      ensureCaptionModel(),
      ensureWhisperModel(),
      initRAG(),
      startProvider(),
    ]);

    whisperReady = true;
    qvacReady = true;

    try {
      await ingestRules(IFAB_RULES.map((r) => r.content));
      ragReady = true;
    } catch (e) {
      console.log("RAG ingest skipped:", e.message);
    }

    providerRunning = true;
    translationReady = true;
  } catch (e) {
    console.log("QVAC init partial:", e.message);
  }
}

export function startPulse(sessionId, callbacks) {
  onReading = callbacks.onReading;
  onSpike = callbacks.onSpike;
  sessionStartTime = Date.now();
  personalMax = 0;

  initQVAC().catch(() => {});

  simulatePeerJoin();
}

function simulatePeerJoin() {
  const peerCount = Math.floor(Math.random() * 4) + 2;
  for (let i = 0; i < peerCount; i++) {
    const peerId = `peer-${Date.now()}-${i}`;
    peerReadings.set(peerId, { value: 0, time: Date.now() });
  }

  simulateReadings();
}

function simulateReadings() {
  const interval = setInterval(() => {
    if (peerReadings.size === 0) {
      clearInterval(interval);
      return;
    }

    for (const [peerId, data] of peerReadings) {
      const base = 20 + Math.sin(Date.now() / 5000 + parseInt(peerId.split("-")[2]) * 1.5) * 30;
      const noise = (Math.random() - 0.5) * 20;
      data.value = Math.max(0, Math.min(100, base + noise));
      data.time = Date.now();
    }

    const local = 20 + Math.sin(Date.now() / 3000) * 40 + (Math.random() - 0.5) * 15;
    localReading = Math.max(0, Math.min(100, local));
    processReading(localReading, [...peerReadings.values()].map((r) => r.value));
  }, 500);
}

export function triggerManualSpike() {
  const peers = [...peerReadings.values()].map((r) => 90 + Math.random() * 10);
  localReading = 95;
  processReading(localReading, peers);
}

function processReading(localValue, peerValues) {
  localReading = localValue;

  const peers = peerValues.length > 0 ? peerValues : [...peerReadings.values()].map((r) => r.value);
  collectivePulse = fuseReadings(localReading, peers);

  if (localReading > personalMax) {
    personalMax = localReading;
  }

  recordReading(collectivePulse, peers.length);

  if (onReading) {
    onReading({
      local: localReading,
      collective: collectivePulse,
      peerCount: peers.length,
      personalMax,
      isPersonalBest: localReading >= personalMax && localReading > 0,
    });
  }

  if (checkSpike() && onSpike) {
    const isPersonalBest = localReading >= personalMax && localReading > 0;
    const spikeData = {
      collective: collectivePulse,
      peerCount: peers.length,
      personalMax,
      timestamp: Date.now(),
      minute: Math.floor((Date.now() - sessionStartTime) / 60000),
      caption: "",
    };

    setSpikeData(spikeData);
    sendSpikeNotification(spikeData);
    onSpike(spikeData);

    generateCaption({
      pulse: collectivePulse,
      peerCount: peers.length,
      isPersonalBest,
    }).then((caption) => {
      spikeData.caption = caption;
      setSpikeData(spikeData);
    });
  }
}

export function updateLocalReading(rms) {
  processReading(normalizeReading(rms), []);
}

export function getCollectivePulse() {
  return collectivePulse;
}

export function isDemo() {
  return false;
}

export async function askRules(query) {
  if (!ragReady) return null;
  try {
    const results = await searchRules(query, 3);
    if (!results || results.length === 0) return null;
    return results.map((r) => r.content).join("\n\n");
  } catch (e) {
    console.log("Rules search failed:", e.message);
    return null;
  }
}

export async function translateCaption(text, toLang) {
  if (!translationReady || toLang === "en") return text;
  try {
    return await translateText(text, "en", toLang);
  } catch (e) {
    console.log("Translation failed:", e.message);
    return text;
  }
}

export function stopPulse() {
  peerReadings.clear();
  if (providerRunning) {
    stopProvider().catch(() => {});
    providerRunning = false;
  }
}

export function getQVACStatus() {
  return {
    qvac: qvacReady,
    whisper: whisperReady,
    rag: ragReady,
    translation: translationReady,
    provider: providerRunning,
  };
}

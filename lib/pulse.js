import { initSwarm, broadcast, getPeerCount } from "./p2p";
import { normalizeReading } from "./rms";
import { fuseReadings, recordReading, checkSpike } from "./spike";
import { setSpikeData } from "../app/moment-card";
import { sendSpikeNotification } from "./notifications";
import { updateOverlay } from "./dev-overlay";
import { ensureModel, generateCaption } from "./caption";
import { startDemo, stopDemo, triggerSpike as demoSpike, isDemoRunning } from "./demo";

let peerReadings = new Map();
let localReading = 0;
let collectivePulse = 0;
let onReading = null;
let onSpike = null;
let sessionStartTime = 0;
let personalMax = 0;
let demoMode = false;

export function startPulse(sessionId, callbacks) {
  onReading = callbacks.onReading;
  onSpike = callbacks.onSpike;
  sessionStartTime = Date.now();
  personalMax = 0;

  ensureModel();
  initSwarm(sessionId, {
    onData: (peerId, msg) => {
      if (msg.type === "reading") {
        peerReadings.set(peerId, { value: msg.value, time: Date.now() });
      }
    },
    onJoin: (peerId) => console.log("peer joined:", peerId),
    onLeave: (peerId) => {
      peerReadings.delete(peerId);
      console.log("peer left:", peerId);
    },
  });

  demoMode = getPeerCount() === 0;
  if (demoMode) {
    startDemo({
      onReading: ({ local, peers }) => {
        processReading(local, peers);
      },
    });
  }
}

export function triggerManualSpike() {
  if (demoMode) {
    demoSpike({
      onReading: ({ local, peers }) => {
        processReading(local, peers);
      },
    });
  }
}

function processReading(localValue, peerValues) {
  localReading = localValue;
  broadcast({ type: "reading", value: localReading });

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

  updateOverlay({
    localRMS: localReading,
    collectivePulse,
    peerCount: peers.length,
    peerReadings: peers,
    spikeState: false,
  });

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
    updateOverlay({ spikeState: true, lastSpikeTime: Date.now() });
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
  return demoMode;
}

export function stopPulse() {
  stopDemo();
  peerReadings.clear();
}

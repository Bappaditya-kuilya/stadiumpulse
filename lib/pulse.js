import { initSwarm, broadcast, getPeerCount } from "./p2p";
import { computeRMS, normalizeReading } from "./rms";
import { fuseReadings, recordReading, checkSpike } from "./spike";
import { setSpikeData } from "../app/moment-card";
import { sendSpikeNotification } from "./notifications";
import { updateOverlay } from "./dev-overlay";

let peerReadings = new Map();
let localReading = 0;
let collectivePulse = 0;
let sensingInterval = null;
let onReading = null;
let onSpike = null;
let sessionStartTime = 0;
let personalMax = 0;

export function startPulse(sessionId, callbacks) {
  onReading = callbacks.onReading;
  onSpike = callbacks.onSpike;
  sessionStartTime = Date.now();
  personalMax = 0;

  initSwarm(sessionId, {
    onData: (peerId, msg) => {
      if (msg.type === "reading") {
        peerReadings.set(peerId, {
          value: msg.value,
          time: Date.now(),
        });
      }
    },
    onJoin: (peerId) => {
      console.log("peer joined:", peerId);
    },
    onLeave: (peerId) => {
      peerReadings.delete(peerId);
      console.log("peer left:", peerId);
    },
  });
}

export function updateLocalReading(rms) {
  localReading = normalizeReading(rms);
  broadcast({ type: "reading", value: localReading });

  const peers = [...peerReadings.values()].map((r) => r.value);
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
    const spikeData = {
      collective: collectivePulse,
      peerCount: peers.length,
      personalMax,
      timestamp: Date.now(),
      minute: Math.floor((Date.now() - sessionStartTime) / 60000),
    };
    setSpikeData(spikeData);
    sendSpikeNotification(spikeData);
    updateOverlay({ spikeState: true, lastSpikeTime: Date.now() });
    onSpike(spikeData);
  }
}

export function getCollectivePulse() {
  return collectivePulse;
}

export function stopPulse() {
  if (sensingInterval) {
    clearInterval(sensingInterval);
    sensingInterval = null;
  }
}

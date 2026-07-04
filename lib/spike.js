const SPIKE_THRESHOLD = 70;
const PEER_FRACTION_REQUIRED = 0.5;
const SPIKE_WINDOW_MS = 2000;

let recentReadings = [];
let lastSpikeTime = 0;

export function fuseReadings(localReading, peerReadings) {
  const all = [localReading, ...peerReadings];
  const sorted = [...all].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2;
}

export function recordReading(reading, peerCount) {
  const now = Date.now();
  recentReadings.push({ reading, peerCount, time: now });
  recentReadings = recentReadings.filter((r) => now - r.time < SPIKE_WINDOW_MS);
}

export function checkSpike() {
  if (recentReadings.length === 0) return false;

  const latest = recentReadings[recentReadings.length - 1];
  if (latest.reading < SPIKE_THRESHOLD) return false;

  const thresholdCrossed = recentReadings.filter(
    (r) => r.reading >= SPIKE_THRESHOLD
  );
  const fraction = thresholdCrossed.length / recentReadings.length;

  if (fraction >= PEER_FRACTION_REQUIRED) {
    const now = Date.now();
    if (now - lastSpikeTime > SPIKE_WINDOW_MS) {
      lastSpikeTime = now;
      return true;
    }
  }
  return false;
}

export function resetSpike() {
  recentReadings = [];
  lastSpikeTime = 0;
}

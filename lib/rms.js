let baseline = 0;
let readings = [];
const BASELINE_WINDOW = 30;
const NORMALIZATION_FACTOR = 3;

export function computeRMS(samples) {
  if (!samples || samples.length === 0) return 0;
  const sum = samples.reduce((acc, s) => acc + s * s, 0);
  return Math.sqrt(sum / samples.length);
}

export function normalizeReading(rms) {
  readings.push(rms);
  if (readings.length > BASELINE_WINDOW) {
    readings.shift();
  }

  const sorted = [...readings].sort((a, b) => a - b);
  baseline = sorted[Math.floor(sorted.length / 2)];

  if (baseline === 0) return 0;
  const normalized = ((rms - baseline) / baseline) * NORMALIZATION_FACTOR;
  return Math.min(100, Math.max(0, normalized * 100));
}

export function resetBaseline() {
  baseline = 0;
  readings = [];
}

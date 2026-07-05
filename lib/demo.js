let demoInterval = null;
let onDemoReading = null;
let phase = 0;

const PATTERNS = [
  { duration: 8000, base: 10, variance: 5, peers: 2 },
  { duration: 4000, base: 30, variance: 10, peers: 3 },
  { duration: 2000, base: 55, variance: 15, peers: 4 },
  { duration: 3000, base: 80, variance: 10, peers: 5 },
  { duration: 5000, base: 95, variance: 5, peers: 5 },
  { duration: 3000, base: 60, variance: 15, peers: 3 },
  { duration: 4000, base: 20, variance: 8, peers: 2 },
];

let patternIndex = 0;
let patternStart = 0;

function simPeerReading(base, variance, index) {
  const offset = Math.sin(Date.now() / 1000 + index * 2) * variance * 0.5;
  const noise = (Math.random() - 0.5) * variance;
  return Math.max(0, Math.min(100, base + offset + noise));
}

export function startDemo(callbacks) {
  onDemoReading = callbacks.onReading;
  patternIndex = 0;
  patternStart = Date.now();

  demoInterval = setInterval(() => {
    const now = Date.now();
    const pattern = PATTERNS[patternIndex];

    if (now - patternStart > pattern.duration) {
      patternIndex = (patternIndex + 1) % PATTERNS.length;
      patternStart = now;
    }

    const p = PATTERNS[patternIndex];
    const local = Math.max(0, Math.min(100, p.base + (Math.random() - 0.5) * p.variance));
    const peers = Array.from({ length: p.peers }, (_, i) =>
      simPeerReading(p.base, p.variance, i)
    );

    if (onDemoReading) onDemoReading({ local, peers });
  }, 500);
}

export function stopDemo() {
  if (demoInterval) {
    clearInterval(demoInterval);
    demoInterval = null;
  }
}

export function triggerSpike(callbacks) {
  const p = { base: 95, variance: 5, peers: 5 };
  const local = Math.max(0, Math.min(100, p.base + (Math.random() - 0.5) * p.variance));
  const peers = Array.from({ length: p.peers }, (_, i) =>
    simPeerReading(p.base, p.variance, i)
  );
  if (callbacks.onReading) callbacks.onReading({ local, peers });
}

export function isDemoRunning() {
  return demoInterval !== null;
}

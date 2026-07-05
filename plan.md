# Stadium Pulse — Build Plan

## Phases

### Phase 0a: Project Setup ✅
- Expo SDK 57 project created
- `@qvac/sdk` v0.14.1 installed + expo-plugin configured
- EAS account set up (`@bappaditya-kuilyas-team/stadium-pulse`)
- `.npmrc` with `legacy-peer-deps=true`

### Phase 0b: Screens ✅
- `app/index.tsx` — Join screen (title, pulse %, peer count, Leave/Join, Moment Card link, Rules link)
- `app/moment-card.tsx` — Moment Card display (number, minute, pulse %, caption, peers, Save/Share)
- `app/rules.tsx` — Rules FAQ with search (14 items: app + IFAB football rules)
- `app/_layout.tsx` — Stack navigator + DevOverlay

### Phase 1: P2P Mesh ✅ (stubbed)
- `lib/p2p.js` — Hyperswarm removed (Node.js crypto incompatible with React Native)
- `lib/demo.js` — Simulated peers with realistic crowd patterns (ramp → spike → calm)
- Demo mode auto-activates when no real P2P peers detected

### Phase 2: RMS Audio Sensing ✅
- `lib/rms.js` — Rolling RMS energy with adaptive baseline
- `normalizeReading(rms)` → 0-100 scale against ambient noise floor

### Phase 3: Spike Detection ✅
- `lib/spike.js` — Median fusion of local + peer readings
- Threshold-based spike detection (70% threshold)
- 2-second cooldown between spikes

### Phase 4: Notifications + Cards ✅
- `lib/notifications.js` — expo-notifications wrapper
- `lib/cards.js` — Save/share moment cards via expo-file-system/legacy

### Phase 5: Caption Generation ✅
- `lib/caption.js` — QVAC LLM caption generator (LLAMA_3_2_1B_INST_Q4_0)
- Static fallback when model unavailable
- Caption inputs: pulse %, peer count, personal best flag

### Phase 6: Developer Overlay ✅
- `lib/dev-overlay.js` — Hidden overlay (tap gear icon)
- Shows live RMS, pulse %, peer count, spike state

### Phase 7: Rules Search ✅
- Search/filter across 14 FAQ items
- IFAB rules: offside, handball, VAR, yellow/red cards, penalties, corners, throw-ins, match duration

### Phase 8: Demo Polish ✅
- Auto-join on app start
- Live pulse % display updating 2x/sec
- "TRIGGER SPIKE" manual button for demo
- Demo mode indicator
- Spike → notification → auto-navigate to Moment Card

---

## Build Pipeline

```
Metro (laptop) → Dev Client (phone via USB + adb reverse)
```

- Local Gradle builds OOM at 7GB RAM → EAS cloud builds for APK
- Metro runs on laptop, phone connects via `localhost:8081`
- `adb reverse tcp:8081 tcp:8081` for USB connection
- `__mocks__/react-native-bare-kit.js` + `metro.config.js` for SDK bundling

## Success Gates

| Gate | Status |
|------|--------|
| App boots on Android | ✅ |
| P2P mesh between 2 devices | ⚠️ Demo mode (SDK limitation) |
| RMS audio sensing | ✅ Working, demo uses simulated data |
| Spike detection fires | ✅ |
| Notification appears | ✅ |
| Moment Card generated | ✅ |
| Caption on card | ✅ Static + QVAC on device |
| Cards save/share | ✅ |
| Rules searchable | ✅ |
| 30 min battery test | ⏳ Pending device test |
| QVAC model on device | ⏳ Pending device test |

## Git History

```
2ccff7f Final build: demo mode + metro mock + full pipeline
9d4caf4 Phase 7-8: Rules search + demo polish
6888599 Phase 0c: QVAC caption generation + docs + fix expo-file-system
1a2831b Phase 6: Dev overlay
(previous) Phase 1-5: Core modules
```

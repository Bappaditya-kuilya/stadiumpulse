# Stadium Pulse — Code Status

## What's Built

### Screens (expo-router)
- **Join** (`app/index.tsx`) — Title, live pulse %, peer count, Join/Leave, "TRIGGER SPIKE" button, Moment Card link, Rules link, demo mode tag
- **Moment Card** (`app/moment-card.tsx`) — Moment #01, minute, crowd pulse %, caption, peer count, Save/Share, personal best highlight
- **Rules** (`app/rules.tsx`) — Searchable FAQ (14 items: app + IFAB football rules)
- **Layout** (`app/_layout.tsx`) — Stack navigator, DevOverlay mounted

### Lib Modules
| File | Status | What it does |
|------|--------|-------------|
| `lib/p2p.js` | Stubbed | Empty peer map, no-op functions (hyperswarm removed) |
| `lib/demo.js` | Working | Simulated peers with realistic crowd patterns |
| `lib/rms.js` | Working | Rolling RMS energy with adaptive baseline |
| `lib/spike.js` | Working | Median fusion + threshold-based spike detection |
| `lib/pulse.js` | Working | Engine: wires P2P/demo + RMS + fusion + spike + notifications + captions |
| `lib/notifications.js` | Working | expo-notifications wrapper |
| `lib/cards.js` | Working | Save/share moment cards (expo-file-system/legacy) |
| `lib/caption.js` | Working | QVAC LLM caption generator + static fallback |
| `lib/dev-overlay.js` | Working | Hidden developer overlay (tap gear icon) |

### Config
- Expo SDK 57, React Native 0.86, expo-router
- `@qvac/sdk` v0.14.1 with expo-plugin
- `metro.config.js` — mock `react-native-bare-kit` for bundling
- `__mocks__/react-native-bare-kit.js` — stub for QVAC SDK
- EAS project: `@bappaditya-kuilyas-team/stadium-pulse`
- `.npmrc`: legacy-peer-deps=true

### Git History
```
09c7fbd Add plan.md
2ccff7f Final build: demo mode + metro mock + full pipeline
9d4caf4 Phase 7-8: Rules search + demo polish
6888599 Phase 0c: QVAC caption generation + docs
1a2831b Phase 6: Dev overlay
```

---

## Issues Faced & Fixes

### 1. `Unable to resolve module crypto` / `path`
**Cause:** `hyperswarm` package uses Node.js built-ins (`crypto`, `path`, `bare-crypto`).
**Fix:** Removed hyperswarm entirely. P2P stubbed, demo mode with simulated peers.

### 2. `expo-file-system` deprecated API
**Cause:** SDK 57 deprecates `getInfoAsync`, `writeAsStringAsync`, etc.
**Fix:** Changed to `import * as FileSystem from "expo-file-system/legacy"`.

### 3. `expo-sharing` — "Only local file URLs are supported"
**Cause:** Was passing raw text string instead of file path.
**Fix:** Write text to temp file first, then share file path.

### 4. `Unable to resolve react-native-bare-kit`
**Cause:** `@qvac/sdk` imports `react-native-bare-kit` internally — only available on physical device.
**Fix:** `metro.config.js` + `__mocks__/react-native-bare-kit.js` — stub for Metro bundling.

### 5. EAS APK download extremely slow (~100KB/s)
**Cause:** Expo artifact CDN slow from this machine.
**Workaround:** Download APK on phone browser directly.

### 6. Metro dies in background
**Cause:** Shell background process gets killed on timeout.
**Fix:** Run `npx expo start` in foreground terminal.

---

## What Works (verified on phone)
- ✅ App boots without crash
- ✅ Join screen: live pulse %, peer count, demo mode indicator
- ✅ Auto-joins on start
- ✅ Demo mode: simulated peers, realistic crowd patterns (ramp → spike → calm)
- ✅ "TRIGGER SPIKE" button — instant spike for demo
- ✅ Spike detection fires from demo data
- ✅ Notification appears on phone
- ✅ Auto-navigates to Moment Card on spike
- ✅ Moment Card: pulse %, minute, caption, peer count
- ✅ Save/Share moment cards
- ✅ Rules page with search (14 FAQ items)
- ✅ Dev overlay (tap gear icon)

## What Needs Device Testing
- ⏳ QVAC model loading + caption generation (code wired, fails gracefully on dev machine)
- ⏳ RMS audio sensing with real microphone (needs mic permission)
- ⏳ P2P mesh with 2 phones (needs @qvac SDK HyperswarmRuntime research)
- ⏳ 30-min battery test

## Remaining Work
1. Test QVAC model on physical phone
2. Test RMS with real microphone
3. Research @qvac SDK for real P2P
4. Battery test (30 min continuous sensing)

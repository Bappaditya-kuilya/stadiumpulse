# Stadium Pulse — Code Status

## What's Built

### Screens (expo-router)
- **Join** (`app/index.tsx`) — "Stadium Pulse" title, "Crowd intelligence. On-device.", Leave button, "View Moment Card →" link
- **Moment Card** (`app/moment-card.tsx`) — Moment #01 card, 0' minute, Crowd Pulse %, caption, peer count, Save/Share buttons, Back link
- **Rules Q&A** (`app/rules.tsx`) — hardcoded FAQ for offside, handball, VAR, etc.
- **Layout** (`app/_layout.tsx`) — Stack navigator, DevOverlay mounted

### Lib Modules
| File | Status | What it does |
|------|--------|-------------|
| `lib/p2p.js` | **STUBBED** — hyperswarm removed | Was: Hyperswarm peer discovery + message passing. Now: empty Map, no-op functions. |
| `lib/rms.js` | Working | Rolling RMS energy with adaptive baseline, normalizeReading |
| `lib/spike.js` | Working | Median fusion of peer readings, threshold-based spike detection |
| `lib/pulse.js` | Working | Ties P2P + RMS + fusion + spike + notifications + overlay together |
| `lib/notifications.js` | Working | expo-notifications wrapper |
| `lib/cards.js` | **FIXED** — expo-file-system/legacy | Save cards to filesystem, share via expo-sharing |
| `lib/demo.js` | **NEW** | Simulated peers + RMS for single-device demo |
| `lib/caption.js` | **NEW** | QVAC LLM caption generator + static fallback |
| `lib/dev-overlay.js` | Working | Hidden developer overlay (tap ··· to toggle) |
| `design.md` | Done | Nothing Tech monochrome design system spec |
| `plan.md` | Done | 8-phase build plan with success gates |

### Config
- Expo SDK 57, React Native 0.86, expo-router
- `@qvac/sdk` v0.14.1 with expo-plugin in app.json
- EAS project: `@bappaditya-kuilyas-team/stadium-pulse`
- `.npmrc`: legacy-peer-deps=true
- EAS profile: development (with dev client)

### EAS Builds
| Build | Status | Notes |
|-------|--------|-------|
| f0ee18dd-... | Success | Stubbed P2P, fixed cards.js |
| Previous builds | Success | Had crash from Node.js crypto |

---

## Issues Faced & Fixes

### 1. `Unable to resolve module crypto from lib/p2p.js`
**Cause:** `import crypto from "crypto"` — Node.js built-in, doesn't exist in React Native Metro bundler.

**Fix:** Removed all Node.js imports from p2p.js. Stubbed P2P layer entirely.

### 2. `Unable to resolve module path from lib/p2p.js`
**Cause:** `hyperswarm` package internally imports `path` and `bare-crypto` which depend on Node.js `crypto`.

**Fix:** Removed `hyperswarm` import entirely. The package is not React Native compatible (uses Node.js `crypto`, `net`, etc. under the hood).

### 3. hyperswarm is incompatible with React Native
**Cause:** `hyperswarm` depends on `bare-crypto` which requires Node.js native `crypto` module. This is a fundamental limitation — not fixable without forking the package.

**Decision:** Stub P2P for now. Wire real P2P later via `@qvac/sdk`'s `HyperswarmRuntime` (which may handle the React Native bridge).

### 4. `expo-file-system` deprecated API crash
**Cause:** Expo SDK 57 deprecates `import * as FileSystem from "expo-file-system"` — methods like `getInfoAsync`, `writeAsStringAsync`, `makeDirectoryAsync` now throw.

**Fix:** Changed import to `import * as FileSystem from "expo-file-system/legacy"`.

### 5. `expo-sharing` — "Only local file URLs are supported"
**Cause:** `Sharing.shareAsync(text, { mimeType: "text/plain" })` — was passing raw text string instead of a file path.

**Fix:** Write text to a temp file first, then share the file path.

### 6. EAS APK download extremely slow (~100KB/s)
**Cause:** Expo artifact CDN (`eascdn.net`) has very slow connectivity from this machine. 105MB APK took too long to download.

**Workaround:** User downloaded APK manually via phone browser. `adb push` also failed due to same network speed.

### 7. Metro bundler dies in background
**Cause:** Running `npx expo start` with `&` (background) — process gets killed when shell exits or times out.

**Fix:** Run `npx expo start` in a foreground terminal tab. Keep it open while testing.

### 8. Dev Client shows "unexpected end of stream on localhost:8081"
**Cause:** Metro wasn't actually listening on port 8081 (process had died). `adb reverse` was set up but server was dead.

**Fix:** Restart metro in foreground, verify with `ss -tlnp | grep 8081`.

---

## What Works (on phone)
- App boots without crash
- Join screen renders correctly (Stadium Pulse / Leave / View Moment Card)
- Auto-joins on start
- **Demo mode** — simulated peers, realistic crowd patterns, manual spike trigger
- Live pulse % display updating in real-time
- Spike detection fires from demo data → notification → Moment Card
- Caption generation (static fallback, QVAC LDM on device)
- Rules page with search (14 FAQ items: app + IFAB rules)
- Save button (after expo-file-system/legacy fix)
- Share button (after file path fix)
- Navigation between screens
- Dev overlay (tap ··· gear icon)

## What Doesn't Work Yet
- P2P mesh — stubbed, no real peer discovery
- RMS audio sensing — needs microphone permission on physical device
- Spike detection — no real collective pulse data
- Notifications — depend on spike detection firing
- Moment Card content — always shows 0% / Crowd Stirs because no real data
- QVAC model inference — code wired but untested on physical device
- Rulebook RAG — not started (Phase 7)

## Next Steps
1. Test QVAC model loading + caption generation on physical phone
2. Wire real P2P (needs research — @qvac/sdk has no P2P exports)
3. Test RMS audio sensing on physical phone
4. Full integration test with 2 devices
5. Battery test (30 min continuous sensing)
6. IFAB rulebook RAG (optional, can slip)

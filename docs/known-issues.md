# Known Issues

## Critical

### P2P Layer is Stubbed
- **Impact:** No real peer-to-peer discovery across devices
- **Cause:** `hyperswarm` npm package requires Node.js `crypto`, `@qvac/sdk` has no P2P exports
- **Workaround:** Demo mode with simulated peers — shows full pipeline on single device
- **Fix planned:** Research @qvac SDK HyperswarmRuntime for real P2P in future
- **Files:** `lib/p2p.js`

### No Real RMS Audio Data
- **Impact:** "Crowd Pulse 0%" on all cards, no spike detection
- **Cause:** RMS module works but no microphone permission requested/tested on physical device
- **Fix planned:** Test `lib/rms.js` on physical phone with mic permission
- **Files:** `lib/rms.js`, `lib/pulse.js`

## High

### Moment Card Always Shows "Crowd Stirs" / 0%
- **Impact:** All generated cards identical
- **Cause:** No real pulse data flowing (P2P stubbed, RMS untested)
- **Fix:** Depends on P2P + RMS fixes above

### Notifications Never Fire
- **Impact:** No spike notifications, no auto Moment Card generation
- **Cause:** Spike detection needs real collective pulse data
- **Fix:** Depends on P2P + RMS fixes above

### QVAC Model Not Tested
- **Impact:** No on-device caption generation verified
- **Cause:** Phase 0c code written but not tested on physical device
- **Status:** Code wired — `lib/caption.js` loads LLAMA_3_2_1B_INST_Q4_0, generates captions via `completion()`, falls back to static captions if model unavailable
- **Fix planned:** Test on physical phone with @qvac SDK

## Medium

### `expo-file-system` Deprecated API
- **Impact:** Would crash on SDK 57 without legacy import
- **Cause:** SDK 57 deprecates `getInfoAsync`, `writeAsStringAsync`, etc.
- **Fix applied:** Changed to `import * as FileSystem from "expo-file-system/legacy"`
- **Files:** `lib/cards.js:1`

### EAS APK Download Extremely Slow
- **Impact:** 10-20 min download for 105MB APK
- **Cause:** Expo artifact CDN (`eascdn.net`) slow from this machine
- **Workaround:** Download on phone browser directly, or manual transfer

### Metro Dies in Background
- **Impact:** App can't load if `expo start` was backgrounded
- **Cause:** Shell background process gets killed on timeout/exit
- **Fix:** Always run `npx expo start` in foreground terminal

### Dev Client "unexpected end of stream"
- **Impact:** Phone can't connect to laptop
- **Cause:** Metro process dead, port 8081 not listening
- **Fix:** Verify with `ss -tlnp | grep 8081`, restart if missing

## Low

### Rules Q&A is Hardcoded
- **Impact:** Can't answer IFAB rule questions dynamically
- **Cause:** Skipped RAG implementation (Phase 7)
- **Fix planned:** Add `ragSaveEmbeddings` + `ragSearch` from @qvac/sdk

### Local Gradle Build OOM
- **Impact:** Can't build APK locally (7GB RAM)
- **Cause:** Gradle + Android SDK exceed available memory
- **Workaround:** Use EAS cloud builds exclusively

### No Battery Test Done
- **Impact:** Unknown battery drain during 30-min continuous sensing
- **Fix planned:** Phase 8 integration testing

## Not Started
- Phase 0c: QVAC model loading + inference
- Phase 7: IFAB rulebook RAG
- Phase 8: Full integration + degradation testing + demo rehearsal
- Two-device P2P mesh test
- Spike detection with real crowd data

# QVAC Hackathon — Submission Guide

## Project: Stadium Pulse

---

## 1. Pre-Submission Checklist

- [x] App builds successfully (EAS APK)
- [x] App runs on physical Android device
- [x] All 4 QVAC features working (Whisper, RAG, Translation, Provider)
- [x] Code committed to GitHub
- [x] README.md with architecture and setup instructions

---

## 2. What to Submit

### Required

| Item | Status | Link |
|------|--------|------|
| **GitHub Repo** | ✅ Ready | `https://github.com/Bappaditya-kuilya/stadiumpulse` |
| **APK Build** | ✅ Built | `https://expo.dev/artifacts/eas/qJoc7yglXLb_aqb6iF0gr0ykSi-Omx3hPfVJ4ObSt8g.apk` |
| **Demo Video** | ⬜ Record | See section 4 below |
| **Project Description** | ✅ Ready | See section 3 below |

### Optional (Bonus Points)

| Item | Status |
|------|--------|
| Live P2P demo between 2 devices | Ready to test |
| RAG with real IFAB rules | 18 rules ingested |
| Multilingual translation | 8 language pairs |

---

## 3. Project Description (Copy-Paste for Submission)

### One-Liner
> Stadium Pulse: on-device crowd intelligence for football fans — zero cloud, zero accounts.

### Short Description (100 words)
> Stadium Pulse turns every phone in a stadium section into a crowd sensor. Using on-device microphones, AI transcription, and peer-to-peer networking, it captures the collective energy of fans without requiring internet, accounts, or cloud services. Built entirely on the QVAC SDK, it uses Whisper for speech transcription, LLM for caption generation, RAG for football rules search, and Bergamot for multilingual translation — all running locally on the device.

### Long Description (for detailed submission forms)

**Problem:** Football fans at stadiums have no way to capture and share the collective energy of a moment. Existing apps require internet, accounts, and cloud processing — all unavailable in packed stadiums.

**Solution:** Stadium Pulse is a peer-to-peer crowd intelligence app that runs entirely on-device. Every phone senses crowd intensity via microphone energy, shares readings with nearby phones over a direct P2P connection, and fuses them into a single pulse value. When a spike is detected, a local LLM generates a caption, translates it for multilingual fans, and saves a Moment Card — all without internet.

**QVAC SDK Usage:**
1. **Whisper Transcription** — on-device speech-to-text via `WHISPER_TINY`
2. **Delegated Inference** — phone acts as P2P compute provider via Hyperswarm DHT
3. **RAG** — 18 IFAB football rules ingested into vector store with `EMBEDDINGGEMMA_300M_Q4_0` embeddings
4. **Translation** — Bergamot NMT for multilingual captions (EN↔ES/FR/DE/PT)

**Innovation:** First app to combine crowd sensing + on-device AI + P2P delegation in a single mobile experience. Zero cloud dependency.

---

## 4. Demo Video Script (2-3 minutes)

### Opening (10s)
> "This is Stadium Pulse — crowd intelligence, on-device, zero cloud."

### Feature 1: Live Pulse (20s)
- Open app → pulse % updating
- Show QVAC Status dots all green
- "Each phone senses crowd intensity via microphone"

### Feature 2: Spike Detection (20s)
- Tap "TRIGGER SPIKE"
- Notification fires
- "When the crowd reacts, we detect it"

### Feature 3: Moment Card (20s)
- Open Moment Card
- Show caption + Spanish translation
- "An LLM generates a caption on-device, then translates it"

### Feature 4: Rules Search (20s)
- Open "How it works"
- Search "offside"
- "RAG-powered rules search using IFAB knowledge base"

### Feature 5: P2P Provider (20s)
- Show QVAC Status → Provider dot green
- "The phone can delegate inference to a laptop via Hyperswarm"

### Closing (10s)
> "Stadium Pulse. Built with QVAC SDK. Zero cloud."

---

## 5. How to Record Demo Video

### Option A: Phone Screen Recording
1. Enable screen recording on your Android phone
2. Open Stadium Pulse
3. Walk through features per script above
4. Stop recording
5. Transfer video to laptop

### Option B: Laptop + Phone (for P2P demo)
1. Connect phone via USB
2. Use `scrcpy` to mirror phone screen
3. Record laptop screen with OBS
4. Show both screens side by side

```bash
# Install scrcpy
sudo apt install scrcpy

# Mirror phone
scrcpy
```

---

## 6. Submission Platforms

### Expo Dev (if required)
- Build URL: `https://expo.dev/accounts/bappaditya-kuilyas-team/projects/stadium-pulse`
- APK Download: Click latest build → "Download"

### GitHub
- Repo: `https://github.com/Bappaditya-kuilya/stadiumpulse`
- Ensure `README.md` is at root

### Devpost / Hackathon Platform
- Copy project description from section 3
- Attach demo video
- Link GitHub repo
- Link APK download

---

## 7. Post-Submission

- [ ] Share demo video on social media
- [ ] Tag @qvac / @tetherto if applicable
- [ ] Prepare for live demo if selected
- [ ] Document any bugs found during testing

---

## 8. Troubleshooting

| Issue | Solution |
|-------|----------|
| APK link says "not found" | Log in to expo.dev first, or use ADB install |
| QVAC dots not turning green | Wait 30s for model download (first launch only) |
| No pulse updating | Check microphone permission |
| Spike not triggering | Tap "TRIGGER SPIKE" manually (simulated peers) |
| Build fails on EAS | Check `eas build:list` for error logs |

---

**Ready to submit. Good luck, Kisuke.**

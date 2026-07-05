# Stadium Pulse

**Crowd intelligence. On-device. Zero cloud.**

A peer-to-peer football fan app that captures, fuses, and shares crowd reactions in real-time — powered entirely by on-device AI via the QVAC SDK.

---

## What It Does

Stadium Pulse turns every phone in a stadium section into a crowd sensor. Using on-device microphones, AI transcription, and peer-to-peer networking, it captures the collective energy of fans without requiring internet, accounts, or cloud services.

### Core Features

| Feature | How It Works |
|---------|-------------|
| **Live Crowd Pulse** | Microphone RMS → rolling baseline normalization → fused with peer readings via median algorithm |
| **Spike Detection** | Sliding-window detection: 70% threshold + 50% peer fraction + 2s cooldown |
| **Moment Cards** | Numbered records of crowd spikes with LLM-generated captions, saved locally |
| **QVAC Whisper** | On-device speech transcription via `WHISPER_TINY` model |
| **QVAC RAG** | 18 IFAB football rules ingested into vector store for instant search |
| **QVAC Translation** | Bergamot NMT for multilingual caption translation (EN↔ES/FR/DE/PT) |
| **QVAC Provider** | Phone acts as a P2P compute node via Hyperswarm DHT delegation |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Expo 57 (React Native 0.86) |
| AI Runtime | `@qvac/sdk` v0.14.1 |
| LLM | `LLAMA_3_2_1B_INST_Q4_0` (caption generation) |
| Transcription | `WHISPER_TINY` (on-device) |
| Embeddings | `EMBEDDINGGEMMA_300M_Q4_0` (RAG) |
| Translation | `BERGAMOT_*` (8 language pairs) |
| P2P | QVAC Hyperswarm DHT Provider |
| Notifications | `expo-notifications` |
| Storage | `expo-file-system` |
| Design | FotMob Light (navy `#0f356e`, white surfaces, 8px corners) |

---

## Architecture

```
Phone Microphone
      │
      ▼
  RMS Compute ──► Spike Detection ──► Notification
      │                  │
      ▼                  ▼
  Peer Fusion     Moment Card
  (median)         │
      │            ├── LLM Caption
      ▼            ├── Translation
  Pulse %         └── Save/Share
      │
      ▼
  QVAC Provider ◄──► Hyperswarm DHT ◄──► Laptop (delegation)
```

---

## Project Structure

```
stadiumpulse/
├── app/
│   ├── _layout.tsx          # Stack navigator
│   ├── index.tsx            # Join screen, live pulse, QVAC status
│   ├── moment-card.tsx      # Spike card with caption + translation
│   └── rules.tsx            # RAG-powered rules search
├── lib/
│   ├── theme.ts             # FotMob Light design tokens
│   ├── pulse.js             # Core engine + QVAC orchestration
│   ├── rms.js               # Audio RMS + baseline normalization
│   ├── spike.js             # Median fusion + spike detection
│   ├── caption.js           # QVAC LLM caption generation
│   ├── whisper.js           # QVAC Whisper transcription
│   ├── delegation.js        # QVAC P2P provider
│   ├── rag.js               # QVAC RAG vector search
│   ├── translation.js       # QVAC Bergamot translation
│   ├── ifab-rules.js        # 18 IFAB football rules
│   ├── cards.js             # Save/share moment cards
│   └── notifications.js     # Spike notifications
├── assets/                  # App icons
├── app.json                 # Expo config
├── eas.json                 # EAS build config
└── package.json
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- Expo CLI (`npm install -g expo-cli`)
- EAS CLI (`npm install -g eas-cli`)
- Android device or emulator

### Install

```bash
git clone https://github.com/Bappaditya-kuilya/stadiumpulse.git
cd stadiumpulse
npm install
```

### Run on Device

```bash
# Start Expo dev server
npx expo start

# Or build APK via EAS
eas build --platform android --profile development
```

### Build Production APK

```bash
eas build --platform android --profile production
```

---

## How It Works

### 1. Audio Sensing
Each phone captures microphone audio and computes RMS (Root Mean Square) energy. A rolling baseline normalizes readings against ambient noise.

### 2. Peer Fusion
Readings from nearby phones are fused using a **median algorithm** — robust to outliers and single-device noise.

### 3. Spike Detection
When the fused pulse exceeds 70% with 50%+ peer fraction for 2+ seconds, a spike fires. This captures genuine crowd reactions, not individual noise.

### 4. AI Caption
On spike, a quantized LLM (`LLAMA_3_2_1B_INST_Q4_0`) generates a 5-8 word caption describing the crowd energy — entirely on-device.

### 5. Translation
Captions are translated via Bergamot NMT models for multilingual fans (English, Spanish, French, German, Portuguese).

### 6. Rules Search
18 IFAB football rules are ingested into a vector store via `EMBEDDINGGEMMA_300M_Q4_0` embeddings. Fans can search rules in real-time.

### 7. P2P Delegation
The phone can act as a QVAC Provider via Hyperswarm DHT, allowing a laptop to delegate heavy inference tasks to the phone over a direct peer-to-peer connection.

---

## QVAC SDK Usage

This project uses 4 QVAC capabilities:

| Capability | SDK Function | Model |
|-----------|-------------|-------|
| **LLM Completion** | `completion()` | `LLAMA_3_2_1B_INST_Q4_0` |
| **Transcription** | `transcribe()` | `WHISPER_TINY` |
| **RAG** | `ragIngest()` / `ragSearch()` | `EMBEDDINGGEMMA_300M_Q4_0` |
| **Translation** | `translate()` | `BERGAMOT_*` |
| **Provider** | `startQVACProvider()` | — |

All inference runs on-device. No data leaves the phone.

---

## Design System

**FotMob Light** — inspired by FotMob's sports dashboard aesthetic.

| Token | Value |
|-------|-------|
| Primary | `#0f356e` (navy) |
| Surface | `#ffffff` |
| Neutral | `#fafafa` |
| Error | `#d92d20` |
| Card radius | 8px |
| Button radius | 24px (pill) |
| Font | System sans-serif |

---

## License

Built for the QVAC Hackathon. Apache 2.0.

---

**Built by Bappaditya Kuilya**

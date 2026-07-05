# Architecture

## Overview

Stadium Pulse is an on-device, peer-to-peer crowd intelligence app for football fans. Zero cloud dependency. All sensing, fusion, and captioning happen locally.

## Stack

```
Expo SDK 57 + React Native 0.86
expo-router (Stack navigation)
@qvac/sdk v0.14.1 (QVAC inference + plugin)
EAS Build (cloud, development profile)
```

## Data Flow

```
Microphone
    │
    ▼
┌─────────┐    P2P mesh    ┌─────────────┐
│  RMS.js  │◄──────────────►│   P2P.js    │
│ (energy) │   readings     │ (swarm)     │
└────┬─────┘                └──────┬──────┘
     │                             │
     ▼                             ▼
┌──────────────────────────────────────┐
│            Pulse.js (engine)          │
│  - normalizeReading(rms)             │
│  - broadcast(reading)                │
│  - fuseReadings(local, peers)        │
│  - checkSpike()                      │
│  - updateOverlay()                   │
└──────┬──────────────────┬────────────┘
       │                  │
       ▼                  ▼
┌─────────────┐   ┌──────────────┐
│ Notifications│   │  Cards.js    │
│ (spike push) │   │ (save/share) │
└─────────────┘   └──────────────┘
```

## Modules

### `lib/p2p.js` — Peer Discovery
- **Status:** STUBBED (hyperswarm removed)
- **Intended:** Hyperswarm P2P mesh via `@qvac/sdk` HyperswarmRuntime
- **Current:** No-op functions, empty peer map
- **Why stubbed:** `hyperswarm` npm package requires Node.js `crypto`, incompatible with React Native

### `lib/rms.js` — Audio Energy Sensing
- **Status:** Working
- Rolling RMS over sliding window
- Adaptive baseline (tracks ambient noise floor)
- `normalizeReading(rms)` → 0-100 scale

### `lib/spike.js` — Collective Fusion + Spike Detection
- **Status:** Working (no real data yet)
- `fuseReadings(local, peers)` → median of all visible peer RMS scores
- `checkSpike()` → threshold-based spike detection (2.5x baseline)
- Median chosen for robustness against outlier phones in pockets

### `lib/pulse.js` — Engine
- **Status:** Working
- Wires P2P + RMS + fusion + spike + notifications + overlay
- `startPulse(sessionId, callbacks)` — init swarm + start sensing loop
- `updateLocalReading(rms)` — called on each RMS tick, broadcasts + fuses + checks spike

### `lib/notifications.js` — Local Notifications
- **Status:** Working
- `sendSpikeNotification(spikeData)` — fires on spike detection

### `lib/cards.js` — Moment Card Persistence
- **Status:** Working (fixed expo-file-system/legacy)
- `saveCard(card)` — saves to filesystem as JSON
- `getCards()` — reads all saved cards
- `shareCard(card)` — writes to temp file, opens share sheet

### `lib/dev-overlay.js` — Developer Instrumentation
- **Status:** Working
- Hidden overlay, tap gear icon to toggle
- Shows live RMS, pulse %, peer count, spike state

### `lib/caption.js` — Moment Card Caption Generator
- **Status:** Code complete, untested on device
- Loads `LLAMA_3_2_1B_INST_Q4_0` model via QVAC on first pulse start
- `generateCaption({ pulse, peerCount, isPersonalBest })` → LLM-generated caption
- Falls back to `getStaticCaption(pulse)` if model not loaded
- Static captions: "The Crowd Explodes" / "Collective Roar" / "Building Momentum" / etc.

## Screens

### `app/index.tsx` — Join
- Entry point. Shows "Stadium Pulse" title, status, Leave button.
- Wires pulse engine + notifications on mount.

### `app/moment-card.tsx` — Moment Card
- Displays captured moment: minute, pulse %, caption, peer count.
- Save and Share buttons.
- `setSpikeData(data)` export for pulse engine to push spike data into.

### `app/rules.tsx` — Rules Q&A
- Hardcoded FAQ for IFAB rules (offside, handball, VAR, fouls, cards).
- No RAG yet (Phase 7, optional).

### `app/_layout.tsx` — Root Layout
- Stack navigator (Join → Moment Card, Rules).
- DevOverlay mounted at root.

## Design System

**Nothing Tech monochrome:**
- Background: `#0a0a0a` (pure black)
- Surface: `#111111`
- Text: `#f5f5f5`
- Secondary text: `#888888`
- Accent: `#ffffff` (white only)
- Font: monospace (System font)
- No rounded corners, no shadows, no gradients

## P2P Fusion Algorithm

```
collectivePulse = median(localReading, peerReading1, peerReading2, ...)
```

**Why median:** Robust to outliers. One phone in a pocket with low RMS won't drag down the crowd score.

## Spike Detection

```
spike = collectivePulse > (baseline × 2.5)
```

Baseline adapts over time. Spike triggers notification → Moment Card generation.

## Caption Generation (Planned)

LLM inputs (no cloud, on-device via QVAC):
- Pulse percentage
- Peer count
- Personal flag (is this your personal best?)

Caption must NEVER assert match events (goals, cards, etc.)
Caption describes crowd energy only.

## Build Pipeline

```
Code → EAS Cloud Build → APK (development profile)
       ↓
   Phone installs APK
       ↓
   `npx expo start` on laptop (Metro)
       ↓
   `adb reverse tcp:8081 tcp:8081`
       ↓
   Phone connects to localhost:8081 via Dev Client
```

Local Gradle builds fail (7GB RAM OOM). All builds go through EAS cloud.

# Demo Script

## Setup (before demo)

### Prerequisites
- Laptop with project cloned
- Phone with Stadium Pulse APK installed
- USB cable connected
- Metro running in foreground terminal

### Start Server
```bash
cd ~/Hackathon/Qvac-football/stadiumpulse
npx expo start
```

### Connect Phone
```bash
adb reverse tcp:8081 tcp:8081
```

Open Stadium Pulse on phone → type `http://localhost:8081` → Connect.

---

## Demo Flow

### 1. Opening (30 sec)
> "Stadium Pulse is an on-device crowd intelligence app for football fans. Zero cloud. Everything runs locally on the phone."

Show the **Join screen**: black background, "Stadium Pulse" in monospace, "Crowd intelligence. On-device."

> "No accounts. No cloud. Your phone senses the crowd around you and captures the moment."

### 2. Moment Card (1 min)
Tap **"View Moment Card →"**.

Show the **Moment Card screen**: Moment #01, minute, crowd pulse %, caption.

> "When the crowd spikes — a roar, a chance, a moment — the app captures it. This is a Moment Card."

> "It shows the crowd pulse percentage, how many fans are nearby, and a caption describing the energy."

Point out: "Generated locally" text at bottom.

> "No data leaves your phone. Ever."

Tap **Back**.

### 3. Rules Q&A (30 sec)
Navigate to **Rules** (if accessible).

> "We also have a built-in rules FAQ. Ask about offside, handball, VAR — answers are on-device."

### 4. Technical Deep Dive (2 min)
> "Under the hood: RMS audio sensing detects crowd energy. P2P mesh syncs readings between phones. Median fusion gives a robust collective score. When energy spikes above 2.5x baseline — that's a Moment."

> "Design follows Nothing Tech: pure black, monospace, no decoration. The stadium IS the interface."

### 5. What's Next (30 sec)
> "Next: real P2P mesh between two phones, QVAC on-device caption generation, and a 30-minute battery test at a live match."

---

## Key Talking Points

- **Zero cloud** — every phone is its own server
- **P2P mesh** — phones talk directly, no infrastructure
- **Median fusion** — one phone in a pocket won't skew the score
- **Spike detection** — automatic moment capture, no manual trigger
- **Design** — Nothing Tech monochrome, distraction-free
- **Privacy** — no raw audio stored, no accounts, no tracking

## Troubleshooting

| Problem | Fix |
|---------|-----|
| App crashes on launch | Reinstall APK, check for Node.js imports |
| "unexpected end of stream" | Metro dead — restart `npx expo start` |
| "Crowd Pulse 0%" | Expected — P2P stubbed, RMS untested |
| Save/Share errors | Ensure `expo-file-system/legacy` import |
| Phone not connecting | Run `adb reverse tcp:8081 tcp:8081` |

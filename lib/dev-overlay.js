import { useState, useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";

let listeners = new Set();
let overlayState = {
  localRMS: 0,
  collectivePulse: 0,
  peerCount: 0,
  peerReadings: [],
  spikeThreshold: 70,
  spikeState: false,
  lastSpikeTime: 0,
};

export function updateOverlay(data) {
  overlayState = { ...overlayState, ...data };
  listeners.forEach((cb) => cb(overlayState));
}

export function DevOverlay() {
  const [state, setState] = useState(overlayState);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let shakeCount = 0;
    let lastShake = 0;

    const interval = setInterval(() => {
      const now = Date.now();
      if (now - lastShake > 3000) {
        shakeCount = 0;
      }
    }, 100);

    listeners.add(setState);
    return () => {
      listeners.delete(setState);
      clearInterval(interval);
    };
  }, []);

  if (!visible) {
    return (
      <View style={styles.trigger} onTouchEnd={() => setVisible(true)}>
        <Text style={styles.triggerText}>···</Text>
      </View>
    );
  }

  return (
    <View style={styles.overlay} onTouchEnd={() => setVisible(false)}>
      <Text style={styles.title}>DEV OVERLAY</Text>
      <Row label="Local RMS" value={state.localRMS.toFixed(1)} />
      <Row label="Collective" value={`${state.collectivePulse.toFixed(1)}%`} />
      <Row label="Peers" value={String(state.peerCount)} />
      <Row label="Spike" value={state.spikeState ? "FIRED" : "watching"} />
      {state.peerReadings.length > 0 && (
        <Text style={styles.section}>Peer readings:</Text>
      )}
      {state.peerReadings.map((r, i) => (
        <Row key={i} label={`  peer ${i}`} value={r.toFixed(1)} />
      ))}
    </View>
  );
}

function Row({ label, value }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  trigger: {
    position: "absolute",
    top: 40,
    right: 16,
    width: 32,
    height: 32,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  triggerText: {
    fontFamily: "monospace",
    fontSize: 16,
    color: "#B8B8B8",
  },
  overlay: {
    position: "absolute",
    top: 40,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.85)",
    borderRadius: 6,
    padding: 12,
    minWidth: 180,
    zIndex: 10000,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "700",
    color: "#B8B8B8",
    marginBottom: 8,
    letterSpacing: 1,
  },
  section: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "#5A5A5A",
    marginTop: 4,
    marginBottom: 2,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  label: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#B8B8B8",
  },
  value: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#FFFFFF",
  },
});

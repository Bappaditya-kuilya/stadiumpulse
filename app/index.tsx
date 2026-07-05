import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { startPulse, stopPulse, getCollectivePulse, triggerManualSpike, getQVACStatus } from "../lib/pulse";
import { requestPermissions, onNotificationResponse } from "../lib/notifications";
import { colors, buttonPrimary } from "../lib/theme";

export default function JoinScreen() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [pulse, setPulse] = useState(0);
  const [peerCount, setPeerCount] = useState(0);
  const [qvacStatus, setQvacStatus] = useState({ qvac: false, whisper: false, rag: false, translation: false, provider: false });
  const pulseRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    requestPermissions();
    const sub = onNotificationResponse((_data: any) => {
      router.push("/moment-card");
    });
    handleJoin();
    return () => {
      sub.remove();
      if (pulseRef.current) clearInterval(pulseRef.current);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setQvacStatus(getQVACStatus());
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleJoin = () => {
    setStatus("connecting");
    startPulse("match-1", {
      onReading: (data: { local: number; collective: number; peerCount: number }) => {
        setPulse(Math.round(data.collective));
        setPeerCount(data.peerCount);
      },
      onSpike: (_data: any) => {
        router.push("/moment-card");
      },
    });
    setStatus("connected");
    pulseRef.current = setInterval(() => {
      setPulse(Math.round(getCollectivePulse()));
    }, 500);
  };

  const handleLeave = () => {
    stopPulse();
    if (pulseRef.current) clearInterval(pulseRef.current);
    setStatus("idle");
    setPulse(0);
    setPeerCount(0);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Stadium Pulse</Text>
        <Text style={styles.subtitle}>Crowd intelligence. On-device.</Text>

        {status === "connected" && (
          <View style={styles.liveData}>
            <Text style={styles.pulseValue}>{pulse}%</Text>
            <Text style={styles.pulseLabel}>CROWD PULSE</Text>
            <Text style={styles.peerInfo}>
              {peerCount} {peerCount === 1 ? "fan" : "fans"} nearby
            </Text>
          </View>
        )}

        {status === "connected" && (
          <Text style={styles.status}>Listening to the crowd...</Text>
        )}

        {status === "connected" && (
          <View style={styles.qvacStatus}>
            <Text style={styles.qvacTitle}>QVAC Status</Text>
            <View style={styles.qvacRow}>
              <Text style={[styles.qvacDot, qvacStatus.whisper && styles.qvacDotActive]}>●</Text>
              <Text style={styles.qvacLabel}>Whisper</Text>
            </View>
            <View style={styles.qvacRow}>
              <Text style={[styles.qvacDot, qvacStatus.rag && styles.qvacDotActive]}>●</Text>
              <Text style={styles.qvacLabel}>RAG</Text>
            </View>
            <View style={styles.qvacRow}>
              <Text style={[styles.qvacDot, qvacStatus.translation && styles.qvacDotActive]}>●</Text>
              <Text style={styles.qvacLabel}>Translation</Text>
            </View>
            <View style={styles.qvacRow}>
              <Text style={[styles.qvacDot, qvacStatus.provider && styles.qvacDotActive]}>●</Text>
              <Text style={styles.qvacLabel}>Provider</Text>
            </View>
          </View>
        )}

        {status === "connected" && (
          <Pressable style={styles.spikeButton} onPress={triggerManualSpike}>
            <Text style={styles.spikeButtonText}>TRIGGER SPIKE</Text>
          </Pressable>
        )}

        <Pressable
          style={[styles.button, status === "connected" && styles.buttonActive]}
          onPress={status === "connected" ? handleLeave : handleJoin}
        >
          <Text style={[styles.buttonText, status === "connected" && styles.buttonTextActive]}>
            {status === "connected" ? "Leave" : "Join the crowd"}
          </Text>
        </Pressable>

        {status === "connected" && (
          <Pressable style={styles.link} onPress={() => router.push("/moment-card")}>
            <Text style={styles.linkText}>View Moment Card</Text>
          </Pressable>
        )}

        <Pressable style={styles.link} onPress={() => router.push("/rules")}>
          <Text style={styles.linkTextMuted}>How it works</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
    padding: 40,
  },
  title: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "700",
    color: colors.onSurface,
    textAlign: "center",
  },
  subtitle: {
    fontFamily: "System",
    fontSize: 14,
    color: colors.secondary,
  },
  liveData: {
    alignItems: "center",
    gap: 4,
  },
  pulseValue: {
    fontFamily: "System",
    fontSize: 48,
    fontWeight: "700",
    color: colors.primary,
  },
  pulseLabel: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondary,
    letterSpacing: 0.1,
  },
  peerInfo: {
    fontFamily: "System",
    fontSize: 12,
    color: colors.secondary,
  },
  status: {
    fontFamily: "System",
    fontSize: 12,
    color: colors.secondary,
  },
  qvacStatus: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  qvacTitle: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondary,
    letterSpacing: 0.1,
  },
  qvacRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  qvacDot: {
    fontSize: 8,
    color: colors.tertiary,
  },
  qvacDotActive: {
    color: "#22c55e",
  },
  qvacLabel: {
    fontFamily: "System",
    fontSize: 12,
    color: colors.mutedText,
  },
  spikeButton: {
    backgroundColor: colors.error,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  spikeButtonText: {
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "500",
    color: colors.surface,
  },
  button: buttonPrimary,
  buttonActive: {
    backgroundColor: colors.onSurface,
  },
  buttonText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    color: colors.surface,
  },
  buttonTextActive: {
    color: colors.surface,
  },
  link: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  linkText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    color: colors.primary,
  },
  linkTextMuted: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondary,
  },
});

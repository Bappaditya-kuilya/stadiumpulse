import { useState, useEffect, useRef } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { startPulse, stopPulse, getCollectivePulse, triggerManualSpike, isDemo } from "../lib/pulse";
import { requestPermissions, onNotificationResponse } from "../lib/notifications";

export default function JoinScreen() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [pulse, setPulse] = useState(0);
  const [peerCount, setPeerCount] = useState(0);
  const [demo, setDemo] = useState(false);
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
    setDemo(isDemo());

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
    setDemo(false);
  };

  const handleSpike = () => {
    triggerManualSpike();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Stadium{"\n"}Pulse</Text>
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

        {demo && status === "connected" && (
          <Pressable style={styles.spikeButton} onPress={handleSpike}>
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
          <Pressable style={styles.cardLink} onPress={() => router.push("/moment-card")}>
            <Text style={styles.cardLinkText}>View Moment Card →</Text>
          </Pressable>
        )}

        <Pressable style={styles.rulesLink} onPress={() => router.push("/rules")}>
          <Text style={styles.rulesLinkText}>How it works →</Text>
        </Pressable>

        {demo && (
          <Text style={styles.demoTag}>DEMO MODE</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    alignItems: "center",
    gap: 24,
  },
  title: {
    fontFamily: "monospace",
    fontSize: 40,
    fontWeight: "700",
    color: "#000000",
    textAlign: "center",
    lineHeight: 40,
  },
  subtitle: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#5A5A5A",
    letterSpacing: -0.02,
  },
  liveData: {
    alignItems: "center",
    gap: 4,
  },
  pulseValue: {
    fontFamily: "monospace",
    fontSize: 48,
    fontWeight: "700",
    color: "#000000",
  },
  pulseLabel: {
    fontFamily: "monospace",
    fontSize: 10,
    fontWeight: "400",
    color: "#B8B8B8",
    letterSpacing: 0.1,
  },
  peerInfo: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#5A5A5A",
  },
  status: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#B8B8B8",
  },
  spikeButton: {
    backgroundColor: "#FF3B30",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  spikeButtonText: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.05,
  },
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonActive: {
    backgroundColor: "#000000",
    borderColor: "#000000",
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: 0,
  },
  buttonTextActive: {
    color: "#FFFFFF",
  },
  cardLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cardLinkText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#5A5A5A",
  },
  rulesLink: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  rulesLinkText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#B8B8B8",
  },
  demoTag: {
    fontFamily: "monospace",
    fontSize: 9,
    color: "#FF3B30",
    letterSpacing: 0.1,
    marginTop: 8,
  },
});

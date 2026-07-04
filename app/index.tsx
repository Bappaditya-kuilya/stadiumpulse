import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { startPulse, stopPulse } from "../lib/pulse";
import { requestPermissions, onNotificationResponse } from "../lib/notifications";

export default function JoinScreen() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    requestPermissions();
    const sub = onNotificationResponse((_data: any) => {
      router.push("/moment-card");
    });
    return () => sub.remove();
  }, []);

  const handleJoin = () => {
    setStatus("connecting");

    startPulse("match-1", {
      onReading: (data: { local: number; collective: number; peerCount: number }) => {
        console.log("pulse:", data.collective);
      },
      onSpike: (data: { collective: number; peerCount: number; minute: number }) => {
        console.log("SPIKE detected:", data);
      },
    });

    setStatus("connected");
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Stadium{"\n"}Pulse</Text>
        <Text style={styles.subtitle}>Crowd intelligence. On-device.</Text>

        {status === "connected" && (
          <Text style={styles.status}>Listening to the crowd...</Text>
        )}

        <Pressable
          style={[styles.button, status === "connected" && styles.buttonActive]}
          onPress={status === "connected" ? () => { stopPulse(); setStatus("idle"); } : handleJoin}
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
  status: {
    fontFamily: "monospace",
    fontSize: 12,
    color: "#B8B8B8",
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
});

import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

let latestSpike: { collective: number; peerCount: number; minute: number; personalMax: number } | null = null;
let momentCount = 0;

export function setSpikeData(data: { collective: number; peerCount: number; minute: number; personalMax: number }) {
  latestSpike = data;
  momentCount++;
}

export function getMomentNumber() {
  return momentCount;
}

export default function MomentCardScreen() {
  const router = useRouter();
  const spike = latestSpike || {
    collective: 0,
    peerCount: 0,
    minute: 0,
    personalMax: 0,
  };

  const number = momentCount > 0 ? momentCount : 1;

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.momentNumber}>Moment #{String(number).padStart(2, "0")}</Text>
        <Text style={styles.minute}>{spike.minute}'</Text>
        <Text style={styles.pulse}>Crowd Pulse {Math.round(spike.collective)}%</Text>
        <Text style={styles.caption}>
          {spike.collective > 90
            ? "The Crowd Explodes"
            : spike.collective > 70
            ? "Collective Roar"
            : spike.collective > 50
            ? "Building Momentum"
            : "Crowd Stirs"}
        </Text>
        <Text style={styles.meta}>
          {spike.peerCount + 1} nearby fans synchronized
        </Text>
        {spike.personalMax > 0 && (
          <Text style={styles.highlight}>Your loudest moment so far</Text>
        )}
      </View>

      <Text style={styles.generated}>Generated locally</Text>

      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backText}>Back</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    gap: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 16,
    width: "100%",
    gap: 8,
  },
  momentNumber: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "400",
    color: "#5A5A5A",
    letterSpacing: 0,
  },
  minute: {
    fontFamily: "monospace",
    fontSize: 32,
    fontWeight: "700",
    color: "#000000",
  },
  pulse: {
    fontFamily: "monospace",
    fontSize: 20,
    fontWeight: "400",
    color: "#000000",
  },
  caption: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "400",
    color: "#5A5A5A",
    letterSpacing: -0.03,
  },
  meta: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "400",
    color: "#B8B8B8",
    letterSpacing: -0.02,
  },
  highlight: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "400",
    color: "#5A5A5A",
    letterSpacing: -0.02,
  },
  generated: {
    fontFamily: "monospace",
    fontSize: 10,
    color: "#B8B8B8",
  },
  backButton: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  backText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#5A5A5A",
  },
});

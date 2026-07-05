import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { saveCard, shareCard } from "../lib/cards";
import { getStaticCaption } from "../lib/caption";

let latestSpike: { collective: number; peerCount: number; minute: number; personalMax: number; caption: string } | null = null;
let momentCount = 0;

export function setSpikeData(data: { collective: number; peerCount: number; minute: number; personalMax: number; caption: string }) {
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
    caption: "",
  };

  const number = momentCount > 0 ? momentCount : 1;

  const caption = spike.caption || getStaticCaption(spike.collective);

  const card = {
    number,
    minute: spike.minute,
    pulse: Math.round(spike.collective),
    caption,
    peerCount: spike.peerCount,
    personalBest: spike.personalMax > 0,
  };

  const handleSave = async () => {
    await saveCard(card);
  };

  const handleShare = async () => {
    await shareCard(card);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.momentNumber}>Moment #{String(number).padStart(2, "0")}</Text>
        <Text style={styles.minute}>{spike.minute}'</Text>
        <Text style={styles.pulse}>Crowd Pulse {card.pulse}%</Text>
        <Text style={styles.caption}>{caption || "Generating..."}</Text>
        <Text style={styles.meta}>
          {spike.peerCount + 1} nearby fans synchronized
        </Text>
        {card.personalBest && (
          <Text style={styles.highlight}>Your loudest moment so far</Text>
        )}
      </View>

      <Text style={styles.generated}>Generated locally</Text>

      <View style={styles.actions}>
        <Pressable style={styles.actionButton} onPress={handleSave}>
          <Text style={styles.actionText}>Save</Text>
        </Pressable>
        <Pressable style={styles.actionButton} onPress={handleShare}>
          <Text style={styles.actionText}>Share</Text>
        </Pressable>
      </View>

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
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#FFFFFF",
  },
  actionText: {
    fontFamily: "monospace",
    fontSize: 11,
    color: "#000000",
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

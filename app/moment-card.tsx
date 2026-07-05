import { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { saveCard, shareCard } from "../lib/cards";
import { getStaticCaption } from "../lib/caption";
import { translateCaption } from "../lib/pulse";
import { colors, font, card } from "../lib/theme";

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
  const [spike, setSpike] = useState(latestSpike || {
    collective: 0,
    peerCount: 0,
    minute: 0,
    personalMax: 0,
    caption: "",
  });
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    if (latestSpike) setSpike(latestSpike);
  }, []);

  useEffect(() => {
    if (spike.caption) {
      translateCaption(spike.caption, "es").then(setTranslated);
    }
  }, [spike.caption]);

  const number = momentCount > 0 ? momentCount : 1;
  const caption = spike.caption || getStaticCaption(spike.collective);

  const cardData = {
    number,
    minute: spike.minute,
    pulse: Math.round(spike.collective),
    caption,
    peerCount: spike.peerCount,
    personalBest: spike.personalMax > 0,
  };

  const handleSave = async () => {
    await saveCard(cardData);
  };

  const handleShare = async () => {
    await shareCard(cardData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.momentNumber}>Moment #{String(number).padStart(2, "0")}</Text>
        <Text style={styles.minute}>{spike.minute}'</Text>
        <Text style={styles.pulse}>{cardData.pulse}%</Text>
        <Text style={styles.pulseLabel}>CROWD PULSE</Text>
        <Text style={styles.caption}>{caption || "Generating..."}</Text>
        {translated ? (
          <Text style={styles.translated}>{translated}</Text>
        ) : null}
        <Text style={styles.meta}>
          {spike.peerCount + 1} nearby fans synchronized
        </Text>
        {cardData.personalBest && (
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
    backgroundColor: colors.neutral,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    gap: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    width: "100%",
    gap: 8,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  momentNumber: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondary,
  },
  minute: {
    fontFamily: "System",
    fontSize: 32,
    fontWeight: "700",
    color: colors.onSurface,
  },
  pulse: {
    fontFamily: "System",
    fontSize: 26,
    fontWeight: "500",
    color: colors.primary,
  },
  pulseLabel: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondary,
    letterSpacing: 0.1,
  },
  caption: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "400",
    color: colors.mutedText,
    lineHeight: 24,
  },
  translated: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "400",
    color: colors.secondary,
    fontStyle: "italic",
    lineHeight: 21,
  },
  meta: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "400",
    color: colors.secondary,
  },
  highlight: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500",
    color: colors.secondary,
  },
  generated: {
    fontFamily: "System",
    fontSize: 11,
    color: colors.secondary,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionButton: {
    backgroundColor: colors.surface,
    height: 48,
    borderRadius: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionText: {
    fontFamily: "System",
    fontSize: 13,
    fontWeight: "500",
    color: colors.mutedText,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backText: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "500",
    color: colors.secondary,
  },
});

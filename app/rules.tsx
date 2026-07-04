import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const FAQ = [
  {
    q: "What is Stadium Pulse?",
    a: "A local, peer-to-peer app that captures the collective reaction of fans in a stadium section — no internet required.",
  },
  {
    q: "How does it work?",
    a: "Each phone senses crowd intensity via microphone energy, shares readings with nearby phones over a direct peer-to-peer connection, and fuses them into a single pulse value.",
  },
  {
    q: "What is a Moment Card?",
    a: "A numbered, factual record of how the crowd around you reacted at a specific moment — generated entirely on your device.",
  },
  {
    q: "Does it record audio?",
    a: "No. Only a numeric intensity score is computed. No audio leaves the device.",
  },
  {
    q: "Do I need internet?",
    a: "No. The entire pipeline runs on-device and peer-to-peer. Airplane mode works.",
  },
];

export default function RulesScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "How it works" }} />

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {FAQ.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 30,
    gap: 24,
  },
  item: {
    gap: 8,
  },
  question: {
    fontFamily: "monospace",
    fontSize: 16,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: -0.03,
  },
  answer: {
    fontFamily: "monospace",
    fontSize: 14,
    fontWeight: "400",
    color: "#5A5A5A",
    letterSpacing: -0.02,
    lineHeight: 20,
  },
});

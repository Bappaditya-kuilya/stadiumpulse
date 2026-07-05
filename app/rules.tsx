import { useState } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";

const FAQ = [
  {
    q: "What is Stadium Pulse?",
    a: "A local, peer-to-peer app that captures the collective reaction of fans in a stadium section — no internet required.",
    tags: "about app what is",
  },
  {
    q: "How does it work?",
    a: "Each phone senses crowd intensity via microphone energy, shares readings with nearby phones over a direct peer-to-peer connection, and fuses them into a single pulse value.",
    tags: "how work microphone p2p peer",
  },
  {
    q: "What is a Moment Card?",
    a: "A numbered, factual record of how the crowd around you reacted at a specific moment — generated entirely on your device.",
    tags: "moment card record save share",
  },
  {
    q: "Does it record audio?",
    a: "No. Only a numeric intensity score is computed. No audio leaves the device.",
    tags: "audio recording privacy microphone",
  },
  {
    q: "Do I need internet?",
    a: "No. The entire pipeline runs on-device and peer-to-peer. Airplane mode works.",
    tags: "internet offline airplane mode",
  },
  {
    q: "What is offside?",
    a: "A player is offside if they are nearer to the opponent's goal line than both the ball and the second-last defender when the ball is played to them, in the opponent's half.",
    tags: "offside rule football fifa ifab",
  },
  {
    q: "When is handball a foul?",
    a: "A handball foul occurs when a player deliberately touches the ball with their hand or arm, or when their hand/arm position makes their body unnaturally bigger.",
    tags: "handball foul rule football fifa ifab arm",
  },
  {
    q: "How does VAR work?",
    a: "The Video Assistant Referee reviews decisions using video footage. They can check goals, penalties, red cards, and mistaken identity. The on-field referee makes the final call.",
    tags: "var video assistant referee review",
  },
  {
    q: "What is a yellow card?",
    a: "A caution for reckless fouls, persistent infringement, dissent, or unsporting behavior. Two yellow cards in one match results in a red card and sending off.",
    tags: "yellow card caution booking foul",
  },
  {
    q: "What is a red card?",
    a: "A sending off for serious foul play, violent conduct, denying an obvious goal-scoring opportunity, or offensive/insulting language. The player cannot be replaced.",
    tags: "red card sending off ejection",
  },
  {
    q: "What is a penalty kick?",
    a: "Awarded when a foul is committed by the defending team inside their own penalty area. Taken from the penalty mark, 12 yards from the goal.",
    tags: "penalty kick foul box area",
  },
  {
    q: "What is a corner kick?",
    a: "Awarded when the ball crosses the goal line off the defending team (not a goal). The attacking team kicks from the corner arc.",
    tags: "corner kick set piece",
  },
  {
    q: "What is a throw-in?",
    a: "Awarded when the ball crosses the touchline off the opposing team. Thrown in with both hands from behind and over the head.",
    tags: "throw in touchline sideline",
  },
  {
    q: "How long is a match?",
    a: "Two halves of 45 minutes each, plus stoppage time added by the referee. In knockout tournaments, extra time (two 15-min halves) and penalties may follow.",
    tags: "match duration time half extra",
  },
];

export default function RulesScreen() {
  const [query, setQuery] = useState("");

  const filtered = query.trim()
    ? FAQ.filter(
        (item) =>
          item.q.toLowerCase().includes(query.toLowerCase()) ||
          item.a.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.includes(query.toLowerCase())
      )
    : FAQ;

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "How it works" }} />

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search rules..."
          placeholderTextColor="#B8B8B8"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {filtered.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}
        {filtered.length === 0 && (
          <Text style={styles.empty}>No rules found.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  searchWrap: {
    paddingHorizontal: 30,
    paddingTop: 16,
    paddingBottom: 8,
  },
  search: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#000000",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 30,
    paddingTop: 16,
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
  empty: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#B8B8B8",
    textAlign: "center",
    marginTop: 40,
  },
});

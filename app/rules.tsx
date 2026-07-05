import { useState, useEffect } from "react";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { Stack } from "expo-router";
import { colors, input } from "../lib/theme";
import { askRules } from "../lib/pulse";
import { IFAB_RULES } from "../lib/ifab-rules";

const QUICK_ITEMS = [
  { q: "What is Stadium Pulse?", a: "A local, peer-to-peer app that captures the collective reaction of fans in a stadium section — no internet required.", tags: "about app what is" },
  { q: "How does it work?", a: "Each phone senses crowd intensity via microphone energy, shares readings with nearby phones over a direct peer-to-peer connection, and fuses them into a single pulse value.", tags: "how work microphone p2p peer" },
  { q: "What is a Moment Card?", a: "A numbered, factual record of how the crowd around you reacted at a specific moment — generated entirely on your device.", tags: "moment card record save share" },
  { q: "Does it record audio?", a: "No. Only a numeric intensity score is computed. No audio leaves the device.", tags: "audio recording privacy microphone" },
  { q: "Do I need internet?", a: "No. The entire pipeline runs on-device and peer-to-peer. Airplane mode works.", tags: "internet offline airplane mode" },
];

export default function RulesScreen() {
  const [query, setQuery] = useState("");
  const [ragResults, setRagResults] = useState(null);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (query.trim().length > 2) {
      const timer = setTimeout(() => searchRAG(query), 500);
      return () => clearTimeout(timer);
    } else {
      setRagResults(null);
    }
  }, [query]);

  const searchRAG = async (q: string) => {
    setSearching(true);
    try {
      const results = await askRules(q);
      setRagResults(results);
    } catch (e) {
      setRagResults(null);
    }
    setSearching(false);
  };

  const quickFiltered = query.trim()
    ? QUICK_ITEMS.filter(
        (item) =>
          item.q.toLowerCase().includes(query.toLowerCase()) ||
          item.a.toLowerCase().includes(query.toLowerCase()) ||
          item.tags.includes(query.toLowerCase())
      )
    : QUICK_ITEMS;

  const ifabFiltered = query.trim()
    ? IFAB_RULES.filter(
        (rule) =>
          rule.content.toLowerCase().includes(query.toLowerCase())
      )
    : IFAB_RULES.slice(0, 5);

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: true, title: "How it works", headerTintColor: colors.primary, headerStyle: { backgroundColor: colors.surface }, headerTitleStyle: { fontFamily: "System", fontWeight: "500", color: colors.onSurface } }} />

      <View style={styles.searchWrap}>
        <TextInput
          style={styles.search}
          placeholder="Search rules (RAG-powered)..."
          placeholderTextColor={colors.secondary}
          value={query}
          onChangeText={setQuery}
        />
        {searching && <Text style={styles.searching}>Searching...</Text>}
      </View>

      <ScrollView style={styles.list} contentContainerStyle={styles.listContent}>
        {ragResults && (
          <View style={styles.ragSection}>
            <Text style={styles.ragTitle}>RAG Results</Text>
            <Text style={styles.ragContent}>{ragResults}</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>App Info</Text>
        {quickFiltered.map((item, i) => (
          <View key={i} style={styles.item}>
            <Text style={styles.question}>{item.q}</Text>
            <Text style={styles.answer}>{item.a}</Text>
          </View>
        ))}

        <Text style={styles.sectionTitle}>IFAB Rules</Text>
        {ifabFiltered.map((rule) => (
          <View key={rule.id} style={styles.item}>
            <Text style={styles.ruleId}>{rule.id}</Text>
            <Text style={styles.answer}>{rule.content}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral,
  },
  searchWrap: {
    paddingHorizontal: 40,
    paddingTop: 16,
    paddingBottom: 8,
  },
  search: {
    ...input,
    fontFamily: "System",
    fontSize: 14,
    color: colors.onSurface,
  },
  searching: {
    fontFamily: "System",
    fontSize: 11,
    color: colors.secondary,
    marginTop: 4,
  },
  list: {
    flex: 1,
  },
  listContent: {
    padding: 40,
    paddingTop: 16,
    gap: 24,
  },
  sectionTitle: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    color: colors.secondary,
    letterSpacing: 0.1,
  },
  item: {
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.borderSubtle,
  },
  question: {
    fontFamily: "System",
    fontSize: 16,
    fontWeight: "500",
    color: colors.onSurface,
    lineHeight: 24,
  },
  answer: {
    fontFamily: "System",
    fontSize: 14,
    fontWeight: "400",
    color: colors.mutedText,
    lineHeight: 21,
  },
  ruleId: {
    fontFamily: "System",
    fontSize: 10,
    fontWeight: "500",
    color: colors.primary,
    letterSpacing: 0.1,
  },
  ragSection: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  ragTitle: {
    fontFamily: "System",
    fontSize: 12,
    fontWeight: "500",
    color: colors.primary,
    marginBottom: 8,
  },
  ragContent: {
    fontFamily: "System",
    fontSize: 14,
    color: colors.mutedText,
    lineHeight: 21,
  },
  empty: {
    fontFamily: "System",
    fontSize: 14,
    color: colors.secondary,
    textAlign: "center",
    marginTop: 40,
  },
});

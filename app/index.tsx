import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function JoinScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Stadium{"\n"}Pulse</Text>
        <Text style={styles.subtitle}>Crowd intelligence. On-device.</Text>

        <Pressable style={styles.button} onPress={() => router.push("/moment-card")}>
          <Text style={styles.buttonText}>Join the crowd</Text>
        </Pressable>
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
    gap: 32,
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
  button: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  buttonText: {
    fontFamily: "monospace",
    fontSize: 11,
    fontWeight: "400",
    color: "#000000",
    letterSpacing: 0,
  },
});

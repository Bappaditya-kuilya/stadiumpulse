import { View } from "react-native";
import { Stack } from "expo-router";
import { DevOverlay } from "../lib/dev-overlay.js";

export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#F5F5F5" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="moment-card"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="rules" />
      </Stack>
      <DevOverlay />
    </View>
  );
}

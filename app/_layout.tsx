import { View } from "react-native";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fafafa" }}>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fafafa" },
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen
          name="moment-card"
          options={{ presentation: "modal" }}
        />
        <Stack.Screen name="rules" />
      </Stack>
    </View>
  );
}

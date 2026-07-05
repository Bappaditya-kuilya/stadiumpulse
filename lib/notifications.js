import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function sendSpikeNotification(data) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "Massive crowd reaction",
      body: `${data.minute}' — ${Math.round(data.collective)}% pulse · ${data.peerCount + 1} fans`,
      data: { momentData: data },
    },
    trigger: null,
  });
}

export function onNotificationResponse(callback) {
  return Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data.momentData;
    callback(data);
  });
}

import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

const CARDS_DIR = FileSystem.documentDirectory + "moment-cards/";

async function ensureDir() {
  const dir = await FileSystem.getInfoAsync(CARDS_DIR);
  if (!dir.exists) {
    await FileSystem.makeDirectoryAsync(CARDS_DIR, { intermediates: true });
  }
}

export async function saveCard(card) {
  await ensureDir();
  const filename = `moment-${String(card.number).padStart(2, "0")}.json`;
  const path = CARDS_DIR + filename;
  await FileSystem.writeAsStringAsync(path, JSON.stringify(card, null, 2));
  return path;
}

export async function getCards() {
  await ensureDir();
  const files = await FileSystem.readDirectoryAsync(CARDS_DIR);
  const cards = [];
  for (const file of files) {
    if (file.endsWith(".json")) {
      const content = await FileSystem.readAsStringAsync(CARDS_DIR + file);
      cards.push(JSON.parse(content));
    }
  }
  return cards.sort((a, b) => a.number - b.number);
}

export async function shareCard(card) {
  const text = `Moment #${String(card.number).padStart(2, "0")}\n${card.minute}'\nCrowd Pulse ${card.pulse}%\n${card.caption}\n${card.peerCount + 1} nearby fans synchronized\n\nGenerated locally`;
  const path = FileSystem.documentDirectory + `share-${Date.now()}.txt`;
  await FileSystem.writeAsStringAsync(path, text);
  await Sharing.shareAsync(path, { mimeType: "text/plain" });
}

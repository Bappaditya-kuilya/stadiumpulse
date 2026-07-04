import Hyperswarm from "hyperswarm";
import crypto from "crypto";

const TOPIC_SEED = "stadiumpulse-session";

function topicHash(sessionId) {
  const seed = sessionId || TOPIC_SEED;
  return crypto.createHash("sha256").update(seed).digest();
}

let swarm = null;
let peers = new Map();
let onPeerData = null;
let onPeerJoin = null;
let onPeerLeave = null;

export function initSwarm(sessionId, callbacks) {
  onPeerData = callbacks.onData;
  onPeerJoin = callbacks.onJoin;
  onPeerLeave = callbacks.onLeave;

  swarm = new Hyperswarm();

  swarm.on("connection", (conn, info) => {
    const peerId = info.publicKey.toString("hex").slice(0, 8);
    peers.set(peerId, conn);

    if (onPeerJoin) onPeerJoin(peerId);

    conn.on("data", (data) => {
      try {
        const msg = JSON.parse(data.toString());
        if (onPeerData) onPeerData(peerId, msg);
      } catch (e) {
        // ignore malformed messages
      }
    });

    conn.on("close", () => {
      peers.delete(peerId);
      if (onPeerLeave) onPeerLeave(peerId);
    });
  });

  const topic = topicHash(sessionId);
  swarm.join(topic, { server: true, client: true });

  return swarm;
}

export function broadcast(msg) {
  const data = Buffer.from(JSON.stringify(msg));
  for (const conn of peers.values()) {
    try {
      conn.write(data);
    } catch (e) {
      // peer may have disconnected
    }
  }
}

export function getPeerCount() {
  return peers.size;
}

export function getPeerIds() {
  return [...peers.keys()];
}

export function destroySwarm() {
  if (swarm) {
    swarm.destroy();
    swarm = null;
  }
  peers.clear();
}

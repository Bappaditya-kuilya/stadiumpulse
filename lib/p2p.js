// ponytail: hyperswarm needs Node.js crypto — stubbed for Expo Go
// TODO: wire real P2P via @qvac SDK HyperswarmRuntime on physical dev build

let peers = new Map();
let onPeerData = null;
let onPeerJoin = null;
let onPeerLeave = null;

export function initSwarm(sessionId, callbacks) {
  onPeerData = callbacks.onData;
  onPeerJoin = callbacks.onJoin;
  onPeerLeave = callbacks.onLeave;
  return null;
}

export function broadcast(msg) {
  for (const conn of peers.values()) {
    try {
      conn.write(JSON.stringify(msg));
    } catch (e) {}
  }
}

export function getPeerCount() {
  return peers.size;
}

export function getPeerIds() {
  return [...peers.keys()];
}

export function destroySwarm() {
  peers.clear();
}

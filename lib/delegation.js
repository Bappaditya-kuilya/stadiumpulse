let sdk = null;
let providerKey = null;
let providing = false;

async function getSDK() {
  if (!sdk) sdk = await import("@qvac/sdk");
  return sdk;
}

export async function startProvider() {
  if (providing) return providerKey;
  try {
    const s = await getSDK();
    const result = await s.startQVACProvider();
    providerKey = result.publicKey;
    providing = true;
    return providerKey;
  } catch (e) {
    console.log("Provider start failed:", e.message);
    return null;
  }
}

export async function stopProvider() {
  if (!providing) return;
  try {
    const s = await getSDK();
    await s.stopQVACProvider();
    providerKey = null;
    providing = false;
  } catch (e) {
    console.log("Provider stop failed:", e.message);
  }
}

export function getProviderKey() {
  return providerKey;
}

export function isProviding() {
  return providing;
}

export async function loadModelForDelegation(modelSrc, modelType) {
  try {
    const s = await getSDK();
    const id = await s.loadModel({ modelSrc, modelType });
    return id;
  } catch (e) {
    console.log("Delegation model load failed:", e.message);
    return null;
  }
}

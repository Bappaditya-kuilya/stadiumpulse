let sdk = null;
let embedModelId = null;
let initialized = false;

const WORKSPACE = "ifab-rules";

async function getSDK() {
  if (!sdk) sdk = await import("@qvac/sdk");
  return sdk;
}

export async function initRAG() {
  if (initialized) return;
  try {
    const s = await getSDK();
    embedModelId = await s.loadModel({
      modelSrc: { name: "EMBEDDINGGEMMA_300M_Q4_0", src: "embeddinggemma", engine: "llamacpp-embedding" },
      modelType: "llamacpp-embedding",
    });
    initialized = true;
  } catch (e) {
    console.log("RAG init failed:", e.message);
  }
}

export async function ingestRules(documents) {
  if (!initialized) await initRAG();
  if (!initialized) return null;
  try {
    const s = await getSDK();
    const result = await s.ragIngest({
      modelId: embedModelId,
      documents,
      workspace: WORKSPACE,
      chunk: true,
      chunkOpts: {
        chunkSize: 256,
        chunkOverlap: 50,
        chunkStrategy: "paragraph",
      },
    });
    return result;
  } catch (e) {
    console.log("RAG ingest failed:", e.message);
    return null;
  }
}

export async function searchRules(query, topK = 3) {
  if (!initialized) return null;
  try {
    const s = await getSDK();
    const results = await s.ragSearch({
      workspace: WORKSPACE,
      query,
      topK,
    });
    return results;
  } catch (e) {
    console.log("RAG search failed:", e.message);
    return null;
  }
}

export async function inferRules(query) {
  if (!initialized) return null;
  try {
    const s = await getSDK();
    const searchResults = await s.ragSearch({
      workspace: WORKSPACE,
      query,
      topK: 3,
    });
    if (!searchResults || searchResults.length === 0) return null;
    const context = searchResults.map((r) => r.content).join("\n\n");
    return context;
  } catch (e) {
    console.log("RAG infer failed:", e.message);
    return null;
  }
}

export function isReady() {
  return initialized;
}

require("dotenv").config();
const express = require("express");
const router = express.Router();

const OpenAI = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");

// ---------- ENV ----------
const {
  OPENAI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX,      // eg "gwf knowledge"
  PINECONE_NAMESPACE,  
  PINECONE_TOP_K,      
} = process.env;

if (!OPENAI_API_KEY) throw new Error("Missing OPENAI_API_KEY");
if (!PINECONE_API_KEY) throw new Error("Missing PINECONE_API_KEY");
if (!PINECONE_INDEX) throw new Error("Missing PINECONE_INDEX");

// ---------- CLIENTS ----------
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const pinecone = new Pinecone({ apiKey: PINECONE_API_KEY });

// helper to get namespaced index
function getPineconeIndex() {
  const base = pinecone.index(PINECONE_INDEX);
  return PINECONE_NAMESPACE ? base.namespace(PINECONE_NAMESPACE) : base;
}

// Routes

// POST (chat)
router.post("/chat", async (req, res) => {
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Invalid 'messages' payload" });
    }

    const latestMessage = messages[messages.length - 1]?.content || "";
    if (!latestMessage.trim()) {
      return res.status(400).json({ error: "Latest user message is empty" });
    }

    // 1) Embed user message
    const embeddingResp = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    const queryVector = embeddingResp?.data?.[0]?.embedding;
    if (!Array.isArray(queryVector) || queryVector.length === 0) {
      return res.status(500).json({ error: "Failed to create embedding" });
    }

    // 2)  Pinecone query
    let docContext = "";
    try {
      const index = getPineconeIndex();
      const topK = Number(PINECONE_TOP_K || 10);

      const queryResp = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
      });

      // adjsut for data
      const contexts =
        queryResp.matches
          ?.map(
            (m) =>
              m?.metadata?.text ||
              m?.metadata?.content ||
              m?.metadata?.pageContent ||
              ""
          )
          .filter(Boolean) ?? [];

      docContext = contexts.join("\n\n---\n\n");
    } catch (err) {
      console.error("Pinecone query error:", err);
      docContext = "";
    }

    // 3) template
    const systemTemplate = {
      role: "system",
      content: `You are an AI assistant that knows everything about cats. Use the below context to augment what you know about cats. The context will provide you with the most recent page data from relevant sources.
If the context doesn't include information you need, answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include.
Format responses using markdown where applicable and don't return images.

------------
START CONTEXT
${docContext}
END CONTEXT
-------------
QUESTION: ${latestMessage}
-------------`,
    };

    // 4) completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [systemTemplate, ...messages],
      temperature: 0.2,
    });

    const reply =
      completion.choices?.[0]?.message?.content ||
      "Sorry, I couldn’t generate a response.";

    return res.json({
      role: "assistant",
      content: reply,
      usage: completion.usage || null,
    });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

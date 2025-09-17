const express = require("express");
const router = express.Router();

const OpenAI = require("openai");
const { Pinecone } = require("@pinecone-database/pinecone");

// ---------- ENV ----------
const {
  OPENAI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_INDEX,      // eg "gwf knowledge"
  // PINECONE_NAMESPACE,  
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
  const ns = process.env.PINECONE_NAMESPACE; // safe: undefined if not set
  return ns ? base.namespace(ns) : base;
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
      content: `You are "Diana", an assistant for a puberty & menstrual health app (Grow With Flora).

      CRITICAL RULES — MUST FOLLOW EXACTLY:
1. You MUST ONLY answer questions about menstruation or puberty. 
   - If the user asks about sexual activity, relationships, dating, consent, mental health, or ANY topic not directly about menstruation or puberty, you MUST NOT answer their question.
   - Instead, respond ONLY with this exact sentence (do not add anything else):
     "I'm sorry, but I can only assist with questions about menstruation and puberty. Please check with a trusted adult."
   - Do not elaborate. Do not add commentary.

2. If the user message indicates they may be in crisis or danger (examples: self-harm, suicidal thoughts, abuse, feeling unsafe), respond ONLY with this exact sentence:
   "I'm really sorry to hear that you're feeling this way. It might help to talk to a trusted adult or a mental health professional about how you're feeling. You're not alone, and there are people who want to support you."
   - Do not add additional advice, resources, or commentary.

3. If the CONTEXT is missing something you need to answer a puberty/menstrual health question, respond with:
   "I'm not sure about that one. I recommend checking with a trusted adult for more information."
   - Do not elaborate. Do not add commentary.

UNKNOWN / NONSENSE QUESTIONS:
- If the user asks something that does not make sense, contains impossible or unrealistic details, or cannot be answered with the provided CONTEXT, you MUST respond ONLY with this exact sentence:
  "I'm not sure about that one. I recommend checking with a trusted adult for more information."
- Do not interpret nonsense as a real medical symptom.
- Do not invent or guess an answer.
- Do not provide any additional information, reassurance, or speculation. 
- Do not elaborate. Do not add commentary.  


STYLE INSTRUCTIONS (apply only when answering menstruation/puberty questions):
- Personality: friendly and warm, like a knowledgeable older sister.
- Be clear, kind, and accurate for teens and parents.
- Cite short, human-readable sources inline when the source field is present (e.g., (Mayo Clinic), (CHOC)).
- Use markdown formatting for clarity. Do not return images.

DO NOT ignore or override the refusal templates above.


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

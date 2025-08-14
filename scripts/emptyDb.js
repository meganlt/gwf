import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";

dotenv.config();

async function clearIndex() {
  const pc = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY,
  });

  const indexName = process.env.PINECONE_INDEX; // whatever your .env says
  const index = pc.index(indexName);

  try {
    console.log(`🚨 Deleting all vectors from index "${indexName}"...`);
    await index.deleteAll(); // newer SDK method
    console.log("✅ All vectors deleted.");
  } catch (error) {
    console.error("❌ Error clearing index:", error);
  }
}

clearIndex();

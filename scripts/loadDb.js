import "dotenv/config";
import puppeteer from "puppeteer";
import OpenAI from "openai";
import { Pinecone } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

const {
  OPENAI_API_KEY,
  PINECONE_API_KEY,
  PINECONE_ENVIRONMENT,
  PINECONE_INDEX
} = process.env;

// Init OpenAI & Pinecone
const openai = new OpenAI({ apiKey: OPENAI_API_KEY });
const pc = new Pinecone({ apiKey: PINECONE_API_KEY });
const index = pc.index(PINECONE_INDEX);

// List of URLs to scrape
const urls = [
  "https://en.wikipedia.org/wiki/Cat_coat_genetics",
  "https://en.wikipedia.org/wiki/Salmiak_cat",
  "https://en.wikipedia.org/wiki/Cat"
];

// Chunker setup
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});

// Scrape function using Puppeteer
async function scrapePage(url) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

  const html = await page.evaluate(() => document.body.innerText || "");
  await browser.close();

  return html.replace(/\s+/g, " ").trim();
}

// Store one chunk in Pinecone
async function storeChunk(id, text, source) {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: text
  });

  const vector = embedding.data[0].embedding;
  await index.upsert([
    {
      id,
      values: vector,
      metadata: { text, source }
    }
  ]);
}

async function runIngestion() {
  for (const url of urls) {
    console.log(`Scraping: ${url}`);
    const content = await scrapePage(url);

    console.log(`Splitting into chunks...`);
    const chunks = await splitter.splitText(content);

    for (let i = 0; i < chunks.length; i++) {
      const chunkId = `${url}#${i}`;
      await storeChunk(chunkId, chunks[i], url);
      console.log(`Stored chunk ${i + 1}/${chunks.length} from ${url}`);
    }
  }

  console.log("✅ Ingestion complete");
}

runIngestion().catch(console.error);

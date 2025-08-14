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
    "https://health.choc.org/puberty-an-ultimate-guide-for-parents/",
    "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4266869/",
    "https://www.healthychildren.org/English/ages-stages/gradeschool/puberty/Pages/Physical-Development-Girls-What-to-Expect.aspx",
    "https://kidshelpline.com.au/parents/issues/mood-swings-and-puberty",
    "https://childrenswi.org/at-every-turn/stories/teen-body-odor",
    "https://www.mayoclinichealthsystem.org/hometown-health/speaking-of-health/tips-for-managing-teen-acne",
    "https://my.clevelandclinic.org/health/symptoms/4719-vaginal-discharge",
    "https://www.plannedparenthood.org/learn/parents",
    "https://life-insight.com/friendship-changes-in-the-teenage-years/",
    "https://www.mind.org.uk/for-young-people/feelings-and-experiences/confidence-and-self-esteem/",
    "https://helloclue.com/articles/life-stages/puberty-101-clue-guide-to-getting-your-period-part-1",
    "https://pubertycurriculum.com/healthy-habits-for-personal-hygiene-during-puberty/",
    "https://kids.frontiersin.org/articles/10.3389/frym.2024.1178387",
    "https://www.thewomens.org.au/health-information/periods/periods-overview/about-periods",
    "https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186",
    "https://kidshealth.org/en/teens/menstruation.html",
    "https://www.verywellhealth.com/signs-your-daughter-is-about-to-start-her-period-8787076",
    "https://kidshealth.org/en/teens/expert-period.html",
    "https://my.clevelandclinic.org/health/articles/10132-menstrual-cycle",
    "https://www.verywellhealth.com/menstruation-and-first-periods-3520911",
    "https://www.nhs.uk/conditions/pre-menstrual-syndrome/",
    "https://kidshealth.org/en/parents/talk-about-menstruation.html",
    "https://womenshealth.gov/menstrual-cycle/premenstrual-syndrome",
    "https://www.reddit.com/r/Periods/comments/1bfp3fn/all_my_friends_have_their_period_except_me/",
    "https://www.unicef.org/parenting/health/talking-about-periods-at-home",
    "https://myteena.com/us/en/for-teens/period/how-to-tell-your-parent-you-got-your-period/",
    "https://www.wellbeingofwomen.org.uk/health-information/who-can-i-trust-when-learning-about-my-period/",
    "https://www.healthline.com/health/womens-health/period-myths",
    "https://www.always.com/en-us/tips-and-advice/the-talk/8-period-myths-that-moms-can-bust",
    "https://young.scot/get-informed/period-myths-busted/",
    "https://northpointeobgyn.com/blog/busting-menstruation-myths-for-teenage-girls/",
    "https://allianceforperiodsupplies.org/6-myths-about-periods/",
    "https://childmind.org/article/my-daughter-with-anxiety-issues-is-worried-about-getting-her-period-what-can-i-do/",
    "https://www.calm.com/blog/anxiety-before-period",
    "https://www.buzzfeed.com/ravenishak/first-period-stories",
    "https://www.planusa.org/blog/true-story-my-first-period/",
    "https://storymaps.arcgis.com/stories/4f8da19484ea46e0abaacee95312f26c",
    "https://www.lunette.com/blogs/posts/4-women-get-real-about-their-first-period",
    "https://www.thewomens.org.au/health-information/periods/periods-overview/about-periods",
    "https://www.healthline.com/health/menstruation/how-often-should-you-change-your-pad",
    "https://kidshealth.org/en/kids/period-school.html",
    "https://www.womenshealthmag.com/health/a19938692/period-leaks-in-public/",
    "https://www.houstonmethodist.org/blog/articles/2021/sep/menstrual-cramps-5-tips-for-getting-relief-from-period-pain/",
    "https://www.mayoclinic.org/healthy-lifestyle/womens-health/in-depth/menstrual-cycle/art-20047186",
    "https://www.nhs.uk/conditions/irregular-periods/",
    "https://healthmatters.nyp.org/what-to-eat-during-your-period-foods-that-help-reduce-cramps-and-foods-to-avoid/",
    "https://www.healthline.com/health/exercise-during-period",
    "https://www.sleepfoundation.org/insomnia/pms-and-insomnia",
    "https://www.unicef.org/parenting/health/talking-about-periods-at-home",
    // Grow With Flora Newsletter Archive
    "https://growwithflora.beehiiv.com/p/your-guide-to-the-period-aisle",
    "https://growwithflora.beehiiv.com/p/be-in-tune-with-your-cycle",
    "https://growwithflora.beehiiv.com/p/happy-holidays-from-flora",
    "https://growwithflora.beehiiv.com/p/drink-up-why-hydration-is-your-period-s-best-friend",
    "https://growwithflora.beehiiv.com/p/a-sweet-surprise-in-your-inbox",
    "https://growwithflora.beehiiv.com/p/more-of-flora",
    "https://growwithflora.beehiiv.com/p/welcome-to-grow-with-flora"
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

import { fetchOpenAlex } from "../services/openalex.service.js";
import { fetchTrials } from "../services/trials.service.js";
import { rankResults } from "../services/ranking.service.js";
import { generateAiInsights } from "../services/llm.service.js";

/* -------------------- INTENT DETECTION -------------------- */

const detectIntent = (query) => {
  if (!query) return "general";

  const q = query.toLowerCase();

  if (q.includes("treatment") || q.includes("therapy") || q.includes("stimulation")) return "treatment";
  if (q.includes("trial") || q.includes("study")) return "trial";
  if (q.includes("cause") || q.includes("mechanism")) return "research";

  return "general";
};

export const searchController = async (req, res) => {
  try {
    const { disease, query, location } = req.body;

    if (!disease) {
      return res.status(400).json({ error: "Disease is required" });
    }

    /* -------------------- QUERY BUILD -------------------- */

    const finalQuery = query
      ? `${disease} ${query}`
      : disease;

    const intent = detectIntent(query);

    console.log("🔍 Query:", finalQuery);
    console.log("🧠 Intent:", intent);

    /* -------------------- FETCH -------------------- */

    const [papersRaw, trialsRaw] = await Promise.all([
      fetchOpenAlex(finalQuery),
      fetchTrials(disease),
    ]);

    console.log("📊 Papers fetched:", papersRaw.length);
    console.log("📊 Trials fetched:", trialsRaw.length);

    /* -------------------- RANKING -------------------- */

    const papers = rankResults(
      papersRaw,
      disease,
      query,
      location,
      "paper",
      intent,
      trialsRaw
    );

    const clinicalTrials = rankResults(
      trialsRaw,
      disease,
      query,
      location,
      "trial",
      intent,
      papersRaw
    );

    /* -------------------- AI -------------------- */

    const ai = await generateAiInsights({
      disease,
      query,
      location,
      papers,
      trials: clinicalTrials,
    });

    /* -------------------- RESPONSE -------------------- */

    res.json({
      ...ai,
      papers,
      clinicalTrials,
      metadata: {
        totalFetched: papersRaw.length + trialsRaw.length,
        papersFetched: papersRaw.length,
        trialsFetched: trialsRaw.length,
        returnedPapers: papers.length,
        returnedTrials: clinicalTrials.length,
        intent,
        rankingStrategy:
          "multi-factor scoring (disease + query + recency + location + intent + cross-source validation)",
      },
    });

  } catch (error) {
    console.error("❌ Search error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
};
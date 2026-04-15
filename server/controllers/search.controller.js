import { fetchPubMed } from "../services/pubmed.service.js";
import { fetchOpenAlex } from "../services/openalex.service.js";
import { fetchTrials } from "../services/trials.service.js";
import {
  buildStructuredResponse,
  normalizeOpenAlexCandidates,
  normalizePubMedCandidates,
  normalizeTrialCandidates,
} from "../services/merge.service.js";
import { generateAiInsights } from "../services/llm.service.js";
import { rankResults } from "../services/ranking.service.js";
import { resolveSearchContext } from "../services/context.service.js";
import { buildSearchQuery } from "../utils/queryBuilder.js";

export const searchController = async (req, res) => {
  try {
    const { disease = "", query = "", location = "" } = resolveSearchContext(
      req.body,
    );
    const finalQuery = buildSearchQuery({ disease, query });

    if (!finalQuery && !disease) {
      return res.status(400).json({ error: "A query or disease is required." });
    }

    const context = { disease, query, location };
    const [pubmedResponse, openalexResponse, trialsResponse] = await Promise.all([
      fetchPubMed(finalQuery),
      fetchOpenAlex(finalQuery),
      fetchTrials({ disease, query, location }),
    ]);
    const pubmedCandidates = normalizePubMedCandidates(pubmedResponse.items);
    const openalexCandidates = normalizeOpenAlexCandidates(openalexResponse.items);
    const trialCandidates = normalizeTrialCandidates(trialsResponse.items);
    const papers = rankResults(
      [...pubmedCandidates, ...openalexCandidates],
      disease,
      query,
      location,
    );
    const clinicalTrials = rankResults(
      trialCandidates,
      disease,
      query,
      location,
    );
    const llmResponse = await generateAiInsights({
      disease,
      query,
      location,
      papers,
      trials: clinicalTrials,
    });
    const metadata = {
      totalFetched: {
        pubmed: pubmedResponse.totalFetched,
        openalex: openalexResponse.totalFetched,
        clinicalTrials: trialsResponse.totalFetched,
      },
      filteredCount: {
        papers: papers.length,
        clinicalTrials: clinicalTrials.length,
      },
      rankingStrategy:
        "40 relevance, 20 recency, 20 location, 10 recruiting status, 10 source credibility",
    };

    console.log("[search] expandedQuery:", finalQuery);
    console.log("[search] fetched:", metadata.totalFetched);
    console.log("[search] returned:", metadata.filteredCount);

    const formatted = buildStructuredResponse({
      overview: llmResponse.overview,
      topRecommendation: llmResponse.topRecommendation,
      aiInsights: llmResponse.aiInsights,
      papers,
      clinicalTrials,
      metadata,
    });

    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

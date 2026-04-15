import { http } from "./http.service.js";

const DEFAULT_MODEL = "google/flan-t5-large";

/* -------------------- FALLBACK (NO TOKEN / FAIL SAFE) -------------------- */

const fallbackInsights = ({ disease, query, location, papers, trials }) => {
  const topPaper = papers?.[0];
  const topTrial = trials?.[0];

  return {
    overview: `${disease} evidence analyzed${query ? ` focusing on ${query}` : ""}${location ? ` in ${location}` : ""}.`,

    topRecommendation: topTrial
      ? `Most relevant clinical trial: ${topTrial.title}. Reason: ${topTrial.reason}.`
      : topPaper
        ? `Top research paper: ${topPaper.title}.`
        : "No strong recommendation available.",

    aiInsights: [
      `Key insight: ${topPaper ? topPaper.title : "No high-ranked publication available."}`,
      `Treatment approach: Focus on evidence-backed methods${query ? ` related to ${query}` : ""}.`,
      `Recommendation: Validate results clinically before applying.`,
      `Risk: Always verify trial eligibility and patient-specific conditions.`,
    ].join("\n"),
  };
};

/* -------------------- MAIN FUNCTION -------------------- */

export const generateAiInsights = async ({
  disease,
  query,
  location,
  papers = [],
  trials = [],
}) => {
  const apiToken = process.env.HF_API_TOKEN;
  const model = process.env.HF_MODEL || DEFAULT_MODEL;

  // 👉 If no token → fallback (important for demo reliability)
  if (!apiToken) {
    console.log("⚠️ No HF token → using fallback insights");
    return fallbackInsights({ disease, query, location, papers, trials });
  }

  /* -------------------- SAFE DATA (LIMIT SIZE) -------------------- */

  const safePapers = papers.slice(0, 5).map((p) => ({
    title: p.title,
    year: p.year,
    score: p.score,
    reason: p.reason,
  }));

  const safeTrials = trials.slice(0, 5).map((t) => ({
    title: t.title,
    status: t.status,
    location: t.location,
    score: t.score,
    reason: t.reason,
  }));

  /* -------------------- PROMPT (CLEAN + NON-HALLUCINATED) -------------------- */

  const prompt = `
You are a medical research assistant.

Patient:
- Disease: ${disease}
- Query: ${query || "General"}
- Location: ${location || "Not specified"}

Top Research Papers:
${JSON.stringify(safePapers, null, 2)}

Top Clinical Trials:
${JSON.stringify(safeTrials, null, 2)}

TASK:
Provide:

1. Key Medical Insight
2. Best Treatment Approach
3. Most Relevant Clinical Trial (with reason)
4. Risks or Considerations

RULES:
- Use ONLY provided data
- Do NOT hallucinate
- Be concise and factual
`;

  try {
    const response = await http.post(
      `https://api-inference.huggingface.co/models/${model}`,
      {
        inputs: prompt,
        parameters: {
          max_new_tokens: 220,
          temperature: 0.2,
          return_full_text: false,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text =
      response?.data?.[0]?.generated_text ||
      response?.data?.generated_text;

    if (!text) {
      console.log("⚠️ Empty HF response → fallback");
      return fallbackInsights({ disease, query, location, papers, trials });
    }

    /* -------------------- CLEAN RESPONSE -------------------- */

    return {
      overview: `${disease} evidence ranked across research papers and clinical trials.`,

      topRecommendation: trials[0]
        ? `Top trial: ${trials[0].title} (${trials[0].status})`
        : papers[0]
          ? `Top paper: ${papers[0].title}`
          : "No strong recommendation available.",

      aiInsights: text.trim(),
    };

  } catch (error) {
    console.error("❌ Hugging Face Error:", error.message);
    return fallbackInsights({ disease, query, location, papers, trials });
  }
};

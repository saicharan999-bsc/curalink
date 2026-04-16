export const rankResults = (
  items,
  disease,
  query,
  location,
  type,
  intent = "general",
  crossSource = []
) => {
  if (!items || items.length === 0) return [];

  return items
    .map((item) => {
      let score = 0;
      let reasons = new Set();

      const text = `${item.title} ${item.summary}`.toLowerCase();

      /* -------------------- DISEASE MATCH -------------------- */
      if (disease && text.includes(disease.toLowerCase())) {
        score += 40;
        reasons.add("matches disease");
      }

      /* -------------------- QUERY MATCH -------------------- */
      if (query) {
        const q = query.toLowerCase();

        if (text.includes(q)) {
          score += 35;
          reasons.add("matches treatment/query");
        }

        // partial match
        q.split(" ").forEach((word) => {
          if (word.length > 3 && text.includes(word)) {
            score += 5;
          }
        });
      }

      /* -------------------- RECENCY -------------------- */
      if (item.year >= 2023) {
        score += 25;
        reasons.add("very recent");
      } else if (item.year >= 2020) {
        score += 15;
        reasons.add("recent study");
      } else if (item.year >= 2015) {
        score += 5;
      }

      /* -------------------- LOCATION -------------------- */
      if (
        type === "trial" &&
        location &&
        item.location?.toLowerCase().includes(location.toLowerCase())
      ) {
        score += 20;
        reasons.add("location match");
      }

      /* -------------------- TRIAL STATUS -------------------- */
      if (type === "trial" && item.status === "RECRUITING") {
        score += 20;
        reasons.add("recruiting trial");
      }

      /* -------------------- INTENT BOOST -------------------- */
      if (intent === "treatment" && text.includes("treatment")) {
        score += 15;
        reasons.add("treatment-focused");
      }

      if (intent === "trial" && type === "trial") {
        score += 25;
        reasons.add("trial-focused");
      }

      /* -------------------- CROSS-SOURCE VALIDATION -------------------- */
      if (crossSource.length > 0) {
        const keyword = item.title.split(" ")[0]?.toLowerCase();

        const matched = crossSource.some((c) =>
          c.title?.toLowerCase().includes(keyword)
        );

        if (matched) {
          score += 15;
          reasons.add("supported by multiple sources");
        }
      }

      /* -------------------- CONFIDENCE -------------------- */
      let confidence = "LOW";
      if (score > 120) confidence = "HIGH";
      else if (score > 70) confidence = "MEDIUM";

      return {
        ...item,
        score,
        confidence,
        reason: Array.from(reasons).join(", "),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);
};
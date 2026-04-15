const tokenize = (value = "") =>
  value
    .toLowerCase()
    .split(/[^a-z0-9]+/i)
    .filter((token) => token.length > 2);

const countKeywordCoverage = (text, terms) => {
  if (!terms.length) {
    return 0;
  }

  const matches = terms.filter((term) => text.includes(term)).length;

  return matches / terms.length;
};

const getRecencyScore = (year) => {
  const numericYear = Number(year);

  if (!numericYear) {
    return 0;
  }

  const currentYear = new Date().getFullYear();
  const age = currentYear - numericYear;

  if (age <= 2) {
    return 20;
  }

  if (age <= 5) {
    return 15;
  }

  if (age <= 10) {
    return 10;
  }

  if (age <= 15) {
    return 5;
  }

  return 0;
};

const getLocationScore = (item, location) => {
  if (item.type !== "trial" || !location) {
    return 0;
  }

  const locationTerms = tokenize(location);
  const locationText = `${item.location || ""} ${item.searchableText || ""}`.toLowerCase();

  if (!locationTerms.length) {
    return 0;
  }

  const coverage = countKeywordCoverage(locationText, locationTerms);

  return Math.round(coverage * 20);
};

const getRecruitingScore = (item) => {
  if (item.type !== "trial") {
    return 0;
  }

  const recruitingStatuses = [
    "recruiting",
    "not yet recruiting",
    "enrolling by invitation",
    "active, not recruiting",
  ];

  return recruitingStatuses.includes(item.status?.toLowerCase()) ? 10 : 0;
};

const getReliabilityScore = (item) => {
  if (item.source === "PubMed" || item.source === "ClinicalTrials.gov") {
    return 10;
  }

  if (item.source === "OpenAlex") {
    return 8;
  }

  return 0;
};

const buildReason = (reasonParts) =>
  reasonParts.length
    ? reasonParts.join("; ")
    : "Selected because it remains one of the strongest available matches.";

export const rankResults = (
  data = [],
  disease = "",
  query = "",
  location = "",
) => {
  const keywords = [...tokenize(disease), ...tokenize(query)];

  return data
    .map((item) => {
      const searchableText = [
        item.title,
        item.summary,
        item.authors,
        item.journal,
        item.location,
        item.status,
        item.snippet,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const keywordCoverage = countKeywordCoverage(searchableText, keywords);
      const keywordScore = Math.round(keywordCoverage * 40);
      const recencyScore = getRecencyScore(item.year);
      const locationScore = getLocationScore(item, location);
      const recruitingScore = getRecruitingScore(item);
      const reliabilityScore = getReliabilityScore(item);
      const score =
        keywordScore +
        recencyScore +
        locationScore +
        recruitingScore +
        reliabilityScore;
      const reasonParts = [
        keywordScore
          ? `Keyword relevance matched ${Math.round(keywordCoverage * 100)}% of disease/query terms`
          : "",
        recencyScore ? `Recent evidence from ${item.year}` : "",
        locationScore ? `Location aligned with ${location}` : "",
        recruitingScore ? "Trial is currently recruiting or enrollment-relevant" : "",
        reliabilityScore ? `Trusted source: ${item.source}` : "",
      ].filter(Boolean);

      return {
        ...item,
        score,
        reason: buildReason(reasonParts),
        explanation: [
          `Selected because it matches ${disease || "the condition"}${query ? ` and the query "${query}"` : ""}.`,
          recencyScore ? `It includes relatively recent evidence from ${item.year}.` : "",
          locationScore ? `The study location is relevant to ${location}.` : "",
          recruitingScore ? "The trial is still actionable based on its recruiting status." : "",
          reliabilityScore ? `The source is considered credible (${item.source}).` : "",
        ]
          .filter(Boolean)
          .join(" "),
      };
    })
    .sort((left, right) => right.score - left.score)
    .slice(0, 8);
};

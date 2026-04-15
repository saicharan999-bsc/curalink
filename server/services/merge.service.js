const rebuildOpenAlexAbstract = (invertedIndex = {}) =>
  Object.entries(invertedIndex)
    .flatMap(([word, positions]) => positions.map((position) => ({ word, position })))
    .sort((left, right) => left.position - right.position)
    .map((entry) => entry.word)
    .join(" ");

const safeText = (value = "", fallback = "") => {
  const cleaned = typeof value === "string" ? value.trim() : "";

  return cleaned || fallback;
};

export const normalizePubMedCandidates = (items = []) =>
  items.map((item) => ({
    id: item.id || "",
    title: safeText(item.title, "Untitled publication"),
    summary: safeText(item.abstract, "No abstract available."),
    year: safeText(item.year),
    authors: safeText(item.authors),
    source: "PubMed",
    url: safeText(item.url),
    location: "",
    status: "",
    type: "paper",
    journal: safeText(item.journal),
    snippet: safeText(item.abstract, item.title),
  }));

export const normalizeOpenAlexCandidates = (items = []) =>
  items.map((item) => ({
    id: item.id || "",
    title: safeText(item.display_name, "Untitled publication"),
    summary: safeText(
      rebuildOpenAlexAbstract(item.abstract_inverted_index),
      "No abstract available.",
    ),
    year: item.publication_year ? String(item.publication_year) : "",
    authors: (item.authorships || [])
      .slice(0, 6)
      .map((authorship) => authorship.author?.display_name)
      .filter(Boolean)
      .join(", "),
    source: "OpenAlex",
    url: safeText(item.id),
    location: "",
    status: "",
    type: "paper",
    journal: safeText(item.primary_location?.source?.display_name),
    snippet: safeText(
      rebuildOpenAlexAbstract(item.abstract_inverted_index),
      item.display_name,
    ),
  }));

export const normalizeTrialCandidates = (items = []) =>
  items.map((study) => {
    const firstLocation =
      study.protocolSection?.contactsLocationsModule?.locations?.[0];

    return {
      id: study.protocolSection?.identificationModule?.nctId || "",
      title:
        safeText(
          study.protocolSection?.identificationModule?.briefTitle,
          "Clinical trial",
        ),
      summary: safeText(
        study.protocolSection?.descriptionModule?.briefSummary,
        study.protocolSection?.descriptionModule?.detailedDescription ||
          "No study summary available.",
      ),
      year:
        study.protocolSection?.statusModule?.startDateStruct?.date?.slice(0, 4) ||
        study.protocolSection?.statusModule?.studyFirstPostDateStruct?.date?.slice(0, 4) ||
        "",
      authors: safeText(
        study.protocolSection?.sponsorCollaboratorsModule?.leadSponsor?.name,
      ),
      source: "ClinicalTrials.gov",
      url: study.protocolSection?.identificationModule?.nctId
        ? `https://clinicaltrials.gov/study/${study.protocolSection.identificationModule.nctId}`
        : "",
      location: [firstLocation?.city, firstLocation?.country]
        .filter(Boolean)
        .join(", "),
      status: safeText(study.protocolSection?.statusModule?.overallStatus),
      type: "trial",
      journal: "",
      snippet: safeText(
        study.protocolSection?.descriptionModule?.briefSummary,
        study.protocolSection?.identificationModule?.briefTitle,
      ),
    };
  });

export const buildStructuredResponse = ({
  overview,
  topRecommendation,
  aiInsights,
  papers,
  clinicalTrials,
  metadata,
}) => ({
  overview,
  topRecommendation,
  aiInsights,
  papers,
  clinicalTrials,
  metadata,
});

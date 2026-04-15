export function formatPublicationItem(item) {
  return {
    title: item?.title || "Publication",
    subtitle: [item?.source, item?.year, item?.authors].filter(Boolean).join(" | "),
    description: item?.summary || "No summary available.",
    link: item?.url,
    source: item?.source || "Publication",
    relevanceNote: item?.reason || "",
    meta: [
      item?.score ? `Score: ${item.score}` : "",
      item?.journal ? `Journal: ${item.journal}` : "",
    ].filter(Boolean),
  };
}

export function formatOpenAlexItem(item) {
  return {
    title: item?.display_name || "OpenAlex work",
    subtitle: item?.publication_year ? String(item.publication_year) : "",
    description: item?.authorships?.[0]?.author?.display_name || "",
    link: item?.id,
  };
}

export function formatTrialItem(item) {
  return {
    title: item?.title || "Clinical trial",
    subtitle: [item?.source, item?.status, item?.location].filter(Boolean).join(" | "),
    description: item?.summary || "No summary available.",
    link: item?.url || "",
    source: item?.source || "ClinicalTrials.gov",
    relevanceNote: item?.reason || "",
    meta: [
      item?.score ? `Score: ${item.score}` : "",
      item?.year ? `Year: ${item.year}` : "",
      item?.authors ? `Sponsor: ${item.authors}` : "",
    ].filter(Boolean),
  };
}

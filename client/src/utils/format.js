export function formatPubMedItem(item) {
  if (typeof item === "string") {
    return {
      title: "PubMed XML response",
      description: item.slice(0, 180),
    };
  }

  return {
    title: item?.title || "PubMed item",
    description: item?.abstract || "No summary available.",
    link: item?.url,
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
    title: item?.protocolSection?.identificationModule?.briefTitle || "Clinical trial",
    subtitle: item?.protocolSection?.statusModule?.overallStatus || "",
    description:
      item?.protocolSection?.descriptionModule?.briefSummary ||
      "No summary available.",
    link: item?.protocolSection?.identificationModule?.nctId
      ? `https://clinicaltrials.gov/study/${item.protocolSection.identificationModule.nctId}`
      : "",
  };
}

import { http } from "./http.service.js";

const trialStatusPriority = {
  RECRUITING: 1,
  "NOT_YET_RECRUITING": 2,
  "ACTIVE_NOT_RECRUITING": 3,
};

export const fetchTrials = async ({ disease, query, location }) => {
  try {
    const condition = encodeURIComponent(disease || query || "");
    const term = encodeURIComponent([query, location].filter(Boolean).join(" "));
    const url = `https://clinicaltrials.gov/api/v2/studies?query.cond=${condition}&query.term=${term}&pageSize=40&format=json`;
    const res = await http.get(url);
    const items = (res.data.studies || []).sort((left, right) => {
      const leftStatus = left.protocolSection?.statusModule?.overallStatus || "";
      const rightStatus = right.protocolSection?.statusModule?.overallStatus || "";

      return (
        (trialStatusPriority[leftStatus] || 99) -
        (trialStatusPriority[rightStatus] || 99)
      );
    });

    return {
      items,
      totalFetched: items.length,
    };
  } catch (err) {
    console.error(err);
    return { items: [], totalFetched: 0 };
  }
};

import axios from "axios";

export const fetchTrials = async (disease) => {
  try {
    const res = await axios.get(
      `https://clinicaltrials.gov/api/v2/studies?query.cond=${encodeURIComponent(
        disease
      )}&pageSize=100`
    );

    const studies = res.data.studies || [];

    return studies
      .filter((t) => t.protocolSection) // remove invalid
      .map((t) => {
        const protocol = t.protocolSection;

        const title =
          protocol.identificationModule?.briefTitle || "No title";

        const status =
          protocol.statusModule?.overallStatus || "UNKNOWN";

        const locations =
          protocol.contactsLocationsModule?.locations || [];

        const firstLocation = locations[0];

        const city = firstLocation?.city || "";
        const country = firstLocation?.country || "";

        const location = [city, country].filter(Boolean).join(", ") || "N/A";

        /* -------------------- SUMMARY IMPROVEMENT -------------------- */

        let summary =
          protocol.descriptionModule?.briefSummary ||
          protocol.descriptionModule?.detailedDescription ||
          "Clinical trial investigating treatment effectiveness";

        /* -------------------- CLEAN SUMMARY -------------------- */

        if (summary.length > 300) {
          summary = summary.slice(0, 300) + "...";
        }

        /* -------------------- RETURN -------------------- */

        return {
          title,
          summary,
          status,
          location,
          type: "trial",
        };
      })
      .slice(0, 80); // deep pool

  } catch (err) {
    console.error("❌ Trials error:", err.message);
    return [];
  }
};
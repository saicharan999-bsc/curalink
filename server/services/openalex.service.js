import axios from "axios";

export const fetchOpenAlex = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);

    const res = await axios.get(
      `https://api.openalex.org/works?search=${encodedQuery}&per-page=100`
    );

    const results = res.data.results || [];

    return results
      .filter((item) => item.display_name) // remove bad entries
      .map((item) => {
        /* -------------------- ABSTRACT FIX -------------------- */
        let summary = "No summary available";

        if (item.abstract_inverted_index) {
          const words = [];

          Object.entries(item.abstract_inverted_index).forEach(
            ([word, positions]) => {
              positions.forEach((pos) => {
                words[pos] = word;
              });
            }
          );

          summary = words.join(" ");
        }

        /* -------------------- CLEAN SUMMARY -------------------- */
        if (!summary || summary.length < 30) {
          summary = item.display_name;
        }

        /* -------------------- RETURN -------------------- */
        return {
          title: item.display_name,
          summary,
          year: item.publication_year || 0,
          authors:
            item.authorships
              ?.slice(0, 3)
              .map((a) => a.author.display_name)
              .join(", ") || "Unknown",
          source: "OpenAlex",
          url: item.id,
          type: "paper",
        };
      })
      .slice(0, 80); // keep deep pool

  } catch (err) {
    console.error("❌ OpenAlex error:", err.message);
    return [];
  }
};
import { http } from "./http.service.js";

const rebuildAbstract = (invertedIndex = {}) =>
  Object.entries(invertedIndex)
    .flatMap(([word, positions]) => positions.map((position) => ({ word, position })))
    .sort((left, right) => left.position - right.position)
    .map((entry) => entry.word)
    .join(" ");

export const fetchOpenAlex = async (query) => {
  try {
    const encodedQuery = encodeURIComponent(query);
    const pageRequests = [1, 2, 3].map((page) =>
      http.get(
        `https://api.openalex.org/works?search=${encodedQuery}&per-page=50&page=${page}&sort=relevance_score:desc`,
      ),
    );
    const responses = await Promise.all(pageRequests);
    const items = responses.flatMap((response) => response.data.results || []);

    return {
      items,
      totalFetched: items.length,
    };
  } catch (err) {
    console.error(err);
    return { items: [], totalFetched: 0 };
  }
};

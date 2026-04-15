const cleanValue = (value = "") => value.trim();

export const buildSearchQuery = ({ disease = "", query = "" }) => {
  return [cleanValue(disease), cleanValue(query)].filter(Boolean).join(" AND ");
};

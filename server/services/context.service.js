let lastContext = {
  disease: "",
  query: "",
  location: "",
};

export const resolveSearchContext = (input = {}) => {
  const context = {
    disease: input.disease?.trim() || lastContext.disease,
    query: input.query?.trim() || lastContext.query,
    location: input.location?.trim() || lastContext.location,
  };

  lastContext = context;

  return context;
};

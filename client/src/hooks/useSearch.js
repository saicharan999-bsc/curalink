import { useState } from "react";
import { searchResearch } from "../api/api";

const initialResults = {
  overview: "",
  topRecommendation: "",
  aiInsights: "",
  context: null,
  papers: [],
  clinicalTrials: [],
  metadata: null,
};

export function useSearch() {
  const [form, setForm] = useState({
    disease: "",
    query: "",
    location: "",
  });

  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    setHasSearched(true);

    try {
      const data = await searchResearch(form);

      setResults({
        overview: data.overview || "",
        topRecommendation: data.topRecommendation || "",
        aiInsights: data.aiInsights || "",
        papers: data.papers || [],
        clinicalTrials: data.clinicalTrials || [],
        metadata: data.metadata || null,
        context: {
          disease: form.disease,
          query: form.query,
          location: form.location,
        },
      });

    } catch (error) {
      console.error(error);
      setResults(initialResults);
      setError("Search failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return {
    form,
    loading,
    results,
    error,
    hasSearched,
    onChange,
    onSubmit,
  };
}
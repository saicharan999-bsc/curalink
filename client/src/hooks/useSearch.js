import { useState } from "react";
import { searchResources } from "../api/api.js";

const initialResults = {
  pubmed: [],
  openalex: [],
  trials: [],
};

export function useSearch() {
  const [form, setForm] = useState({ query: "", disease: "" });
  const [results, setResults] = useState(initialResults);
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = await searchResources(form);
      setResults({
        pubmed: data.pubmed || [],
        openalex: data.openalex || [],
        trials: data.trials || [],
      });
    } catch (error) {
      console.error(error);
      setResults(initialResults);
    } finally {
      setLoading(false);
    }
  };

  return { form, loading, results, onChange, onSubmit };
}

import React, { useState } from "react";
import { searchResearch } from "./api/api";

function App() {
  const [disease, setDisease] = useState("");
  const [query, setQuery] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const res = await searchResearch({ disease, query });
    setData(res);
    setLoading(false);
  };

  return (
    <div style={{ padding: "20px", background: "#0f172a", color: "white" }}>
      <h1>AI Medical Research Assistant</h1>

      <input
        placeholder="Disease"
        value={disease}
        onChange={(e) => setDisease(e.target.value)}
      />

      <input
        placeholder="Query"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      {loading && <p>Loading...</p>}

      {data && (
        <>
          <h2>🧠 Overview</h2>
          <p>{data.overview}</p>

          <h2>📚 Research Papers</h2>
          {data.papers.map((p, i) => (
            <div key={i}>
              <h3>{p.title}</h3>
              <p>{p.summary}</p>
              <small>{p.year} | {p.authors}</small>
            </div>
          ))}

          <h2>🧪 Clinical Trials</h2>
          {data.clinicalTrials.map((t, i) => (
            <div key={i}>
              <h3>{t.title}</h3>
              <p>Status: {t.status}</p>
              <p>Location: {t.location}</p>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

export default App;
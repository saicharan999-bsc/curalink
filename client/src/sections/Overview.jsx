export default function Overview({ results }) {
  if (
    !results.overview &&
    !results.topRecommendation &&
    !results.aiInsights &&
    !results.papers.length &&
    !results.clinicalTrials.length
  ) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">AI Insight Panel</p>
          <h2>Clinical evidence summary</h2>
        </div>
      </div>
      {results.overview ? <p className="hero-copy">{results.overview}</p> : null}
      {results.topRecommendation ? (
        <article className="recommendation-card">
          <span className="card-badge">Top Recommendation</span>
          <p className="card-note">{results.topRecommendation}</p>
        </article>
      ) : null}
      {results.aiInsights ? (
        <article className="insight-panel">
          <span className="card-badge">AI Insight</span>
          <pre className="insight-copy">{results.aiInsights}</pre>
        </article>
      ) : null}
      <div className="stats-grid">
        <div className="stat">
          <span>Ranked Papers</span>
          <strong>{results.papers.length}</strong>
        </div>
        <div className="stat">
          <span>Ranked Trials</span>
          <strong>{results.clinicalTrials.length}</strong>
        </div>
        <div className="stat">
          <span>Total Fetched</span>
          <strong>
            {results.metadata
              ? (results.metadata.totalFetched.pubmed || 0) +
                (results.metadata.totalFetched.openalex || 0) +
                (results.metadata.totalFetched.clinicalTrials || 0)
              : 0}
          </strong>
        </div>
      </div>
      {results.metadata ? (
        <p className="source-note">
          Retrieved {results.metadata.totalFetched.pubmed} PubMed papers,{" "}
          {results.metadata.totalFetched.openalex} OpenAlex papers, and{" "}
          {results.metadata.totalFetched.clinicalTrials} clinical trials using{" "}
          {results.metadata.rankingStrategy}.
        </p>
      ) : null}
    </section>
  );
}

export default function Overview({ results }) {
  return (
    <section className="section">
      <h2>Overview</h2>
      <div className="stats-grid">
        <div className="stat">
          <span>PubMed</span>
          <strong>{results.pubmed.length}</strong>
        </div>
        <div className="stat">
          <span>OpenAlex</span>
          <strong>{results.openalex.length}</strong>
        </div>
        <div className="stat">
          <span>Trials</span>
          <strong>{results.trials.length}</strong>
        </div>
      </div>
    </section>
  );
}

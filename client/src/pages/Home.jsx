import SearchBox from "../components/SearchBox.jsx";
import Loader from "../components/Loader.jsx";
import ContextPanel from "../sections/ContextPanel.jsx";
import Overview from "../sections/Overview.jsx";
import Research from "../sections/Research.jsx";
import Trials from "../sections/Trials.jsx";
import { useSearch } from "../hooks/useSearch.js";

function HeroMetrics({ results, hasSearched }) {
  const totalFetched = results.metadata
    ? (results.metadata.totalFetched.pubmed || 0) +
      (results.metadata.totalFetched.openalex || 0) +
      (results.metadata.totalFetched.clinicalTrials || 0)
    : 0;

  const metrics = [
    {
      label: "Evidence streams",
      value: "03",
      detail: "PubMed, OpenAlex, ClinicalTrials.gov",
    },
    {
      label: "Fetched records",
      value: hasSearched ? String(totalFetched).padStart(2, "0") : "00",
      detail: "Live retrieval count from the latest search",
    },
    {
      label: "Ranked outputs",
      value: hasSearched
        ? String(results.papers.length + results.clinicalTrials.length).padStart(
            2,
            "0"
          )
        : "00",
      detail: "Shortlisted papers and trials surfaced to the user",
    },
  ];

  return (
    <div className="hero-metrics">
      {metrics.map((metric) => (
        <article className="metric-card" key={metric.label}>
          <span>{metric.label}</span>
          <strong>{metric.value}</strong>
          <p>{metric.detail}</p>
        </article>
      ))}
    </div>
  );
}

export default function Home() {
  const {
    form,
    loading,
    results,
    error,
    hasSearched,
    onChange,
    onSubmit,
  } = useSearch();

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-copy-block">
          <p className="eyebrow">Decision-grade evidence search</p>
          <h2>Premium clinical discovery for teams who need signal, not clutter.</h2>
          <p className="hero-copy">
            Curalink turns a disease, treatment angle, and location into a ranked
            evidence brief with research papers, active trials, and AI-assisted
            synthesis designed for faster clinical exploration.
          </p>
          <div className="hero-highlights">
            <span>AI summarization</span>
            <span>Evidence ranking</span>
            <span>Live trial discovery</span>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Search Workspace</p>
              <h3>Build a focused clinical query</h3>
            </div>
            <span className="panel-status">Ready</span>
          </div>
          <SearchBox
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            loading={loading}
          />
        </div>
      </section>

      <HeroMetrics results={results} hasSearched={hasSearched} />

      {loading ? <Loader /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {hasSearched && !loading ? (
        <div className="results-stack">
          <ContextPanel form={form} results={results} />
          <Overview results={results} />
          <Research items={results.papers} />
          <Trials items={results.clinicalTrials} />
        </div>
      ) : (
        <section className="section welcome-panel">
          <div className="section-heading">
            <div>
              <p className="eyebrow">What You Get</p>
              <h2>An executive-ready evidence workspace</h2>
            </div>
          </div>
          <div className="welcome-grid">
            <article className="welcome-card">
              <strong>Curated overview</strong>
              <p>
                An AI narrative that summarizes the search landscape without hiding
                the underlying sources.
              </p>
            </article>
            <article className="welcome-card">
              <strong>Ranked literature</strong>
              <p>
                Publication cards are organized around relevance, metadata, and
                quick source access.
              </p>
            </article>
            <article className="welcome-card">
              <strong>Trial visibility</strong>
              <p>
                Clinical opportunities stay visible in the same workspace instead
                of being split into a separate tool.
              </p>
            </article>
          </div>
        </section>
      )}
    </main>
  );
}

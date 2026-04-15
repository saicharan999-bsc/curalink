import SearchBox from "../components/SearchBox.jsx";
import Loader from "../components/Loader.jsx";
import ContextPanel from "../sections/ContextPanel.jsx";
import Overview from "../sections/Overview.jsx";
import Research from "../sections/Research.jsx";
import Trials from "../sections/Trials.jsx";
import { useSearch } from "../hooks/useSearch.js";

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
        <div>
          <p className="eyebrow">AI Clinical Decision Assistant</p>
          <h2>Rank live research papers and trials for a real medical question.</h2>
          <p className="hero-copy">
            Enter a disease, optional treatment or topic query, and an optional
            location. The system expands the search, retrieves a deep evidence
            pool, ranks the strongest matches, and generates an AI insight.
          </p>
        </div>
        <SearchBox
          form={form}
          onChange={onChange}
          onSubmit={onSubmit}
          loading={loading}
        />
      </section>

      {loading ? <Loader /> : null}
      {error ? <p className="error-banner">{error}</p> : null}

      {hasSearched && !loading ? (
        <>
          <ContextPanel form={form} results={results} />
          <Overview results={results} />
          <Research items={results.papers} />
          <Trials items={results.clinicalTrials} />
        </>
      ) : null}
    </main>
  );
}

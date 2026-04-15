import SearchBox from "../components/SearchBox.jsx";
import Loader from "../components/Loader.jsx";
import Overview from "../sections/Overview.jsx";
import Research from "../sections/Research.jsx";
import Trials from "../sections/Trials.jsx";
import Doctors from "../sections/Doctors.jsx";
import { useSearch } from "../hooks/useSearch.js";

export default function Home() {
  const { form, loading, results, onChange, onSubmit } = useSearch();

  return (
    <main className="page">
      <section className="hero">
        <div>
          <p className="eyebrow">Frontend separated into client</p>
          <h2>Search research papers and trials in one place.</h2>
          <p className="hero-copy">
            This starter UI connects to the backend search route and keeps the
            structure ready for your next features.
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

      <Overview results={results} />
      <Research items={results.pubmed} />
      <Trials items={results.trials} />
      <Doctors />
    </main>
  );
}

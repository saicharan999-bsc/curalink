export default function Loader() {
  return (
    <section className="loader-panel" aria-live="polite">
      <div className="loader-orbit" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <div>
        <p className="eyebrow">Processing</p>
        <h3>Analyzing live research signals</h3>
        <p className="loader-copy">
          Expanding the query, ranking evidence quality, and preparing a clinical
          summary.
        </p>
      </div>
    </section>
  );
}

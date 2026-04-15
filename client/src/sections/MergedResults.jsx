import Card from "../components/Card.jsx";

export default function MergedResults({ items }) {
  if (!items.length) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Merged Output</p>
          <h2>Context-aware evidence feed</h2>
        </div>
      </div>
      <div className="card-grid">
        {items.map((item, index) => (
          <Card
            key={`${item.type}-${item.id || index}`}
            {...item}
            badge={item.source || (item.type === "trial" ? "ClinicalTrials.gov" : "Publication")}
            meta={item.score ? [`Score: ${item.score}`] : []}
          />
        ))}
      </div>
    </section>
  );
}

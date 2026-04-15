import Card from "../components/Card.jsx";
import { formatTrialItem } from "../utils/format.js";

export default function Trials({ items }) {
  const cards = items.slice(0, 6).map(formatTrialItem);

  if (!cards.length) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Clinical Trials</p>
          <h2>Relevant study opportunities</h2>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((item, index) => (
          <Card
            key={item.title || index}
            {...item}
            badge={item.source || "ClinicalTrials.gov"}
          />
        ))}
      </div>
    </section>
  );
}

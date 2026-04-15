import Card from "../components/Card.jsx";
import { formatPublicationItem } from "../utils/format.js";

export default function Research({ items }) {
  const cards = items.slice(0, 6).map(formatPublicationItem);

  if (!cards.length) {
    return null;
  }

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Publications</p>
          <h2>Relevant research papers</h2>
        </div>
      </div>
      <div className="card-grid">
        {cards.map((item, index) => (
          <Card
            key={item.title || index}
            {...item}
            badge={item.source || "Publication"}
          />
        ))}
      </div>
    </section>
  );
}

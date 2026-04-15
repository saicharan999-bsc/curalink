import Card from "../components/Card.jsx";
import { formatTrialItem } from "../utils/format.js";

export default function Trials({ items }) {
  const cards = items.slice(0, 5).map(formatTrialItem);

  return (
    <section className="section">
      <h2>Trials</h2>
      <div className="card-grid">
        {cards.length ? (
          cards.map((item, index) => <Card key={item.title || index} {...item} />)
        ) : (
          <p className="empty-state">No trial results yet.</p>
        )}
      </div>
    </section>
  );
}

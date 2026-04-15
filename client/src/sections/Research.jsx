import Card from "../components/Card.jsx";
import { formatPubMedItem } from "../utils/format.js";

export default function Research({ items }) {
  const cards = items.slice(0, 5).map(formatPubMedItem);

  return (
    <section className="section">
      <h2>Research</h2>
      <div className="card-grid">
        {cards.length ? (
          cards.map((item, index) => <Card key={item.title || index} {...item} />)
        ) : (
          <p className="empty-state">
            Search to view PubMed results. OpenAlex support is ready in the data
            layer.
          </p>
        )}
      </div>
    </section>
  );
}

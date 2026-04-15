export default function ContextPanel({ form, results }) {
  const context = results.context || form;
  const rows = [
    ["Disease", context.disease || "Not provided"],
    ["Query", context.query || "Not provided"],
    ["Location", context.location || "Not provided"],
  ];

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Patient Context</p>
          <h2>Input profile</h2>
        </div>
      </div>
      <div className="context-grid">
        {rows.map(([label, value]) => (
          <article className="context-card" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}

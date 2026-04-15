export default function DemoCases({ cases, onSelect }) {
  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Quick Demos</p>
          <h2>Switch across disease areas</h2>
        </div>
      </div>
      <div className="tag-row">
        {cases.map((demoCase) => (
          <button
            className="chip-button"
            key={demoCase.label}
            type="button"
            onClick={() => onSelect(demoCase)}
          >
            {demoCase.label}
          </button>
        ))}
      </div>
    </section>
  );
}

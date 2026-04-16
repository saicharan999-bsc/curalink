const fields = [
  {
    name: "disease",
    label: "Disease area",
    placeholder: "Example: metastatic breast cancer",
    required: true,
  },
  {
    name: "query",
    label: "Therapy or topic",
    placeholder: "Example: HER2 targeted therapy",
  },
  {
    name: "location",
    label: "Location",
    placeholder: "Example: Boston, United States",
  },
];

export default function SearchBox({ form, onChange, onSubmit, loading }) {
  return (
    <form className="search-box" onSubmit={onSubmit}>
      <div className="search-grid">
        {fields.map((field) => (
          <label className="field" key={field.name}>
            <span>{field.label}</span>
            <input
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              placeholder={field.placeholder}
              required={field.required}
            />
          </label>
        ))}
      </div>
      <div className="search-actions">
        <p className="search-caption">
          Searches publications and clinical trials, then ranks the most relevant
          evidence with AI-generated context.
        </p>
        <button className="primary-button" type="submit" disabled={loading}>
          {loading ? "Synthesizing evidence..." : "Run evidence search"}
        </button>
      </div>
    </form>
  );
}

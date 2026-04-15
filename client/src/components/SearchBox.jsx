export default function SearchBox({ form, onChange, onSubmit, loading }) {
  return (
    <form className="search-box" onSubmit={onSubmit}>
      <input
        name="disease"
        value={form.disease}
        onChange={onChange}
        placeholder="Disease"
        required
      />
      <input
        name="query"
        value={form.query}
        onChange={onChange}
        placeholder="Query (optional)"
      />
      <input
        name="location"
        value={form.location}
        onChange={onChange}
        placeholder="Location (optional)"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching live evidence..." : "Search"}
      </button>
    </form>
  );
}

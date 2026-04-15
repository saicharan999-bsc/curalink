export default function SearchBox({ form, onChange, onSubmit, loading }) {
  return (
    <form className="search-box" onSubmit={onSubmit}>
      <input
        name="query"
        value={form.query}
        onChange={onChange}
        placeholder="Search topic"
      />
      <input
        name="disease"
        value={form.disease}
        onChange={onChange}
        placeholder="Disease"
      />
      <button type="submit" disabled={loading}>
        {loading ? "Searching..." : "Search"}
      </button>
    </form>
  );
}

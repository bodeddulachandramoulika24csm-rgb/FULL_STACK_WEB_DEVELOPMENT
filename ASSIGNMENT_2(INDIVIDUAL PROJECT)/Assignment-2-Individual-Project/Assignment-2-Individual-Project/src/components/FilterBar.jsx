export default function FilterBar({ filters, onChange, genres, resultCount }) {
  const update = (patch) => onChange({ ...filters, ...patch });

  return (
    <section className="filter-bar" aria-label="Search and filter books">
      <div className="field grow">
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="Title or author"
          value={filters.query}
          onChange={(e) => update({ query: e.target.value })}
        />
      </div>

      <div className="field">
        <label htmlFor="genre">Genre</label>
        <select id="genre" value={filters.genre} onChange={(e) => update({ genre: e.target.value })}>
          <option value="All">All genres</option>
          {genres.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="sort">Sort by</label>
        <select id="sort" value={filters.sort} onChange={(e) => update({ sort: e.target.value })}>
          <option value="title">Title (A to Z)</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
          <option value="rating">Highest rated</option>
          <option value="newest">Newest first</option>
        </select>
      </div>

      <label className="check" htmlFor="available">
        <input
          id="available"
          type="checkbox"
          checked={filters.onlyAvailable}
          onChange={(e) => update({ onlyAvailable: e.target.checked })}
        />
        Available now
      </label>

      <p className="result-count" aria-live="polite">
        {resultCount} {resultCount === 1 ? "book" : "books"} found
      </p>
    </section>
  );
}

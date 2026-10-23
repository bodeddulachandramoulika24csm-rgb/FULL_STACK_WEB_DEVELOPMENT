const LINKS = [
  { id: "catalog", label: "Catalog" },
  { id: "cart", label: "Cart" },
  { id: "library", label: "My library" },
  { id: "add", label: "Add a book" },
];

export default function Navbar({ view, onNavigate, cartCount, loanCount }) {
  const badge = (id) => {
    if (id === "cart" && cartCount > 0) return <span className="badge">{cartCount}</span>;
    if (id === "library" && loanCount > 0) return <span className="badge">{loanCount}</span>;
    return null;
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <button className="brand" onClick={() => onNavigate("catalog")}>
          Lantern Lane Books
        </button>
        <nav aria-label="Main navigation">
          <ul className="nav-list">
            {LINKS.map((link) => (
              <li key={link.id}>
                <button
                  className={`nav-link ${view === link.id ? "active" : ""}`}
                  aria-current={view === link.id ? "page" : undefined}
                  onClick={() => onNavigate(link.id)}
                >
                  {link.label}
                  {badge(link.id)}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}

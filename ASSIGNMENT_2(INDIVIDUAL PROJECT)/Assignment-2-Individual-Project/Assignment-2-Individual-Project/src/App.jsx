import { useEffect, useMemo, useState } from "react";
import seedBooks from "./data/books.json";
import useLocalStorage from "./hooks/useLocalStorage.js";
import { addDaysISO, todayISO } from "./utils/format.js";
import Navbar from "./components/Navbar.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookCard from "./components/BookCard.jsx";
import BookDetails from "./components/BookDetails.jsx";
import Cart from "./components/Cart.jsx";
import MyLibrary from "./components/MyLibrary.jsx";
import AddBookForm from "./components/AddBookForm.jsx";
import Toast from "./components/Toast.jsx";
import Footer from "./components/Footer.jsx";

const LOAN_DAYS = 14;
const LOAN_LIMIT = 3;
const DEFAULT_FILTERS = { query: "", genre: "All", sort: "title", onlyAvailable: false };

export default function App() {
  const [view, setView] = useState("catalog");
  const [books, setBooks] = useLocalStorage("lll.books", seedBooks);
  const [cart, setCart] = useLocalStorage("lll.cart", []); // [{ id, qty }]
  const [loans, setLoans] = useLocalStorage("lll.loans", []); // [{ loanId, bookId, borrowedOn, dueOn }]
  const [orders, setOrders] = useLocalStorage("lll.orders", []);
  const [favIds, setFavIds] = useLocalStorage("lll.favs", []);

  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selected, setSelected] = useState(null);
  const [lastOrder, setLastOrder] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast({ message, id: Date.now() });

  const navigate = (next) => {
    setLastOrder(null);
    setSelected(null);
    setView(next);
    window.scrollTo(0, 0);
  };

  const genres = useMemo(() => [...new Set(books.map((b) => b.genre))].sort(), [books]);

  const visibleBooks = useMemo(() => {
    const q = filters.query.trim().toLowerCase();
    const list = books.filter((b) => {
      const matchesText = !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q);
      const matchesGenre = filters.genre === "All" || b.genre === filters.genre;
      const matchesStock = !filters.onlyAvailable || b.stock > 0 || b.copies > 0;
      return matchesText && matchesGenre && matchesStock;
    });
    const sorters = {
      title: (a, b) => a.title.localeCompare(b.title),
      "price-asc": (a, b) => a.price - b.price,
      "price-desc": (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.year - a.year,
    };
    return [...list].sort(sorters[filters.sort]);
  }, [books, filters]);

  // ---------- cart ----------
  const addToCart = (id) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    const line = cart.find((l) => l.id === id);
    const qty = line ? line.qty : 0;
    if (qty + 1 > book.stock) {
      notify(qty ? `Your cart already has all ${book.stock} available copies.` : `${book.title} is out of stock.`);
      return;
    }
    setCart(line ? cart.map((l) => (l.id === id ? { ...l, qty: qty + 1 } : l)) : [...cart, { id, qty: 1 }]);
    notify(`Added ${book.title} to your cart.`);
  };

  const changeQty = (id, qty) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    const safe = Math.max(1, Math.min(qty, book.stock));
    setCart(cart.map((l) => (l.id === id ? { ...l, qty: safe } : l)));
  };

  const removeFromCart = (id) => setCart(cart.filter((l) => l.id !== id));

  const cartItems = cart
    .map((l) => ({ book: books.find((b) => b.id === l.id), qty: l.qty }))
    .filter((x) => x.book);

  const placeOrder = (details, totals) => {
    const short = cartItems.find((x) => x.qty > x.book.stock);
    if (short) {
      notify(`Only ${short.book.stock} copies of ${short.book.title} are left. Please update your cart.`);
      return;
    }
    const order = {
      id: `ORD-${String(Date.now()).slice(-6)}`,
      date: todayISO(),
      customer: details,
      items: cartItems.map(({ book, qty }) => ({ id: book.id, title: book.title, qty, price: book.price })),
      ...totals,
    };
    setBooks(
      books.map((b) => {
        const line = cartItems.find((x) => x.book.id === b.id);
        return line ? { ...b, stock: b.stock - line.qty } : b;
      })
    );
    setOrders([order, ...orders]);
    setCart([]);
    setLastOrder(order);
    window.scrollTo(0, 0);
  };

  // ---------- library loans ----------
  const borrowBook = (id) => {
    const book = books.find((b) => b.id === id);
    if (!book) return;
    if (loans.some((l) => l.bookId === id)) return notify(`You have already borrowed ${book.title}.`);
    if (loans.length >= LOAN_LIMIT) return notify(`You can borrow up to ${LOAN_LIMIT} books at a time. Return one first.`);
    if (book.copies < 1) return notify(`All library copies of ${book.title} are on loan.`);

    setBooks(books.map((b) => (b.id === id ? { ...b, copies: b.copies - 1 } : b)));
    setLoans([
      ...loans,
      { loanId: `L${Date.now()}`, bookId: id, borrowedOn: todayISO(), dueOn: addDaysISO(LOAN_DAYS) },
    ]);
    notify(`Borrowed ${book.title}. Due in ${LOAN_DAYS} days.`);
  };

  const returnBook = (loanId) => {
    const loan = loans.find((l) => l.loanId === loanId);
    if (!loan) return;
    const book = books.find((b) => b.id === loan.bookId);
    setBooks(books.map((b) => (b.id === loan.bookId ? { ...b, copies: b.copies + 1 } : b)));
    setLoans(loans.filter((l) => l.loanId !== loanId));
    notify(`Returned ${book ? book.title : "the book"}. Thank you.`);
  };

  const loanItems = loans
    .map((loan) => ({ loan, book: books.find((b) => b.id === loan.bookId) }))
    .filter((x) => x.book);

  // ---------- favourites ----------
  const toggleFav = (id) =>
    setFavIds(favIds.includes(id) ? favIds.filter((f) => f !== id) : [...favIds, id]);
  const favourites = favIds.map((id) => books.find((b) => b.id === id)).filter(Boolean);

  // ---------- add book / reset ----------
  const addBook = (data) => {
    const id = books.reduce((max, b) => Math.max(max, b.id), 0) + 1;
    setBooks([...books, { id, ...data }]);
    notify(`${data.title} was added to the catalog.`);
    navigate("catalog");
  };

  const resetDemo = () => {
    if (!window.confirm("Reset the catalog, cart, loans, orders and favourites to the sample data?")) return;
    setBooks(seedBooks);
    setCart([]);
    setLoans([]);
    setOrders([]);
    setFavIds([]);
    setFilters(DEFAULT_FILTERS);
    navigate("catalog");
    notify("Demo data reset.");
  };

  const cartCount = cart.reduce((sum, l) => sum + l.qty, 0);
  const copiesAvailable = books.reduce((sum, b) => sum + b.copies, 0);
  const selectedBook = selected ? books.find((b) => b.id === selected.id) : null;

  return (
    <>
      <Navbar view={view} onNavigate={navigate} cartCount={cartCount} loanCount={loans.length} />

      <main className="container">
        {view === "catalog" && (
          <>
            <div className="intro">
              <h1>Buy it or borrow it</h1>
              <p className="muted">
                {books.length} titles, {copiesAvailable} library copies on the shelf right now. Borrow for 14 days or
                add to your cart.
              </p>
            </div>
            <FilterBar filters={filters} onChange={setFilters} genres={genres} resultCount={visibleBooks.length} />
            {visibleBooks.length === 0 ? (
              <section className="panel empty">
                <h2>No books match your search</h2>
                <p className="muted">Try a different title, author or genre.</p>
                <button className="btn btn-outline" onClick={() => setFilters(DEFAULT_FILTERS)}>
                  Clear filters
                </button>
              </section>
            ) : (
              <div className="grid">
                {visibleBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    isFav={favIds.includes(book.id)}
                    onFav={toggleFav}
                    onOpen={setSelected}
                    onAdd={addToCart}
                    onBorrow={borrowBook}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {view === "cart" && (
          <Cart
            items={cartItems}
            lastOrder={lastOrder}
            onQty={changeQty}
            onRemove={removeFromCart}
            onPlaceOrder={placeOrder}
            onBrowse={() => navigate("catalog")}
          />
        )}

        {view === "library" && (
          <MyLibrary
            loans={loanItems}
            favourites={favourites}
            orders={orders}
            loanLimit={LOAN_LIMIT}
            onReturn={returnBook}
            onFav={toggleFav}
            onAdd={addToCart}
            onOpen={setSelected}
          />
        )}

        {view === "add" && <AddBookForm genres={genres} onAdd={addBook} />}
      </main>

      {selectedBook && (
        <BookDetails
          book={selectedBook}
          isFav={favIds.includes(selectedBook.id)}
          onClose={() => setSelected(null)}
          onFav={toggleFav}
          onAdd={addToCart}
          onBorrow={borrowBook}
        />
      )}

      <Toast message={toast?.message} key={toast?.id} />
      <Footer onReset={resetDemo} />
    </>
  );
}

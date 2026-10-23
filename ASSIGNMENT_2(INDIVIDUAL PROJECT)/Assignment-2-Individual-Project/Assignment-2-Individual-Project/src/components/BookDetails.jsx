import { useEffect, useRef } from "react";
import BookCover from "./BookCover.jsx";
import { formatPrice } from "../utils/format.js";

export default function BookDetails({ book, isFav, onClose, onFav, onAdd, onBorrow }) {
  const closeRef = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="overlay" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="details-title"
        onClick={(e) => e.stopPropagation()}
      >
        <button ref={closeRef} className="modal-close" onClick={onClose} aria-label="Close details">
          {"\u00D7"}
        </button>

        <BookCover book={book} size="lg" />

        <div className="modal-body">
          <span className="genre-tag">{book.genre}</span>
          <h2 id="details-title">{book.title}</h2>
          <p className="muted">by {book.author}</p>
          <p className="description">{book.description}</p>

          <dl className="facts">
            <div><dt>Published</dt><dd>{book.year}</dd></div>
            <div><dt>Pages</dt><dd>{book.pages}</dd></div>
            <div><dt>Rating</dt><dd>{"\u2605"} {book.rating.toFixed(1)}</dd></div>
            <div><dt>In stock</dt><dd>{book.stock}</dd></div>
            <div><dt>Library copies</dt><dd>{book.copies}</dd></div>
          </dl>

          <p className="price price-lg">{formatPrice(book.price)}</p>

          <div className="card-actions">
            <button className="btn btn-primary" disabled={book.stock < 1} onClick={() => onAdd(book.id)}>
              {book.stock < 1 ? "Sold out" : "Add to cart"}
            </button>
            <button className="btn btn-outline" disabled={book.copies < 1} onClick={() => onBorrow(book.id)}>
              {book.copies < 1 ? "All copies on loan" : "Borrow for 14 days"}
            </button>
            <button className="btn btn-ghost" onClick={() => onFav(book.id)} aria-pressed={isFav}>
              {isFav ? "\u2665 Saved" : "\u2661 Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

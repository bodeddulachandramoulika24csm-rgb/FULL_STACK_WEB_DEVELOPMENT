import BookCover from "./BookCover.jsx";
import { formatPrice } from "../utils/format.js";

export default function BookCard({ book, isFav, onFav, onOpen, onAdd, onBorrow }) {
  const soldOut = book.stock < 1;
  const noCopies = book.copies < 1;

  return (
    <article className="card">
      <button
        className="cover-btn"
        onClick={() => onOpen(book)}
        aria-label={`View details for ${book.title}`}
      >
        <BookCover book={book} />
      </button>

      <button
        className={`fav ${isFav ? "on" : ""}`}
        onClick={() => onFav(book.id)}
        aria-pressed={isFav}
        aria-label={isFav ? `Remove ${book.title} from favourites` : `Add ${book.title} to favourites`}
      >
        {isFav ? "\u2665" : "\u2661"}
      </button>

      <div className="card-body">
        <span className="genre-tag">{book.genre}</span>
        <h3 className="card-title">{book.title}</h3>
        <p className="muted">{book.author}</p>
        <p className="rating" aria-label={`Rated ${book.rating} out of 5`}>
          {"\u2605"} {book.rating.toFixed(1)}
        </p>
        <p className="price">{formatPrice(book.price)}</p>
        <p className="stock-line">
          <span className={soldOut ? "out" : ""}>{soldOut ? "Sold out" : `${book.stock} in stock`}</span>
          <span className={noCopies ? "out" : ""}>
            {noCopies ? "No library copies" : `${book.copies} to borrow`}
          </span>
        </p>
        <div className="card-actions">
          <button className="btn btn-primary" disabled={soldOut} onClick={() => onAdd(book.id)}>
            Add to cart
          </button>
          <button className="btn btn-outline" disabled={noCopies} onClick={() => onBorrow(book.id)}>
            Borrow
          </button>
        </div>
      </div>
    </article>
  );
}

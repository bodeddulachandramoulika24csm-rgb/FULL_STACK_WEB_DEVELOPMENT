import BookCover from "./BookCover.jsx";
import { formatPrice, formatDate, todayISO, daysBetween } from "../utils/format.js";

export default function MyLibrary({ loans, favourites, orders, loanLimit, onReturn, onFav, onAdd, onOpen }) {
  const today = todayISO();

  return (
    <div className="stack">
      <section className="panel">
        <h2>Borrowed books</h2>
        <p className="muted small">
          You have {loans.length} of {loanLimit} loans in use. Each loan lasts 14 days.
        </p>
        {loans.length === 0 ? (
          <p className="empty-note">You have not borrowed anything yet. Choose Borrow on any book in the catalog.</p>
        ) : (
          <ul className="cart-list">
            {loans.map(({ loan, book }) => {
              const left = daysBetween(today, loan.dueOn);
              const status =
                left < 0 ? `Overdue by ${Math.abs(left)} ${Math.abs(left) === 1 ? "day" : "days"}` :
                left === 0 ? "Due today" : `${left} ${left === 1 ? "day" : "days"} left`;
              return (
                <li key={loan.loanId} className="cart-item">
                  <BookCover book={book} size="sm" />
                  <div className="cart-info">
                    <h3>{book.title}</h3>
                    <p className="muted">{book.author}</p>
                    <p className="small">Borrowed {formatDate(loan.borrowedOn)}, due {formatDate(loan.dueOn)}</p>
                  </div>
                  <p className={`status ${left < 0 ? "late" : left <= 2 ? "soon" : ""}`}>{status}</p>
                  <button className="btn btn-outline" onClick={() => onReturn(loan.loanId)}>
                    Return book
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Favourites</h2>
        {favourites.length === 0 ? (
          <p className="empty-note">Tap the heart on a book to save it here.</p>
        ) : (
          <ul className="cart-list">
            {favourites.map((book) => (
              <li key={book.id} className="cart-item">
                <BookCover book={book} size="sm" />
                <div className="cart-info">
                  <h3>{book.title}</h3>
                  <p className="muted">{book.author}</p>
                  <p className="price">{formatPrice(book.price)}</p>
                </div>
                <button className="btn btn-ghost" onClick={() => onOpen(book)}>Details</button>
                <button className="btn btn-primary" disabled={book.stock < 1} onClick={() => onAdd(book.id)}>
                  Add to cart
                </button>
                <button className="btn btn-ghost" onClick={() => onFav(book.id)}>Remove</button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="panel">
        <h2>Order history</h2>
        {orders.length === 0 ? (
          <p className="empty-note">Your orders will appear here after checkout.</p>
        ) : (
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order">
                <div className="order-head">
                  <strong>{order.id}</strong>
                  <span className="muted">{formatDate(order.date)}</span>
                  <strong>{formatPrice(order.total)}</strong>
                </div>
                <p className="small">{order.items.map((it) => `${it.qty} x ${it.title}`).join(", ")}</p>
                <p className="muted small">Delivered to {order.customer.city} ({order.customer.payment})</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

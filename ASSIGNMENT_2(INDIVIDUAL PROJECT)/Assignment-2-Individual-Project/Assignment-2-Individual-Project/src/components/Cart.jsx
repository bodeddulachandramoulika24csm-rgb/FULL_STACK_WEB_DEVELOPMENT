import BookCover from "./BookCover.jsx";
import CheckoutForm from "./CheckoutForm.jsx";
import { formatPrice, formatDate } from "../utils/format.js";

const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 40;

export default function Cart({ items, lastOrder, onQty, onRemove, onPlaceOrder, onBrowse }) {
  if (lastOrder) {
    return (
      <section className="panel confirm" aria-live="polite">
        <h2>Order placed</h2>
        <p>
          Thank you, {lastOrder.customer.name}. Your order <strong>{lastOrder.id}</strong> will be delivered to{" "}
          {lastOrder.customer.city} in 3 to 5 days.
        </p>
        <ul className="plain-list">
          {lastOrder.items.map((it) => (
            <li key={it.id}>
              {it.qty} x {it.title} <span className="muted">({formatPrice(it.price * it.qty)})</span>
            </li>
          ))}
        </ul>
        <p className="price">Total paid: {formatPrice(lastOrder.total)}</p>
        <p className="muted small">Ordered on {formatDate(lastOrder.date)}. You can find it under My library.</p>
        <button className="btn btn-primary" onClick={onBrowse}>
          Continue browsing
        </button>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="panel empty">
        <h2>Your cart is empty</h2>
        <p className="muted">Add a book from the catalog and it will show up here.</p>
        <button className="btn btn-primary" onClick={onBrowse}>
          Browse the catalog
        </button>
      </section>
    );
  }

  const subtotal = items.reduce((sum, it) => sum + it.book.price * it.qty, 0);
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

  return (
    <div className="cart-layout">
      <section className="panel">
        <h2>Your cart</h2>
        <ul className="cart-list">
          {items.map(({ book, qty }) => (
            <li key={book.id} className="cart-item">
              <BookCover book={book} size="sm" />
              <div className="cart-info">
                <h3>{book.title}</h3>
                <p className="muted">{book.author}</p>
                <p className="price">{formatPrice(book.price)}</p>
              </div>
              <div className="qty" role="group" aria-label={`Quantity for ${book.title}`}>
                <button className="btn-icon" onClick={() => onQty(book.id, qty - 1)} disabled={qty <= 1} aria-label="Decrease quantity">
                  {"\u2212"}
                </button>
                <span aria-live="polite">{qty}</span>
                <button className="btn-icon" onClick={() => onQty(book.id, qty + 1)} disabled={qty >= book.stock} aria-label="Increase quantity">
                  +
                </button>
              </div>
              <p className="line-total">{formatPrice(book.price * qty)}</p>
              <button className="btn btn-ghost" onClick={() => onRemove(book.id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>

        <dl className="totals">
          <div><dt>Subtotal</dt><dd>{formatPrice(subtotal)}</dd></div>
          <div><dt>Delivery</dt><dd>{delivery === 0 ? "Free" : formatPrice(delivery)}</dd></div>
          <div className="grand"><dt>Total</dt><dd>{formatPrice(total)}</dd></div>
        </dl>
        {delivery > 0 && (
          <p className="muted small">Orders of {formatPrice(FREE_DELIVERY_ABOVE)} or more get free delivery.</p>
        )}
      </section>

      <section className="panel">
        <CheckoutForm onSubmit={(details) => onPlaceOrder(details, { subtotal, delivery, total })} />
      </section>
    </div>
  );
}

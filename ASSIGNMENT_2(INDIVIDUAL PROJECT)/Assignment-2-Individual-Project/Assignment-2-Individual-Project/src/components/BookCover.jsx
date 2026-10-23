// Draws a book cover using the two colours stored in books.json (no image files needed).
export default function BookCover({ book, size = "md" }) {
  const [from, to] = book.cover || ["#374151", "#111827"];
  return (
    <div
      className={`cover cover-${size}`}
      style={{ background: `linear-gradient(150deg, ${from}, ${to})` }}
      aria-hidden="true"
    >
      <span className="cover-title">{book.title}</span>
      <span className="cover-author">{book.author}</span>
    </div>
  );
}

import { useState } from "react";

const COVER_PALETTE = [
  ["#6A2C5B", "#2E1030"], ["#0F5C63", "#052B2F"], ["#27496D", "#0C1B2B"], ["#1F6B4A", "#0B2F20"],
  ["#8C1C13", "#2B0A07"], ["#3D4E81", "#151C36"], ["#B26A00", "#4A2A00"], ["#374151", "#111827"],
];

const EMPTY = { title: "", author: "", genre: "", price: "", pages: "", year: "", stock: "", copies: "", rating: "", description: "" };

function validate(v) {
  const e = {};
  const thisYear = new Date().getFullYear();
  if (!v.title.trim()) e.title = "Enter the book title.";
  if (!v.author.trim()) e.author = "Enter the author name.";
  if (!v.genre.trim()) e.genre = "Choose or type a genre.";
  if (!(Number(v.price) > 0)) e.price = "Enter a price greater than 0.";
  if (!(Number.isInteger(Number(v.pages)) && Number(v.pages) > 0)) e.pages = "Enter the number of pages as a whole number.";
  if (!(Number.isInteger(Number(v.year)) && Number(v.year) >= 1000 && Number(v.year) <= thisYear)) e.year = `Enter a year between 1000 and ${thisYear}.`;
  if (!(Number.isInteger(Number(v.stock)) && Number(v.stock) >= 0 && v.stock !== "")) e.stock = "Enter the stock as 0 or more.";
  if (!(Number.isInteger(Number(v.copies)) && Number(v.copies) >= 0 && v.copies !== "")) e.copies = "Enter library copies as 0 or more.";
  if (v.rating !== "" && !(Number(v.rating) >= 0 && Number(v.rating) <= 5)) e.rating = "Rating must be between 0 and 5.";
  if (v.description.trim().length < 20) e.description = "Write a short description (at least 20 characters).";
  return e;
}

export default function AddBookForm({ genres, onAdd }) {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});

  const set = (field) => (e) => {
    setValues({ ...values, [field]: e.target.value });
    if (errors[field]) setErrors({ ...errors, [field]: undefined });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onAdd({
      title: values.title.trim(),
      author: values.author.trim(),
      genre: values.genre.trim(),
      price: Number(values.price),
      pages: Number(values.pages),
      year: Number(values.year),
      stock: Number(values.stock),
      copies: Number(values.copies),
      rating: values.rating === "" ? 4 : Number(values.rating),
      description: values.description.trim(),
      cover: COVER_PALETTE[Math.floor(Math.random() * COVER_PALETTE.length)],
    });
    setValues(EMPTY);
  };

  const field = (id, label, props = {}) => (
    <div className="field">
      <label htmlFor={`add-${id}`}>{label}</label>
      <input
        id={`add-${id}`}
        value={values[id]}
        onChange={set(id)}
        aria-invalid={errors[id] ? "true" : "false"}
        aria-describedby={errors[id] ? `add-${id}-error` : undefined}
        {...props}
      />
      {errors[id] && <p className="error" id={`add-${id}-error`}>{errors[id]}</p>}
    </div>
  );

  return (
    <section className="panel narrow">
      <h2>Add a book</h2>
      <p className="muted">New books are added to the catalog and saved in this browser.</p>
      <form className="form" onSubmit={handleSubmit} noValidate>
        <div className="row">
          {field("title", "Title")}
          {field("author", "Author")}
        </div>
        <div className="row">
          {field("genre", "Genre", { list: "genre-options", placeholder: "Pick one or type a new genre" })}
          {field("rating", "Rating (0 to 5, optional)", { type: "number", step: "0.1", min: "0", max: "5" })}
        </div>
        <datalist id="genre-options">
          {genres.map((g) => <option key={g} value={g} />)}
        </datalist>
        <div className="row">
          {field("price", "Price in rupees", { type: "number", min: "1" })}
          {field("pages", "Pages", { type: "number", min: "1" })}
          {field("year", "Year published", { type: "number" })}
        </div>
        <div className="row">
          {field("stock", "Copies for sale", { type: "number", min: "0" })}
          {field("copies", "Library copies to lend", { type: "number", min: "0" })}
        </div>
        <div className="field">
          <label htmlFor="add-description">Description</label>
          <textarea
            id="add-description"
            rows="4"
            value={values.description}
            onChange={set("description")}
            aria-invalid={errors.description ? "true" : "false"}
          />
          {errors.description && <p className="error">{errors.description}</p>}
        </div>
        <button className="btn btn-primary" type="submit">Add book to catalog</button>
      </form>
    </section>
  );
}

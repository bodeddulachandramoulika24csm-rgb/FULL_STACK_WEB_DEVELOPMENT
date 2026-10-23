# Lantern Lane Books: Online Bookstore and Library

**Assignment-2: Individual Project**

Lantern Lane Books is a single-page web app where a reader can buy books or borrow them from a lending library. It is built with HTML, CSS, JavaScript and React.js, and uses a sample JSON file as its book database.

## Objective

To design and build a complete, responsive web application that demonstrates:

- React components, props, state and hooks
- Reading and displaying data from a JSON database
- Forms with validation
- Navigation between multiple views
- Saving data in the browser with `localStorage`
- Version control with Git and GitHub

## Technologies Used

| Technology | Purpose |
| --- | --- |
| HTML5 | Page shell (`src/index.html`) |
| CSS3 | Styling, responsive layout (`src/style.css`) |
| JavaScript (ES6+) | Application logic |
| React.js 18 | Component-based user interface |
| Vite 5 | Development server and build tool |
| JSON | Sample book database (`src/data/books.json`) |
| localStorage | Keeps cart, loans, orders and favourites after a refresh |

## Features

- **Catalog** of 16 sample books loaded from JSON, shown as cards with generated covers
- **Search** by title or author, **filter** by genre, **sort** by title, price, rating or year, and an "Available now" toggle
- **Book details** pop-up with description, pages, year, rating and stock
- **Shopping cart** with quantity controls, remove button, subtotal, delivery fee and total (stock limits are enforced)
- **Checkout form** with validation (name, email, 10-digit mobile, address, city, 6-digit PIN code, payment method) and an order confirmation
- **Library lending**: borrow a book for 14 days, up to 3 at a time, with due dates, "days left" and overdue status, and a Return button
- **Favourites** list with a heart button
- **Order history** saved in the browser
- **Add a book** form (with validation) that adds new titles to the catalog
- **Reset demo data** button in the footer
- Responsive layout for phones, tablets and desktops, keyboard-friendly focus styles, and toast messages for feedback

## Project Folder Structure

```
Assignment-2-Individual-Project/
|
|-- README.md
|-- package.json
|-- vite.config.js
|-- .gitignore
|-- screenshots/
|   `-- (store project output screenshots here)
|
`-- src/
    |-- index.html
    |-- style.css
    |-- App.jsx
    |-- main.jsx
    |-- data/
    |   `-- books.json
    |-- hooks/
    |   `-- useLocalStorage.js
    |-- utils/
    |   `-- format.js
    `-- components/
        |-- Navbar.jsx
        |-- FilterBar.jsx
        |-- BookCard.jsx
        |-- BookCover.jsx
        |-- BookDetails.jsx
        |-- Cart.jsx
        |-- CheckoutForm.jsx
        |-- MyLibrary.jsx
        |-- AddBookForm.jsx
        |-- Toast.jsx
        `-- Footer.jsx
```

`vite.config.js` sets `root: "src"` so that `index.html` can stay inside `src/` as the assignment structure requires.

## Installation Instructions

1. Install **Node.js** (version 18 or newer, LTS recommended) from <https://nodejs.org>.
2. Install **Visual Studio Code** from <https://code.visualstudio.com>.
3. Check the install by opening a terminal and running:
   ```bash
   node -v
   npm -v
   ```

## Steps to Run the Project Locally

```bash
# 1. Open the project folder in VS Code (File > Open Folder)
# 2. Open the terminal in VS Code (Terminal > New Terminal)
# 3. Install the dependencies (only needed once)
npm install

# 4. Start the development server
npm run dev
```

The browser opens automatically. If it does not, open the address shown in the terminal (usually <http://localhost:5173>). Press `Ctrl + C` in the terminal to stop the server.

To create a production build: `npm run build` (output goes to the `dist/` folder). To preview it: `npm run preview`.

## Uploading the Project to GitHub

### Option A: GitHub Desktop (easiest)

1. Install and sign in to **GitHub Desktop** (<https://desktop.github.com>).
2. Choose **File > Add local repository**, pick the `Assignment-2-Individual-Project` folder, and click **create a repository** if asked.
3. Write a summary such as `Initial commit: Lantern Lane Books` and click **Commit to main**.
4. Click **Publish repository**, keep the name `Assignment-2-Individual-Project`, choose Public or Private, and click **Publish**.

### Option B: VS Code and Git

1. Create an empty repository named `Assignment-2-Individual-Project` on <https://github.com/new> (do not add a README there).
2. In the VS Code terminal, from the project folder, run:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Lantern Lane Books"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/Assignment-2-Individual-Project.git
   git push -u origin main
   ```
3. Refresh the repository page on GitHub to confirm the files are there.

`node_modules/` and `dist/` are ignored by `.gitignore`, so they will not be uploaded.

## Screenshots

Add your own screenshots to the `screenshots/` folder after running the project, then link them below. Suggested files:

| File name | What to capture |
| --- | --- |
| `01-catalog.png` | Catalog page with the book grid |
| `02-search-filter.png` | A search or genre filter applied |
| `03-book-details.png` | The book details pop-up |
| `04-cart.png` | Cart with items and the checkout form |
| `05-checkout-validation.png` | Checkout form showing validation errors |
| `06-order-confirmation.png` | Order placed confirmation |
| `07-my-library.png` | Borrowed books, favourites and order history |
| `08-add-book.png` | The Add a book form |
| `09-mobile-view.png` | Catalog in a narrow (phone-sized) window |

Once the images are saved, replace this note with:

```markdown
![Catalog](screenshots/01-catalog.png)
![Cart and checkout](screenshots/04-cart.png)
```

## Notes

- The book data and prices are sample data created for this assignment.
- No real payments are processed.
- Data is stored only in your own browser. Use **Reset demo data** in the footer to start fresh.

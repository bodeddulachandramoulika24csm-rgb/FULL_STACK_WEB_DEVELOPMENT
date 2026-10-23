export default function Footer({ onReset }) {
  return (
    <footer className="footer">
      <p>Lantern Lane Books. Assignment-2 Individual Project built with React.js and a sample JSON database.</p>
      <button className="btn btn-ghost" onClick={onReset}>
        Reset demo data
      </button>
    </footer>
  );
}

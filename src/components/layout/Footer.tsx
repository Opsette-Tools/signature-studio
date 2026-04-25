import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="app-footer">
      <nav className="app-footer__links" aria-label="Footer">
        <Link to="/about">About</Link>
        <Link to="/privacy">Privacy</Link>
        <span>
          By{" "}
          <a href="https://opsette.io" target="_blank" rel="noopener noreferrer">
            Opsette
          </a>
        </span>
      </nav>
    </footer>
  );
}

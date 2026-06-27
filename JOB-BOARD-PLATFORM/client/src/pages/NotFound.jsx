import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="container page-pad">
      <div className="empty-state">
        <h1>Page not found</h1>
        <p>The page you are looking for is not available.</p>
        <Link className="button" to="/">
          Go home
        </Link>
      </div>
    </div>
  );
}


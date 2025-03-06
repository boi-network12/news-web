import React from 'react';
import { Link } from 'react-router-dom';
import './NotFound.css'; // Import the CSS file

const NotFound = () => {
  return (
    <div className="not-found-container">
      <h1 className="not-found-title">404</h1>
      <h2 className="not-found-subtitle">Oops! Page Not Found</h2>
      <p className="not-found-text">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="not-found-button">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;

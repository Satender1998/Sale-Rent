import { FaSearch } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import "./Header.css";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="header-container">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <h1 className="header-title">
            <span className="header-title-part1">Sale&</span>
            <span className="header-title-part2">Rent</span>
          </h1>
        </Link>
        <form onSubmit={handleSubmit} className="header-search-form">
          <input
            type="text"
            placeholder="Search..."
            className="header-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="header-search-button">
            <FaSearch className="header-search-icon" />
          </button>
        </form>
        <ul className="header-navigation">
          <li className="header-nav-item">
            <Link to="/" className="header-nav-link">
              Home
            </Link>
          </li>
          <li className="header-nav-item">
            <Link to="/about" className="header-nav-link">
              About
            </Link>
          </li>
          <li className="header-nav-item">
            <Link to="/profile" className="header-nav-link">
              {currentUser ? (
                <img
                  className="header-profile-image"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="header-signin">Sign in</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

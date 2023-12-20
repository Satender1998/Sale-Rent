import { FaSearch, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import "./Header.css";
import DarkMode from "./DarkMode";

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Update the URL search parameters with the current searchTerm
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();

    // Navigate to the "/search" route with the updated search parameters
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    // Extract and check the "searchTerm" from the URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");

    // If a searchTerm is found in the URL, update the component state
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [window.location.search]);

  return (
    <header className="header-container">
      <div className="header-content">

      <div className="header-menu-icon" onClick={handleMenuToggle}>
          <FaBars />
        </div>


        <Link to="/" className="header-logo">
          <h1 className="header-title">
            <span className="header-title-part1">Sale&</span>
            <span className="header-title-part2">Rent</span>
          </h1>
        </Link>
        {/* Form for submitting search queries */}
        <form onSubmit={handleSubmit} className="header-search-form">
          <input
            type="text"
            placeholder="Search..."
            className="header-search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {/* Button to submit the search form */}
          <button className="header-search-button">
            <FaSearch className="header-search-icon" />
          </button>
        </form>
        {/* Navigation links for Home, About, and User Profile */}



        <ul className={`header-navigation ${menuOpen ? "open" : ""}`}>



        {/* <ul className="header-navigation"> */}
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
          <li className="header-nav-item-darkMode">
            <DarkMode />
          </li>
          <li className="header-nav-item">
            <Link to="/profile" className="header-nav-link">
              {/* Display user profile image if logged in, otherwise show "Sign in" */}
              {currentUser ? (
                <img
                  className="header-profile-image"
                  src={currentUser.avatar}
                  alt="profile"
                />
              ) : (
                <span className="header-signin">SignIn</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </header>
  );
}

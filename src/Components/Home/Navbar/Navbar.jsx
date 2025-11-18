import { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <>
      <nav className="navbar">
        <div></div>
      </nav>

      <div className={`menu ${menuOpen ? 'open' : ''}`}>
        <button onClick={toggleMenu} className="menu-close-btn">✕</button>
        <Link to="/" onClick={toggleMenu}>Home</Link>
        <Link to="/adminland" onClick={toggleMenu}>AdminLand</Link>
        <Link to="/adminprofile" onClick={toggleMenu}>Profile</Link>
      </div>

      {menuOpen && <div className="menu-overlay" onClick={toggleMenu}></div>}
    </>
  );
};

export default Navbar;

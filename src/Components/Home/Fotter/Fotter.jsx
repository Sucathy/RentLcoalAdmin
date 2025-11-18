import React from "react";
import "./Fotter.css";

const Footer = () => {
  return (
    <footer className="footer-container">
      {/* Top Section */}
      <div className="footer-top">
        <div className="footer-logo">
          <h2>🏠 Finding PGs in Local</h2>
          <p>Helping you find the perfect PG near you with ease.</p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/contact">Contact</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
          </ul>
        </div>

        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: susuresh158@gmail.com</p>
          <p>Phone: +91 6363203639</p>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <hr />
        <p>© {new Date().getFullYear()} Suresh. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

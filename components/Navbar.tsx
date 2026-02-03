"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function Navbar() {
  return (
    <motion.header
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="navbar"
    >
      <div className="navbar-inner">
        <div className="brand">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="logo-box"
          >
            C
          </motion.div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.02em" }}>CityGuard SL</span>
        </div>

        <nav className="nav-links">
          {["Home", "Services", "About Us", "Contact"].map((item) => (
            <Link
              key={item}
              href={item === "Home" ? "#main" : `#${item.toLowerCase().replace(" ", "")}`}
            >
              {item}
            </Link>
          ))}

          <div className="action-buttons">
            <Link href="/Login">
              <button className="btn-secondary" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>Sign In</button>
            </Link>
            <Link href="/Register">
              <button className="btn-primary" style={{ padding: "10px 20px", fontSize: "0.9rem" }}>Get Started</button>
            </Link>
          </div>
        </nav>

        <button className="mobile-menu-btn" style={{ display: "none" }} aria-label="menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </motion.header>
  );
}

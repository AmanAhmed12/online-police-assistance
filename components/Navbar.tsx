// components/Navbar.tsx
import Link from "next/link";

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="container nav-inner">
        <div className="brand">
          <div className="logo-box">C</div>
          <div>CityGuard SL</div>
        </div>
        <nav className="nav-links">
          <Link href="#main">Home</Link>
          <Link href="#services">Services</Link>
          <Link href="#">About Us</Link>
          <Link href="#">Contact</Link>
          <div className="action-buttons">
            <Link href="/Login" aria-label="Sign In">
              <button className="btn-signin">Sign In</button>
            </Link>
            <Link href="Register" aria-label="Get Started">
              <button className="btn-getstarted">Get Started</button>
            </Link>
          </div>
        </nav>
        <button className="mobile-menu-btn" aria-label="menu">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
    </header>
  );
}

// components/Footer.tsx
import Link from "next/link";
import { FaTwitter, FaFacebookF, FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-title">CityGuard</div>
          <div className="copy">© 2024 CityGuard. All rights reserved.</div>
        </div>
        <div className="footer-col">
          <div className="footer-title">Legal</div>
          <Link href="#" className="footer-link">
            Privacy Policy
          </Link>
          <Link href="#" className="footer-link">
            Terms of Service
          </Link>
        </div>
        <div className="footer-col">
          <div className="footer-title">Contact</div>
          <div className="footer-link">support@cityguard.com</div>
        </div>
        <div className="footer-col">
          <div className="footer-title">Follow</div>
          <div className="socials">
            <FaTwitter aria-label="twitter" />
            <FaFacebookF aria-label="facebook" />
            <FaInstagram aria-label="instagram" />
          </div>
        </div>
      </div>
    </footer>
  );
}

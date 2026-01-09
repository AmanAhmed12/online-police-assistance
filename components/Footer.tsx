// components/Footer.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Twitter, Facebook, Instagram } from "@mui/icons-material";
import { Button } from "@mui/material";

export default function Footer() {
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const openTermsModal = () => setIsTermsModalOpen(true);
  const closeTermsModal = () => setIsTermsModalOpen(false);

  const openPrivacyModal = () => setIsPrivacyModalOpen(true);
  const closePrivacyModal = () => setIsPrivacyModalOpen(false);

  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-col">
          <div className="footer-title">CityGuard</div>
          <div className="copy">© 2024 CityGuard. All rights reserved.</div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Legal</div>
          {/* Privacy Policy opens modal */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openPrivacyModal();
            }}
            className="footer-link"
          >
            Privacy Policy
          </a>

          {/* Terms of Service opens modal */}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              openTermsModal();
            }}
            className="footer-link"
          >
            Terms of Service
          </a>
        </div>

        <div className="footer-col">
          <div className="footer-title">Contact</div>
          <div className="footer-link">support@cityguard.com</div>
        </div>

        <div className="footer-col">
          <div className="footer-title">Follow</div>
          <div className="socials">
            <Twitter aria-label="twitter" />
            <Facebook aria-label="facebook" />
            <Instagram aria-label="instagram" />
          </div>
        </div>
      </div>

      {/* Terms of Service Modal */}
      {isTermsModalOpen && (
        <div
          className="modal-overlay"
          onClick={closeTermsModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1f2433",
              color: "#f5f7ff",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 8px 32px rgba(40,102,242,0.25)",
            }}
          >
            <h2 style={{ color: "#2866f2", marginBottom: "1rem" }}>Terms of Service</h2>

            <p>
              Welcome to the Sri Lanka Police Online Assistance System. By accessing or using this system, you agree to comply with the following Terms of Service:
            </p>
            <p>
              <strong>1. Usage of the System:</strong> This system is intended for citizens to report incidents, access information, and communicate with authorized police personnel. Unauthorized access or misuse of this system is strictly prohibited.
            </p>
            <p>
              <strong>2. Privacy and Data Security:</strong> All information submitted through this system may be used by the Sri Lanka Police for administrative and investigative purposes. Users are responsible for ensuring that submitted data is accurate and lawful.
            </p>
            <p>
              <strong>3. Prohibited Activities:</strong> Users shall not submit false reports, attempt to hack or interfere with the system, or use it for harassment or illegal purposes.
            </p>
            <p>
              <strong>4. Intellectual Property:</strong> All content, forms, and materials within this system are property of the Sri Lanka Police and protected under applicable intellectual property laws.
            </p>
            <p>
              <strong>5. System Availability:</strong> While we strive to keep the system available 24/7, the Sri Lanka Police is not liable for any interruptions, downtime, or errors.
            </p>
            <p>
              <strong>6. Changes to Terms:</strong> The Sri Lanka Police reserves the right to modify these Terms of Service at any time. Users will be notified of changes where applicable.
            </p>
            <p>
              By using this system, you acknowledge that you have read, understood, and agree to these Terms of Service.
            </p>

            <Button
              variant="contained"
              onClick={closeTermsModal}
              sx={{
                mt: 3,
                backgroundColor: "#2866f2",
                "&:hover": { backgroundColor: "#1741a6" },
                color: "#fff",
                fontWeight: 700,
                borderRadius: "8px",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {isPrivacyModalOpen && (
        <div
          className="modal-overlay"
          onClick={closePrivacyModal}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "#1f2433",
              color: "#f5f7ff",
              padding: "2rem",
              borderRadius: "16px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflowY: "auto",
              boxShadow: "0 8px 32px rgba(40,102,242,0.25)",
            }}
          >
            <h2 style={{ color: "#2866f2", marginBottom: "1rem" }}>Privacy Policy</h2>

            <p>
              Your privacy is important to the Sri Lanka Police Online Assistance System. This Privacy Policy explains how we collect, use, and protect your personal information.
            </p>
            <p>
              <strong>1. Information Collection:</strong> We collect information you provide directly, such as incident reports, contact details, and feedback.
            </p>
            <p>
              <strong>2. Use of Information:</strong> Collected data is used solely for law enforcement, administrative purposes, and to improve the services provided through the system.
            </p>
            <p>
              <strong>3. Data Security:</strong> All personal data is stored securely and protected using industry-standard encryption. Access is limited to authorized personnel only.
            </p>
            <p>
              <strong>4. Sharing of Information:</strong> We do not share your personal data with third parties except where required by law or for public safety.
            </p>
            <p>
              <strong>5. User Responsibilities:</strong> Users must provide accurate information and must not attempt to access other users’ data or hack the system.
            </p>
            <p>
              <strong>6. Changes to Privacy Policy:</strong> The Sri Lanka Police may update this Privacy Policy at any time. Users will be notified of major changes when applicable.
            </p>
            <p>
              By using this system, you acknowledge that you have read, understood, and agree to this Privacy Policy.
            </p>

            <Button
              variant="contained"
              onClick={closePrivacyModal}
              sx={{
                mt: 3,
                backgroundColor: "#2866f2",
                "&:hover": { backgroundColor: "#1741a6" },
                color: "#fff",
                fontWeight: 700,
                borderRadius: "8px",
              }}
            >
              OK
            </Button>
          </div>
        </div>
      )}
    </footer>
  );
}

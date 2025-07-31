// AboutUs.jsx
// ...existing code...
import React from "react";

export default function AboutUs() {
  return (
    <section className="container" style={{ marginTop: "32px", marginBottom: "32px" }}>
      <h2 className="section-title">About Us</h2>
      <p className="section-sub">
        We are dedicated to providing seamless online police assistance, ensuring safety and support for our community.
      </p>
      <div className="feature-card">
        <div className="feature-icon">
          {/* You can use an icon here */}
          <span role="img" aria-label="shield">🛡️</span>
        </div>
        <div className="feature-text">
          <h3>Our Mission</h3>
          <p>
            To make police services accessible, transparent, and efficient for everyone.
          </p>
        </div>
      </div>
    </section>
  );
}
// ...existing code...
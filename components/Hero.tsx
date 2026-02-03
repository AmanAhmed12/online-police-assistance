"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              style={{
                color: "var(--primary)",
                fontWeight: 800,
                fontSize: "1rem",
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                marginBottom: "24px",
                display: "block"
              }}
            >
              Protecting Our Community
            </motion.span>
            <h1>
              Your Safety, <br />
              <span style={{ color: "var(--primary)" }}>Our Priority</span>
            </h1>
            <p>
              CityGuard is dedicated to providing swift and reliable assistance to ensure the
              safety and well-being of our community. Trust, transparency, and innovation.
            </p>
            <div className="buttons">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary"
              >
                Report an Incident
              </motion.button>
              <Link href="https://www.police.lk/" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-secondary"
                >
                  Learn More
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// Need to import Link
import Link from "next/link";

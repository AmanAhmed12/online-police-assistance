// components/CallToAction.tsx
import Link from "next/link";

export default function CallToAction() {
  return (
    <section className="cta">
      <div className="container">
        <h2>Join CityGuard Today</h2>
        <p>Sign up now to experience a safer and more connected community.</p>
        <div style={{ marginTop: "16px" }}>
          <Link href="/Register" passHref>
            <button className="btn">Get Started</button>
          </Link>
        </div>
      </div>
    </section>
  );
}

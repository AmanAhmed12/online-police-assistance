// components/Hero.tsx
import Image from "next/image";
export default function Hero() {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-content-wrapper">
          <Image src="/city3.jpg" alt="City skyline" className="hero-bg" layout="fill" objectFit="cover" />
          <div className="hero-overlay" />
          <div className="hero-inner">
            <h1>Your Safety, Our Priority</h1>
            <p>
              CityGuard is dedicated to providing swift and reliable assistance to ensure the
              safety and well-being of our community. Whether you need immediate help or have a
              question, we're here for you.
            </p>
            <div className="buttons">
              <button className="btn-primary">Report an Incident</button>
              <a
                href="https://www.police.lk/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="btn-secondary">Learn More</button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

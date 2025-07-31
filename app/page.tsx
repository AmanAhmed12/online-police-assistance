import Image from "next/image";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import Services from "../components/Services";
import CallToAction from "../components/CallToAction";
import AboutUs from "../components/AboutUs";
import ContactUs from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div >
      <Navbar />
      <main id="main">
        <Hero />

        <section  style={{ paddingTop: "40px" }} className="container">
          <div className="section-title">
            <h2 style={{ fontSize: "2.5rem" }}>How CityGuard Works</h2>
            <p className="section-sub">
              Our platform connects you with local law enforcement and emergency services,
              ensuring rapid response and support.
            </p>
          </div>
          <div className="features">
            <HowItWorks />
          </div>
        </section>

         <section id="services" style={{ paddingTop: "40px" }} className="container">
          <h2 style={{ fontSize: "2.5rem",textAlign: "center", margin: "40px 0" }}>Our Services</h2>
          <p className="section-sub">
            CityGuard offers a range of services designed to enhance community safety and
            security.
          </p>
          <Services />
        </section>
        <AboutUs />
        <ContactUs />

        <CallToAction />

      </main>
      <Footer />
    </div>
  );
}

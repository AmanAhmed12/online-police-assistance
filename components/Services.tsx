// components/Services.tsx
import Image from "next/image";
export default function Services() {
  return (
    <div className="service-grid">
      <div className="service-card">
        <Image src="/service1.jpg" alt="Emergency Assistance" layout="responsive" width={500} height={300} />
        <div className="service-body">
          <h3>Emergency Assistance</h3>
          <p>
            Immediate access to emergency services with real-time tracking and updates.
          </p>
        </div>
      </div>
      <div className="service-card">
        <Image src="/service2.jpg" alt="Community Alerts" layout="responsive" width={500} height={300} />
        <div className="service-body">
          <h3>Community Alerts</h3>
          <p>Receive timely alerts about incidents and safety concerns in your area.</p>
        </div>
      </div>
      <div className="service-card">
        <Image src="/service3.jpg" alt="Safety Resources" layout="responsive" width={500} height={300} />
        <div className="service-body">
          <h3>Safety Resources</h3>
          <p>
            Access valuable resources and information on safety and crime prevention.
          </p>
        </div>
      </div>
    </div>
  );
}

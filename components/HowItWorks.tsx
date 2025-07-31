// components/HowItWorks.tsx
export default function HowItWorks() {
  return (
    <>
      <div className="feature-card">
        <div className="feature-icon">
          <div aria-hidden="true">🛡️</div>
        </div>
        <div className="feature-text">
          <h3>File Complaints Online</h3>
          <p>Make Complaints with detailed information and media attachments.</p>
        </div>
      </div>
      <div className="feature-card">
        <div className="feature-icon">
           <div aria-hidden="true">🕵️</div>
        </div>
        <div className="feature-text">
          <h3>Find Matching Suspect</h3>
          <p>Find the Matching Suspect by providing details and match the details with the suspect list in our system.</p>
        </div>
      </div>

      <div className="feature-card">
        <div className="feature-icon">
          <div aria-hidden="true">📄</div>
        </div>
        <div className="feature-text">
          <h3>Request Police Reports</h3>
          <p>
            Easily request official police reports and access important case
            documents securely online.
          </p>
        </div>
     </div>
       
      <div className="feature-card">
        <div className="feature-icon">
          <div aria-hidden="true">🤖</div>
        </div>
        <div className="feature-text">
          <h3>Identify Legal violations by chatting with an AI</h3>
          <p>
            Get instant insights into potential legal violations by interacting
            with our AI-powered chatbot.
          </p>
        </div>
     </div>

       <div className="feature-card">
  <div className="feature-icon">
    <div aria-hidden="true">📊</div>
  </div>
  <div className="feature-text">
    <h3>View Analysis Charts</h3>
    <p>Visualize trends and insights with interactive analysis charts for cases, complaints, and matches.</p>
  </div>
</div>

<div className="feature-card">
  <div className="feature-icon">
    <div aria-hidden="true">📥</div>
  </div>
  <div className="feature-text">
    <h3>Download Reports</h3>
    <p>Export detailed reports in PDF/CSV formats for offline review and sharing.</p>
  </div>
</div>


    </>
  );
}

import { BriefcaseBusiness } from "lucide-react";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="footer-brand">
            <BriefcaseBusiness size={18} />
            TalentBridge
          </div>
          <p>Hiring tools for focused teams and candidates who want a clearer path.</p>
        </div>
        <div className="footer-links">
          <span>Secure accounts</span>
          <span>Resume uploads</span>
          <span>Email updates</span>
        </div>
      </div>
    </footer>
  );
}


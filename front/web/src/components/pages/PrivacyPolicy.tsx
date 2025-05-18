import "./PrivacyPolicy.css";
import Title from "../Title";

export default function PrivacyPolicy() {

  return (
    <div className="privacy-policy-container">
      <div className="privacy-policy-main-container">
        <Title title="Privacy policy" style={{marginBottom: '5%'}} />
        <div className="privacy-policy-title">1. Introduction</div>
        <div className="privacy-policy-sub-text">
          Welcome to TechParisArea (the "Service"), a platform that enables
          users to create automated actions based on triggers and conditions. At
          TechParisArea, we are committed to protecting your privacy and
          providing a safe and secure environment for our users. This Privacy
          Policy outlines how we collect, use, and protect your personal
          information when you use our Service.<br></br>
          By using the Service, you agree to the terms and conditions outlined
          in this Privacy Policy. If you do not agree with any part of this
          policy, please refrain from using the Service.
        </div>
        <div className="privacy-policy-title">2. Information We Collect</div>
        <div className="privacy-policy-sub-title">2.1 Personal Information</div>
        <div className="privacy-policy-sub-text">
          When you sign up for the Service, we may collect personal information,
          including but not limited to your name, email address, and other
          contact details.
        </div>
        <div className="privacy-policy-sub-title">2.2 Usage Information</div>
        <div className="privacy-policy-sub-text">
          We collect information about how you use the Service, including
          actions you create, triggers you set, and other activity data.
        </div>
        <div className="privacy-policy-sub-title">2.3 Device Information</div>
        <div className="privacy-policy-sub-text">
          We may collect information about the device you use to access the
          Service, including device type, operating system, and unique device
          identifiers.
        </div>
        <div className="privacy-policy-title">
          3. How We Use Your Information
        </div>
        <div className="privacy-policy-sub-text">
          We use the information we collect for various purposes, including:
        </div>
        <div className="privacy-policy-sub-title">
          3.1 Providing the Service
        </div>
        <div className="privacy-policy-sub-text">
          To provide and improve the functionality of the Service, and to
          personalize your experience.
        </div>
        <div className="privacy-policy-sub-title">3.2 Communication</div>
        <div className="privacy-policy-sub-text">
          To communicate with you regarding your account, updates, and
          notifications related to the Service.
        </div>
        <div className="privacy-policy-sub-title">3.3 Analytics</div>
        <div className="privacy-policy-sub-text">
          To analyze user behavior and preferences to improve our Service and
          user experience.
        </div>
        <div className="privacy-policy-sub-title">3.4 Legal Compliance</div>
        <div className="privacy-policy-sub-text">
          To comply with applicable laws and regulations.
        </div>
        <div className="privacy-policy-title">4. Data Security</div>
        <div className="privacy-policy-sub-text">
          We implement appropriate security measures to protect your data.
          However, please be aware that no method of data transmission over the
          internet is completely secure, and we cannot guarantee the absolute
          security of your information.
        </div>
        <div className="privacy-policy-title">5. Sharing Your Information</div>
        <div className="privacy-policy-sub-text">
          We may share your information with third parties in the following
          circumstances: With your consent. To comply with legal obligations. In
          the event of a merger, acquisition, or sale of all or a portion of our
          assets.
        </div>
        <div className="privacy-policy-title">6. Your Choices and Rights</div>
        <div className="privacy-policy-sub-text">
          You have certain rights regarding your personal information, including
          the right to access, correct, or delete your data. You may also have
          the right to object to the processing of your data or withdraw your
          consent.
        </div>
        <div className="privacy-policy-title">
          7. Changes to this Privacy Policy
        </div>
        <div className="privacy-policy-sub-text">
          We may update this Privacy Policy from time to time. The most recent
          version of the Privacy Policy will be posted on the Service, and the
          effective date will be updated.
        </div>
        <div className="privacy-policy-title">8. Contact Us</div>
        <div className="privacy-policy-sub-text" style={{paddingBottom: '5%'}}>
          If you have any questions or concerns about this Privacy Policy or
          your personal information, please contact us at mail@techparisarea.com.
        </div>
      </div>
    </div>
  );
}

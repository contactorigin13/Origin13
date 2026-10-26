import React, { useState } from 'react';

export const ContactPageSection: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [organization, setOrganization] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const scrollToContent = () => {
    const contentEl = document.getElementById('contactContent');
    if (contentEl) {
      contentEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !serviceType || !message.trim()) return;
    setSubmitted(true);
  };

  return (
    <div>
      {/* Full-Viewport Cinematic Hero */}
      <header className="portfolio-hero-full">
        <div
          className="hero-bg-zoom"
          style={{ backgroundImage: "url('/assets/slide-3.jpg')" }}
        />
        <div className="hero-dark-overlay" />

        <div className="hero-center-content">
          <span className="section-eyebrow">Get In Touch</span>
          <h1>
            Let&apos;s Start a <span className="highlight">Conversation.</span>
          </h1>
          <p>
            Whether you are commissioning a documentary, planning a regional campaign, or
            seeking a reliable field production partner in Ethiopia, our team is ready to
            collaborate.
          </p>

          <button
            type="button"
            className="scroll-down-btn light-mode-btn"
            onClick={scrollToContent}
          >
            <span>Reach Out</span>
            <div className="arrow-circle">
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </div>
          </button>
        </div>
      </header>

      {/* Main Contact Section */}
      <main className="contact-main-section" id="contactContent">
        <div className="contact-grid">
          {/* Left Column: Direct Details */}
          <div className="contact-info-col">
            <h2>Direct Channels</h2>
            <p>
              Reach out directly to our Addis Ababa office or submit an inquiry through the
              form. We respond to all institutional and production inquiries within 24–48
              business hours.
            </p>

            <div className="contact-detail-list">
              <div className="contact-detail-item">
                <span className="contact-detail-label">Headquarters</span>
                <div className="contact-detail-value">Addis Ababa, Ethiopia</div>
              </div>

              <div className="contact-detail-item">
                <span className="contact-detail-label">Electronic Mail</span>
                <div className="contact-detail-value">
                  <a href="mailto:info@origin13.org">info@origin13.org</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <span className="contact-detail-label">Direct Line</span>
                <div className="contact-detail-value">
                  <a href="tel:+251911000000">+251 911 000 000</a>
                </div>
              </div>

              <div className="contact-detail-item">
                <span className="contact-detail-label">Regional Operations</span>
                <div className="contact-detail-value">
                  Available for deployment across all regions of Ethiopia &amp; East Africa.
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="contact-form-card">
            {submitted ? (
              <div style={{ padding: '2rem 0' }}>
                <span className="section-eyebrow">Inquiry Logged</span>
                <h3
                  style={{
                    fontSize: '1.8rem',
                    fontWeight: 800,
                    color: '#FFFFFF',
                    marginBottom: '1rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Thank you, {fullName}.
                </h3>
                <p
                  style={{
                    fontSize: '1.05rem',
                    color: '#A0B2C0',
                    lineHeight: 1.75,
                    marginBottom: '2rem',
                  }}
                >
                  Your project inquiry regarding <strong>{serviceType}</strong> has been
                  received by our Addis Ababa production desk. We will respond to{' '}
                  <strong>{email}</strong> within 24–48 business hours.
                </p>
                <button
                  type="button"
                  className="btn-submit-form"
                  onClick={() => {
                    setSubmitted(false);
                    setFullName('');
                    setEmail('');
                    setOrganization('');
                    setServiceType('');
                    setMessage('');
                  }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-row-split">
                  <div className="form-group">
                    <label htmlFor="fullName">Full Name *</label>
                    <input
                      type="text"
                      id="fullName"
                      className="form-control"
                      placeholder="Your name"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address *</label>
                    <input
                      type="email"
                      id="email"
                      className="form-control"
                      placeholder="name@organization.org"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row-split">
                  <div className="form-group">
                    <label htmlFor="organization">Organization / Institution</label>
                    <input
                      type="text"
                      id="organization"
                      className="form-control"
                      placeholder="NGO, Agency, or Company"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="serviceType">Area of Collaboration *</label>
                    <select
                      id="serviceType"
                      className="form-control"
                      required
                      value={serviceType}
                      onChange={(e) => setServiceType(e.target.value)}
                    >
                      <option value="" disabled>
                        Select a discipline...
                      </option>
                      <option value="Documentary & Film Production">
                        Documentary &amp; Film Production
                      </option>
                      <option value="Editorial Photojournalism">
                        Editorial Photojournalism
                      </option>
                      <option value="Strategic Communications">
                        Strategic Communications
                      </option>
                      <option value="Field Fixer & Co-Production">
                        Field Fixer &amp; Co-Production
                      </option>
                      <option value="General Inquiry">General Inquiry</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Project Brief or Message *</label>
                  <textarea
                    id="message"
                    className="form-control"
                    placeholder="Tell us about your project, timeline, and regional scope..."
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="btn-submit-form">
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

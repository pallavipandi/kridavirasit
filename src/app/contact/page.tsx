"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  MapPin,
  Send,
  MessageCircle,
} from "lucide-react";

export default function ContactPage() {
  const router = useRouter();

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="contact-page">

      {/* NAVIGATION */}

      <nav className="contact-nav">

        <button
          className="contact-back"
          onClick={() => router.push("/home")}
        >
          <ArrowLeft size={18} />
          Back to Home
        </button>

        <div className="contact-logo">
          <span>🪷</span>

          <div>
            <strong>KRIDAVIRASAT</strong>
            <small>Indian Knowledge System</small>
          </div>
        </div>

        <button
          className="contact-games"
          onClick={() => router.push("/games")}
        >
          Explore Games →
        </button>

      </nav>

      {/* HERO */}

      <section className="contact-hero">

        <div className="contact-symbol">
          ✉
        </div>

        <small>LET'S CONNECT</small>

        <h1>
          Get in <span>Touch</span>
        </h1>

        <p>
          Have a question, suggestion or simply want to
          share your experience with KridaVirasat?
          We'd love to hear from you.
        </p>

      </section>

      {/* MAIN CONTENT */}

      <section className="contact-content">

        {/* INFORMATION */}

        <div className="contact-information">

          <div className="contact-heading">
            <small>REACH OUT</small>

            <h2>
              We'd love to
              <span> hear from you.</span>
            </h2>

            <p>
              KridaVirasat is built to help preserve and
              celebrate India's traditional games and
              cultural knowledge.
            </p>
          </div>

          <div className="contact-info-list">

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <Mail size={21} />
              </div>

              <div>
                <small>EMAIL</small>
                <strong>hello@kridavirasat.com</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MessageCircle size={21} />
              </div>

              <div>
                <small>FEEDBACK</small>
                <strong>Share your experience with us</strong>
              </div>
            </div>

            <div className="contact-info-item">
              <div className="contact-info-icon">
                <MapPin size={21} />
              </div>

              <div>
                <small>HERITAGE</small>
                <strong>India · Our shared cultural home</strong>
              </div>
            </div>

          </div>

        </div>

        {/* FORM */}

        <div className="contact-form-card">

          {submitted ? (
            <div className="contact-success">

              <div className="success-icon">
                ✓
              </div>

              <h2>
                Thank You!
              </h2>

              <p>
                Your message has been received.
                Thank you for being part of the
                KridaVirasat journey.
              </p>

              <button
                onClick={() => setSubmitted(false)}
              >
                Send Another Message
              </button>

            </div>
          ) : (

            <form onSubmit={handleSubmit}>

              <h2>
                Send us a message
              </h2>

              <p className="contact-form-subtitle">
                Tell us what's on your mind.
              </p>

              <label>
                Your Name
              </label>

              <input
                type="text"
                placeholder="Enter your name"
                required
              />

              <label>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                required
              />

              <label>
                Subject
              </label>

              <input
                type="text"
                placeholder="What is your message about?"
                required
              />

              <label>
                Message
              </label>

              <textarea
                placeholder="Write your message here..."
                rows={6}
                required
              />

              <button
                type="submit"
                className="contact-submit"
              >
                Send Message
                <Send size={17} />
              </button>

            </form>

          )}

        </div>

      </section>

      {/* BOTTOM HERITAGE SECTION */}

      <section className="contact-heritage">

        <div className="contact-heritage-symbol">
          🪷
        </div>

        <h2>
          Every story helps
          <span> preserve heritage.</span>
        </h2>

        <p>
          Your ideas, memories and experiences help us
          keep India's traditional knowledge alive for
          future generations.
        </p>

      </section>

      {/* FOOTER */}

      <footer className="contact-footer">

        <div>
          🪷 KRIDAVIRASAT
        </div>

        <p>
          Rediscover the Heritage of Indian Play
        </p>

        <small>
          © 2026 KRIDAVIRASAT · Indian Knowledge System
        </small>

      </footer>

    </main>
  );
}
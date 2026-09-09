"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Gamepad2,
  Languages,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "./LanguageProvider";

export default function Home() {
  const router = useRouter();

  const { t } = useLanguage();

  return (
    <main className="heritage-page">
      <div className="heritage-border" />

      <div className="corner corner-tl" />
      <div className="corner corner-tr" />
      <div className="corner corner-bl" />
      <div className="corner corner-br" />

      <section className="landing-content">
        <div className="landing-inner">

          {/* IKS Label */}
          <motion.div
            className="iks-label"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {t.iks}
          </motion.div>

          {/* Lotus */}
          <motion.div
            className="lotus"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1,
              delay: 0.3,
              type: "spring",
            }}
          >
            🪷
          </motion.div>

          {/* Brand */}
          <motion.h1
            className="brand-name"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 1.2,
              delay: 0.5,
            }}
          >
            KRIDAVIRASAT
          </motion.h1>

          {/* Main Tagline */}
          <motion.p
            className="tagline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.1,
            }}
          >
            {t.tagline}
          </motion.p>

          {/* Small Tagline */}
          <motion.p
            className="tagline-small"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 1.4,
            }}
          >
            {t.taglineSmall}
          </motion.p>

          {/* Begin Button */}
          <motion.button
            className="begin-button"
            onClick={() => router.push("/language")}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 1.7,
            }}
            whileTap={{ scale: 0.97 }}
          >
            {t.begin}

            <ArrowRight
              size={16}
              style={{
                marginLeft: "10px",
                verticalAlign: "middle",
              }}
            />
          </motion.button>

          {/* Feature Pills */}
          <motion.div
            className="landing-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1,
              delay: 2,
            }}
          >
            <span className="feature-pill">
              <Gamepad2
                size={12}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />
              {t.traditionalGames}
            </span>

            <span className="feature-pill">
              <Languages
                size={12}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />
              {t.indianLanguages}
            </span>

            <span className="feature-pill">
              <Sparkles
                size={12}
                style={{
                  verticalAlign: "middle",
                  marginRight: "5px",
                }}
              />
              {t.ancientKnowledge}
            </span>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <div className="landing-footer">
        {t.footer}
      </div>
    </main>
  );
}
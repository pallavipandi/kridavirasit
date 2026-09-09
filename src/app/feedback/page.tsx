"use client";

import { motion } from "framer-motion";
import { ArrowLeft, CheckCircle, MessageSquare, Star } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function FeedbackPage() {
  const router = useRouter();

  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!rating || !feedback.trim()) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#f8f4ea] text-[#2f3b2f] px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="mb-8 flex items-center gap-2 text-[#53664f] hover:text-[#2f3b2f] transition"
      >
        <ArrowLeft size={20} />
        Back
      </button>

      <div className="max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#dce6d4] flex items-center justify-center">
            <MessageSquare size={30} className="text-[#53664f]" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Share Your Feedback
          </h1>

          <p className="text-[#687566] max-w-xl mx-auto text-lg">
            Your thoughts help us improve the experience and preserve the
            beauty of traditional games and culture.
          </p>
        </motion.div>

        {/* Feedback Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
          className="bg-white rounded-3xl shadow-lg p-7 md:p-10 border border-[#e5dfd2]"
        >
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Rating */}
              <div>
                <label className="block text-lg font-semibold mb-4">
                  How was your experience?
                </label>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={36}
                        className={
                          star <= rating
                            ? "fill-[#d4a84f] text-[#d4a84f]"
                            : "text-[#c9c4b8]"
                        }
                      />
                    </button>
                  ))}
                </div>

                <p className="text-sm text-[#7a8277] mt-2">
                  {rating === 0
                    ? "Select a rating"
                    : `${rating} out of 5 stars`}
                </p>
              </div>

              {/* Feedback */}
              <div>
                <label
                  htmlFor="feedback"
                  className="block text-lg font-semibold mb-3"
                >
                  Tell us what you think
                </label>

                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your thoughts, suggestions or ideas..."
                  rows={6}
                  className="w-full rounded-2xl border border-[#d9d5ca] bg-[#faf9f5] px-5 py-4 outline-none resize-none focus:border-[#71846a] focus:ring-2 focus:ring-[#dce6d4] transition"
                />
              </div>

              {/* Suggestions */}
              <div>
                <label className="block text-lg font-semibold mb-3">
                  What would you like to see more of?
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "More traditional games",
                    "More languages",
                    "Cultural stories",
                    "Better game experience",
                  ].map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-[#ded9ce] px-4 py-3 cursor-pointer hover:bg-[#f5f3ec] transition"
                    >
                      <input
                        type="checkbox"
                        className="accent-[#53664f] w-4 h-4"
                      />
                      <span className="text-sm">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!rating || !feedback.trim()}
                className="w-full rounded-2xl bg-[#53664f] text-white py-4 font-semibold text-lg hover:bg-[#43543f] transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Submit Feedback
              </button>
            </form>
          ) : (
            /* Success Message */
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-10"
            >
              <div className="mx-auto mb-6 w-20 h-20 rounded-full bg-[#dcebd8] flex items-center justify-center">
                <CheckCircle
                  size={42}
                  className="text-[#53664f]"
                />
              </div>

              <h2 className="text-3xl font-bold mb-3">
                Thank You!
              </h2>

              <p className="text-[#687566] text-lg mb-8">
                Your feedback has been received. Thank you for helping us
                preserve and celebrate traditional games.
              </p>

              <button
                onClick={() => router.push("/")}
                className="px-8 py-3 rounded-xl bg-[#53664f] text-white font-semibold hover:bg-[#43543f] transition"
              >
                Back to Home
              </button>
            </motion.div>
          )}
        </motion.div>

        {/* Bottom Text */}
        <p className="text-center text-sm text-[#8a8f86] mt-8">
          Every suggestion helps us make the experience better.
        </p>
      </div>
    </main>
  );
}
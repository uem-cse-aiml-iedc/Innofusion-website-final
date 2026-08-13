import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Scroll, Shield } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "Who can participate?",
    answer: "Current students from any college or university can participate."
  },
  {
    question: "What is the maximum/minimum team size?",
    answer: "Teams can range in size from 1 to 4 participants."
  },
  {
    question: "Are cross-institutional teams allowed?",
    answer: "Yes! Cross-institutional teams are absolutely welcome. Form your clan with warriors from different colleges and universities."
  },
  {
    question: "Can I participate solo?",
    answer: "While we encourage teamwork, if you prefer to participate solo, you're welcome to do so."
  },
  {
    question: "What is the participation fee?",
    answer: "InnoFusion Hackathon is absolutely free to register. No participation fee is required."
  },
  {
    question: "What is the theme of this hackathon?",
    answer: "This is an open innovation based hackathon. Hackers will define their own problem statements and solutions."
  },
  {
    question: "Where will the grand finale be held?",
    answer: "The grand finale will be held at University Of Engineering and Management, University Area, Action Area III, New Town, Kolkata - 700160."
  },
  {
    question: "Can I participate remotely?",
    answer: "The idea submission round is conducted online, allowing remote participation. However, please note that the grand finale will be held offline."
  },
  {
    question: "Will accommodation be provided during the hackathon?",
    answer: "Accommodation will be provided in the university campus during the hackathon. More details will be communicated to the finalists."
  },
  {
    question: "Do we need to bring our own food?",
    answer: "If you prefer to, you can bring your own food, but we'll also be providing food and beverages."
  },
  {
    question: "Are we allowed to leave the campus before conclusion?",
    answer: "Participants are required to stay on campus until the conclusion of the hackathon. Leaving early will result in disqualification, as midway evaluations will be there."
  },
  {
    question: "If we have more queries, where should we reach out?",
    answer: "You can reach us at our official email or through our social media handles. Our team is always ready to help fellow warriors!"
  },
  {
    question:"Is vibe coding allowed?",
    answer:"Yes as far as you can code and you pass the vibe check."
  },
  {
    question:"Is committing before hacking time allowed ?",
    answer:"Any commits or builds before the hacking time will lead to disqualification after discussing with the faculty, external judges and mentors."
  }
];

const FAQ = () => {
  const { isNight } = useTheme();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="relative py-16 sm:py-20 md:py-24 overflow-hidden"
    >
      {/*
        Backdrop lives on its own masked layer rather than on the section so
        its colour can dissolve into the page black at both edges instead of
        stopping on a hard line.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 blend-y"
        style={{
          background: isNight
            ? 'linear-gradient(180deg, #1a0a2e 0%, #0d0015 50%, #1a0a2e 100%)'
            : 'linear-gradient(180deg, #1a1a2e 0%, #0a0a0f 50%, #1a1a2e 100%)',
        }}
      />

      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${isNight ? '9333ea' : 'ffd700'}' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Floating troops */}
      <motion.img
        src="/characters/skeleton.webp"
        alt=""
        className="absolute left-4 top-20 h-16 sm:h-20 md:h-24 object-contain opacity-20 hidden lg:block"
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 4, repeat: Infinity }}
      />
      <motion.img
        src="/characters/dart-goblin.webp"
        alt=""
        className="absolute right-4 top-32 h-16 sm:h-20 md:h-24 object-contain opacity-20 hidden lg:block"
        animate={{ y: [10, -10, 10] }}
        transition={{ duration: 4.5, repeat: Infinity }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Scroll 
                size={32} 
                className={isNight ? "text-purple-400" : "text-gold-coin"} 
              />
            </motion.div>
            <Shield 
              size={28} 
              className={isNight ? "text-purple-500" : "text-amber-500"} 
            />
          </div>
          
          <h2 className="font-heading font-semibold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3">
            <span className={isNight ? "text-purple-400" : "text-amber-600"}>Player</span>{" "}
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: isNight
                  ? 'linear-gradient(180deg, #a855f7 0%, #7c3aed 100%)'
                  : 'linear-gradient(180deg, #FFD700 0%, #FFA500 100%)',
                WebkitBackgroundClip: 'text',
              }}
            >
              Queries
            </span>
          </h2>
          
          <p className="font-body text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Got questions, warrior? Find your answers in the ancient scrolls below!
          </p>
        </motion.div>

        {/* FAQ Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-w-7xl mx-auto">
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <motion.button
                onClick={() => toggleFAQ(index)}
                className="w-full text-left"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div
                  className="relative rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: openIndex === index
                      ? isNight
                        ? 'linear-gradient(135deg, #3b2667 0%, #2a1b4a 100%)'
                        : 'linear-gradient(135deg, #2d2d3d 0%, #1a1a2e 100%)'
                      : isNight
                        ? 'linear-gradient(135deg, #1f1135 0%, #150d25 100%)'
                        : 'linear-gradient(135deg, #1a1a2e 0%, #0d0d15 100%)',
                    border: `2px solid ${
                      openIndex === index
                        ? isNight ? '#a855f7' : '#FFD700'
                        : isNight ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 215, 0, 0.2)'
                    }`,
                    boxShadow: openIndex === index
                      ? isNight
                        ? '0 0 20px rgba(168, 85, 247, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
                        : '0 0 20px rgba(255, 215, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)'
                      : 'inset 0 1px 0 rgba(255,255,255,0.05)',
                  }}
                >
                  {/* Question */}
                  <div className="flex items-center justify-between gap-3">
                    <h3 
                      className="font-body text-sm sm:text-base font-medium pr-2"
                      style={{
                        color: openIndex === index
                          ? isNight ? '#f3e8ff' : '#FFFFFF'
                          : isNight ? '#e9d5ff' : '#f5f5f5',
                      }}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      <ChevronDown 
                        size={20} 
                        className={isNight ? "text-purple-400" : "text-gold-coin"} 
                      />
                    </motion.div>
                  </div>

                  {/* Answer */}
                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div 
                          className="pt-3 mt-3"
                          style={{
                            borderTop: `1px solid ${isNight ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 215, 0, 0.2)'}`,
                          }}
                        >
                          <p className="font-body text-sm leading-relaxed" style={{ color: isNight ? '#d8b4fe' : '#e5e5e5' }}>
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Bottom decoration */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="flex justify-center mt-10 gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={`w-2 h-2 rounded-full ${isNight ? 'bg-purple-500' : 'bg-gold-coin'}`}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: i * 0.2 
              }}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FAQ;

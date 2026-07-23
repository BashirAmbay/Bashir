import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, MessageCircleQuestion } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: "How do I place an order for home delivery?",
    answer: "Placing an order is simple. Just create an account or log in, navigate to your dashboard, select the products and quantities you need, and confirm your delivery details. You can also set up recurring orders."
  },
  {
    question: "Is there a minimum order quantity for delivery?",
    answer: "Yes, for free delivery within our standard coverage areas, we require a minimum order of 5 dispenser bottles or 10 packs of bottled water. For smaller orders, a small delivery fee may apply."
  },
  {
    question: "What purification process do you use?",
    answer: "We use a rigorous multi-stage purification process that includes reverse osmosis, carbon filtration, micron filtration, and UV sterilization. This ensures 99.9% removal of impurities, bacteria, and viruses."
  },
  {
    question: "Can I return empty dispenser bottles?",
    answer: "Absolutely! We operate a bottle exchange program. When we deliver your new 19L dispenser bottles, simply return your empty ones to our delivery team."
  },
  {
    question: "Do you supply water dispensers as well?",
    answer: "Yes, we sell and rent various models of hot and cold water dispensers for homes and offices. Please contact our sales team for current models and pricing."
  },
  {
    question: "How soon will my order be delivered?",
    answer: "Standard orders are usually delivered within 24-48 hours. For urgent requests, we offer an express delivery option for a nominal fee."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-slate-50">
      
      {/* Header */}
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <MessageCircleQuestion className="w-8 h-8" />
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Frequently Asked <span className="text-sky-500">Questions</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Everything you need to know about our products, services, and billing. Can't find the answer you're looking for? Contact us.
          </motion.p>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="pb-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                >
                  <span className="font-bold text-lg text-slate-900 pr-8">{faq.question}</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-sky-500 shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {openIndex === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-6 pb-5 text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 text-center bg-sky-50 rounded-3xl p-8 border border-sky-100">
            <h3 className="text-xl font-bold text-slate-900 mb-3">Still have questions?</h3>
            <p className="text-slate-600 mb-6">Our support team is always ready to help you with any inquiries.</p>
            <Link 
              to="/contact"
              className="inline-flex items-center justify-center px-8 py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl shadow-lg shadow-sky-600/30 transition-all"
            >
              Contact Support
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}


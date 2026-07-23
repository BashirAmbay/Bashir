import React from 'react';
import { motion } from 'framer-motion';
import { Target, Eye, Award, CheckCircle2 } from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12">
      {/* Header */}
      <section className="bg-sky-50 py-16 lg:py-24 border-b border-sky-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            About <span className="text-sky-500">Bin Uthman</span> Water
          </motion.h1>
          <motion.p 
            initial="hidden" animate="visible" variants={fadeIn}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Dedicated to providing the purest, safest, and most refreshing table water to our community since our inception.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
              <h2 className="text-3xl font-display font-bold text-slate-900 mb-6">Our Story</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed text-lg">
                <p>
                  Bin Uthman Table Water was founded with a singular purpose: to combat the challenge of unsafe drinking water by providing a premium, reliable alternative for homes and businesses.
                </p>
                <p>
                  We understand that water is life. That's why we have invested in state-of-the-art reverse osmosis and UV sterilization technology to ensure that every drop that leaves our facility meets the highest international standards of purity and safety.
                </p>
                <p>
                  Over the years, we've grown from a small local supplier to a trusted name in hydration, serving thousands of satisfied customers who rely on our commitment to quality.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative rounded-3xl overflow-hidden aspect-video lg:aspect-square bg-slate-200 shadow-2xl"
            >
              {/* Image Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-sky-400/20 to-blue-600/20 mix-blend-overlay"></div>
              <img 
                src="https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=2070&auto=format&fit=crop" 
                alt="Water purification facility" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Mission & Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-10 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6">
                <Target className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 leading-relaxed">
                To consistently deliver pure, safe, and refreshing table water while maintaining exceptional customer service and sustainable production practices.
              </p>
            </motion.div>

            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
              className="p-10 rounded-3xl bg-white border border-slate-100 shadow-lg shadow-slate-100"
            >
              <div className="w-16 h-16 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6">
                <Eye className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                To become the most trusted and preferred table water brand in the region, recognized for unwavering quality and commitment to public health.
              </p>
            </motion.div>
          </div>

          {/* Core Values */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-slate-900 mb-4">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Quality First', desc: 'No compromises on purity and safety.' },
              { title: 'Customer Focus', desc: 'Your satisfaction drives our business.' },
              { title: 'Integrity', desc: 'Honesty and transparency in all we do.' },
              { title: 'Innovation', desc: 'Continuously improving our processes.' }
            ].map((value, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-6 rounded-2xl border border-slate-100"
              >
                <div className="flex items-center gap-3 mb-3">
                  <CheckCircle2 className="w-5 h-5 text-sky-500" />
                  <h4 className="font-bold text-slate-900">{value.title}</h4>
                </div>
                <p className="text-sm text-slate-600">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


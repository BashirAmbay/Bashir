import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Droplets, ShieldCheck, Truck, Clock, ArrowRight, Star } from 'lucide-react';
import heroBg from '../../image/image 1.png';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const stagger = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 bg-slate-50 z-0" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-sky-100 rounded-bl-[100px] opacity-50 z-0 transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-60 z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-2xl"
            >
              <motion.div variants={fadeIn} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-sm font-semibold mb-6">
                <Droplets className="w-4 h-4" />
                Pure, Refreshing, Safe
              </motion.div>
              <motion.h1 variants={fadeIn} className="text-5xl lg:text-7xl font-display font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
                Bin Uthman <span className="text-sky-500">Table Water</span> for Your Family
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg text-slate-600 mb-8 leading-relaxed max-w-xl">
                Experience the pure taste of nature with Bin Uthman Table Water. Filtered to perfection, delivered right to your doorstep with guaranteed freshness and safety.
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-2xl shadow-xl shadow-sky-500/30 transition-all group text-lg">
                  Order Now
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/about" className="inline-flex items-center justify-center px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-2xl border border-slate-200 shadow-sm transition-all text-lg">
                  Learn More
                </Link>
              </motion.div>

              <motion.div variants={fadeIn} className="mt-10 flex items-center gap-4 text-sm font-medium text-slate-500">
                <div className="flex -space-x-2">
                  <div className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-300 border-2 border-white"></div>
                  <div className="w-8 h-8 rounded-full bg-slate-400 border-2 border-white flex items-center justify-center text-[10px] text-white">5k+</div>
                </div>
                <span>Trusted by 5,000+ families</span>
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative hidden lg:block"
            >
              {/* Hero Image Asset */}
              <div className="relative w-full aspect-square max-w-lg mx-auto">
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-300 to-blue-500 rounded-[3rem] rotate-6 shadow-2xl opacity-20 animate-pulse-slow"></div>
                <div className="absolute inset-0 rounded-[3rem] -rotate-3 shadow-2xl overflow-hidden bg-white">
                  <img src={heroBg} alt="Bin Uthman Water" className="w-full h-full object-cover" />
                </div>

                {/* Floating Badge */}
                <div className="absolute -bottom-6 -left-6 glass-panel px-6 py-4 rounded-2xl shadow-xl flex items-center gap-4 animate-float" style={{ animationDelay: '1s' }}>
                  <div className="p-3 bg-green-100 text-green-600 rounded-xl">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">100% Safe</div>
                    <div className="text-sm text-slate-500">NAFDAC Approved</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">Why Choose Bin Uthman?</h2>
            <p className="text-slate-600 text-lg">We combine state-of-the-art purification technology with a commitment to excellent customer service.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Multi-Stage Filtration</h3>
              <p className="text-slate-600 leading-relaxed">Our water passes through rigorous purification processes to remove all impurities, ensuring every drop is safe.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Truck className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Fast & Reliable Delivery</h3>
              <p className="text-slate-600 leading-relaxed">Never run out of water. Our dedicated logistics team ensures your orders reach you promptly and safely.</p>
            </motion.div>

            <motion.div
              whileHover={{ y: -5 }}
              className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">24/7 Customer Support</h3>
              <p className="text-slate-600 leading-relaxed">Have an issue or need to adjust your order? Our support team is always available to assist you.</p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-slate-900 mb-4">Loved by our Customers</h2>
            <p className="text-slate-600 text-lg">Don't just take our word for it.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                <div className="flex text-amber-400 mb-4">
                  {[...Array(5)].map((_, j) => <Star key={j} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 italic mb-6">"The water quality is exceptional. We've been using Bin Uthman for over a year and their delivery service is always on time. Highly recommended!"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center font-bold text-sky-700 text-lg">C</div>
                  <div>
                    <h4 className="font-bold text-slate-900">Customer {i}</h4>
                    <p className="text-sm text-slate-500">Verified Buyer</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-sky-600"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-sky-500 to-blue-700 opacity-90"></div>

        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-sky-300 opacity-20 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">Ready to Experience True Purity?</h2>
          <p className="text-sky-100 text-xl mb-10 max-w-2xl mx-auto">Join thousands of satisfied customers who trust Bin Uthman for their daily hydration needs.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/register" className="px-8 py-4 bg-white text-sky-600 hover:bg-slate-50 font-bold rounded-2xl shadow-xl transition-colors text-lg">
              Create an Account
            </Link>
            <Link to="/contact" className="px-8 py-4 bg-transparent text-white border-2 border-white/30 hover:bg-white/10 font-bold rounded-2xl transition-colors text-lg">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingCart, Droplet, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const products = [
  {
    id: 1,
    name: '500ml Bottled Water (Pack of 12)',
    description: 'Perfect for on-the-go hydration. Easy to carry and environmentally friendly packaging.',
    price: 1500,
    image: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2036&auto=format&fit=crop',
    popular: true
  },
  {
    id: 2,
    name: '750ml Bottled Water (Pack of 12)',
    description: 'The ideal size for your gym bag or daily commute. Stay refreshed all day.',
    price: 2000,
    image: 'https://images.unsplash.com/photo-1622240506921-042a4e71d152?q=80&w=2070&auto=format&fit=crop',
    popular: false
  },
  {
    id: 3,
    name: '1.5L Bottled Water (Pack of 6)',
    description: 'Great for family dinners, small gatherings, or keeping on your desk.',
    price: 1800,
    image: 'https://images.unsplash.com/photo-1547469736-25f0cb723521?q=80&w=1964&auto=format&fit=crop',
    popular: false
  },
  {
    id: 4,
    name: '19L Dispenser Bottle',
    description: 'The standard size for water dispensers in homes and offices. Pure water in bulk.',
    price: 800,
    image: 'https://images.unsplash.com/photo-1564416173200-cb64619d8544?q=80&w=1974&auto=format&fit=crop',
    popular: true
  }
];

export default function Products() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-slate-50">
      
      {/* Header */}
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Our <span className="text-sky-500">Products</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Explore our range of premium water products designed to meet your hydration needs, whether at home, in the office, or on the go.
          </motion.p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
              >
                <div className="relative aspect-square overflow-hidden bg-slate-100 p-8 flex items-center justify-center">
                  {product.popular && (
                    <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-400 text-amber-950 text-xs font-bold uppercase tracking-wide rounded-full flex items-center gap-1 shadow-md">
                      <Star className="w-3 h-3 fill-current" /> Popular
                    </div>
                  )}
                  {/* Fake Image Container */}
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover absolute inset-0 opacity-80 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent mix-blend-overlay"></div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{product.name}</h3>
                  <p className="text-sm text-slate-500 mb-6 flex-1">{product.description}</p>
                  
                  <div className="flex items-center justify-between mt-auto">
                    <div className="text-2xl font-bold text-sky-600">
                      ₦{product.price.toLocaleString()}
                    </div>
                    <Link 
                      to="/login"
                      className="w-12 h-12 rounded-full bg-sky-50 text-sky-600 hover:bg-sky-500 hover:text-white flex items-center justify-center transition-colors group-hover:shadow-md"
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Wholesale Banner */}
      <section className="pb-24">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-sky-600 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-10">
               <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
               <div className="relative z-10 max-w-xl">
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Looking for Wholesale?</h2>
                  <p className="text-sky-100 text-lg mb-0">We offer special pricing for bulk orders, corporate clients, and distributors. Get in touch with our sales team.</p>
               </div>
               <Link to="/contact" className="relative z-10 shrink-0 px-8 py-4 bg-white text-sky-600 hover:bg-slate-50 font-bold rounded-2xl shadow-xl transition-colors">
                  Contact Sales
               </Link>
            </div>
         </div>
      </section>

    </div>
  );
}


import React from 'react';
import { motion } from 'framer-motion';

const images = [
  {
    url: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?q=80&w=2070&auto=format&fit=crop',
    title: 'Purification Plant',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1 md:row-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=2036&auto=format&fit=crop',
    title: 'Quality Control',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1622240506921-042a4e71d152?q=80&w=2070&auto=format&fit=crop',
    title: 'Bottling Process',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    url: 'https://images.unsplash.com/photo-1564416173200-cb64619d8544?q=80&w=1974&auto=format&fit=crop',
    title: 'Dispenser Bottles',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-2'
  },
  {
    url: 'https://images.unsplash.com/photo-1547469736-25f0cb723521?q=80&w=1964&auto=format&fit=crop',
    title: 'Fresh Water',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1'
  }
];

export default function Gallery() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-slate-50">
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Our <span className="text-sky-500">Gallery</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Take a look inside our state-of-the-art facility and see how we bring pure, refreshing water to your table.
          </motion.p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 auto-rows-[250px] gap-4 lg:gap-6">
            {images.map((image, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-3xl overflow-hidden group cursor-pointer ${image.colSpan} ${image.rowSpan}`}
              >
                <img 
                  src={image.url} 
                  alt={image.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-white font-bold text-xl">{image.title}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}


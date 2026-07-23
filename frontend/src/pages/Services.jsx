import React from 'react';
import { motion } from 'framer-motion';
import { Truck, Home, Building2, Store } from 'lucide-react';

const services = [
  {
    icon: <Home className="w-8 h-8" />,
    title: 'Home Delivery',
    description: 'We deliver clean and safe table water right to your doorstep. Schedule regular deliveries so your family never runs out of fresh water.'
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: 'Corporate Supply',
    description: 'Keep your employees hydrated and productive. We provide regular bulk deliveries of dispenser bottles for offices and corporate facilities.'
  },
  {
    icon: <Store className="w-8 h-8" />,
    title: 'Wholesale & Distribution',
    description: 'Partner with us to distribute Bin Uthman Water in your area. We offer competitive pricing for distributors and retail partners.'
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: 'Event Catering',
    description: 'Hosting a wedding, conference, or party? Let us handle the hydration. We supply custom quantities of bottled water for events of any size.'
  }
];

export default function Services() {
  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-white">
      
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Our <span className="text-sky-500">Services</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            More than just great water. We provide tailored services to ensure you get exactly what you need, when you need it.
          </motion.p>
        </div>
      </section>

      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {services.map((service, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="bg-slate-50 p-8 lg:p-10 rounded-[2rem] border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-bl-[100px] opacity-50 transform translate-x-1/4 -translate-y-1/4 group-hover:scale-110 transition-transform"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm text-sky-600 flex items-center justify-center mb-6">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{service.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed mb-6">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
    </div>
  );
}


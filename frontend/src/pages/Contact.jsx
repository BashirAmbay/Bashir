import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'react-toastify';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(contactSchema)
  });

  const onSubmit = async (data) => {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Form data:', data);
        toast.success("Message sent successfully! We'll get back to you soon.");
        reset();
        resolve();
      }, 1500);
    });
  };

  return (
    <div className="flex flex-col min-h-screen pt-24 pb-12 bg-slate-50">
      
      {/* Header */}
      <section className="py-16 text-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="text-4xl lg:text-5xl font-display font-bold text-slate-900 mb-4"
          >
            Get in <span className="text-sky-500">Touch</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 max-w-2xl mx-auto"
          >
            Have questions about our products, delivery, or wholesale options? We're here to help.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Info */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1 space-y-8"
            >
              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-sky-50 rounded-2xl flex items-center justify-center text-sky-600 mb-6">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Our Location</h3>
                <p className="text-slate-600 leading-relaxed">
                  123 Waterway Avenue,<br />
                  Hydration City, HC 12345
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Call Us</h3>
                <p className="text-slate-600 leading-relaxed">
                  +1 (555) 123-4567<br />
                  Mon-Fri, 8:00 AM - 6:00 PM
                </p>
              </div>

              <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6">
                  <Mail className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Email Us</h3>
                <p className="text-slate-600 leading-relaxed">
                  hello@binuthmanwater.com<br />
                  support@binuthmanwater.com
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="lg:col-span-2"
            >
              <div className="bg-white p-8 md:p-12 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-sky-50 rounded-bl-full opacity-50 z-0"></div>
                
                <form onSubmit={handleSubmit(onSubmit)} className="relative z-10 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        id="name"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.name ? 'border-red-300' : 'border-slate-200'}`}
                        placeholder="John Doe"
                        {...register('name')}
                      />
                      {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        id="email"
                        className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.email ? 'border-red-300' : 'border-slate-200'}`}
                        placeholder="john@example.com"
                        {...register('email')}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors ${errors.subject ? 'border-red-300' : 'border-slate-200'}`}
                      placeholder="How can we help you?"
                      {...register('subject')}
                    />
                    {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
                    <textarea
                      id="message"
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border bg-slate-50 focus:bg-white focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors resize-none ${errors.message ? 'border-red-300' : 'border-slate-200'}`}
                      placeholder="Your message here..."
                      {...register('message')}
                    ></textarea>
                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-xl shadow-lg shadow-sky-500/30 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        Send Message
                        <Send className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}


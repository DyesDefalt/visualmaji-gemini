'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Clock, Send, MessageSquare, Loader2 } from 'lucide-react';
import { Header, Footer, CustomCursor, MagneticButton } from '../../components/Layout';

const CONTACT_INFO = [
  {
    icon: Mail,
    title: 'Email',
    value: 'hello@visualmaji.com',
    description: 'For general inquiries',
  },
  {
    icon: MapPin,
    title: 'Location',
    value: 'San Francisco, CA',
    description: 'Our headquarters',
  },
  {
    icon: Phone,
    title: 'Phone',
    value: '+1 (555) 123-4567',
    description: 'Mon-Fri, 9am-6pm PST',
  },
  {
    icon: Clock,
    title: 'Response Time',
    value: '< 24 hours',
    description: 'For support requests',
  },
];

const FAQ_ITEMS = [
  {
    q: 'How do I get started with VIMA?',
    a: 'Simply create a free account, upload your first image, and let our AI analyze it. You\'ll receive structured metadata and prompt suggestions within seconds.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. We use enterprise-grade encryption and never store your images longer than necessary for analysis. Your data privacy is our top priority.',
  },
  {
    q: 'Can I use VIMA for commercial projects?',
    a: 'Yes! All our plans, including the free tier, allow commercial use of the generated prompts and metadata.',
  },
  {
    q: 'Do you offer enterprise plans?',
    a: 'Yes, we offer custom enterprise solutions with dedicated support, API access, and volume pricing. Contact us to learn more.',
  },
];

export default function Contact() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setLoading(false);
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 overflow-x-hidden selection:bg-amber-200">
      <CustomCursor cursorVariant={cursorVariant} cursorText={cursorText} />
      
      <Header setCursorVariant={setCursorVariant} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="inline-block border border-stone-900 text-stone-700 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Contact Us
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              Let&apos;s start a conversation
            </h1>
            <p className="text-xl text-stone-600 max-w-2xl mx-auto">
              Have questions about VIMA? Want to discuss enterprise solutions? We&apos;d love to hear from you.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-12 px-6 md:px-12 -mt-10">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {CONTACT_INFO.map((info, index) => (
              <motion.div
                key={info.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-stone-200"
              >
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center mb-4">
                  <info.icon className="text-amber-700" size={24} />
                </div>
                <h3 className="font-bold text-lg mb-1">{info.title}</h3>
                <p className="text-stone-900 font-medium">{info.value}</p>
                <p className="text-stone-500 text-sm">{info.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & FAQ */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="text-amber-600" size={24} />
                <h2 className="text-2xl font-bold">Send us a message</h2>
              </div>

              {submitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Send className="text-green-600" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-green-900 mb-2">Message Sent!</h3>
                  <p className="text-green-700">
                    Thank you for reaching out. We&apos;ll get back to you within 24 hours.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="text-sm font-medium text-stone-700 mb-2 block">Name</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-stone-700 mb-2 block">Email</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Subject</label>
                    <input
                      type="text"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-500 transition-colors"
                      placeholder="How can we help?"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-stone-700 mb-2 block">Message</label>
                    <textarea
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-3 text-stone-900 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white py-4 rounded-xl font-bold text-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={24} />
                    ) : (
                      <>
                        Send Message
                        <Send size={20} />
                      </>
                    )}
                  </button>
                </form>
              )}
            </motion.div>


            {/* FAQ */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              <div className="space-y-4">
                {FAQ_ITEMS.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 border border-stone-200"
                  >
                    <h3 className="font-bold text-lg mb-2">{item.q}</h3>
                    <p className="text-stone-600">{item.a}</p>
                  </motion.div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-stone-950 rounded-2xl text-white">
                <h3 className="font-bold text-lg mb-2">Need immediate help?</h3>
                <p className="text-stone-400 mb-4">
                  Check out our comprehensive documentation and guides.
                </p>
                <MagneticButton
                  href="/articles"
                  className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
                  setCursorVariant={setCursorVariant}
                >
                  Browse Articles
                </MagneticButton>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Target, Rocket, Award } from 'lucide-react';
import { Header, Footer, CustomCursor, MagneticButton } from '../../components/Layout';

const TEAM_MEMBERS = [
  {
    name: 'Alex Chen',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
    bio: 'Former creative director with 10+ years in digital advertising.',
  },
  {
    name: 'Sarah Miller',
    role: 'Head of AI',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop',
    bio: 'PhD in Computer Vision from MIT, passionate about ethical AI.',
  },
  {
    name: 'Marcus Johnson',
    role: 'Lead Designer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=400&auto=format&fit=crop',
    bio: 'Award-winning designer focused on human-centered experiences.',
  },
  {
    name: 'Emily Zhang',
    role: 'Product Lead',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop',
    bio: 'Building products that empower creative professionals worldwide.',
  },
];

const VALUES = [
  {
    icon: Target,
    title: 'Precision',
    description: 'We believe in delivering accurate, reliable results that creative professionals can trust.',
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building tools that empower designers, marketers, and creative minds everywhere.',
  },
  {
    icon: Rocket,
    title: 'Innovation',
    description: 'Pushing the boundaries of AI to solve real creative challenges.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to the highest standards in everything we create.',
  },
];

export default function About() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');


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
              About Us
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              We&apos;re building the future of creative analysis
            </h1>
            <p className="text-xl text-stone-600 max-w-3xl mx-auto">
              Visual Maji was founded on a simple belief: creative professionals deserve tools that understand the art and science behind compelling visuals.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-6 md:px-12 bg-stone-950 text-white rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="border border-white/30 rounded-full px-3 py-1 text-xs uppercase tracking-wider mb-6 inline-block">
                Our Story
              </span>
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                From frustration to innovation
              </h2>
              <div className="space-y-4 text-stone-400 text-lg">
                <p>
                  We started Visual Maji in 2024 after experiencing firsthand the challenges creative teams face when trying to understand and replicate successful ad designs.
                </p>
                <p>
                  Traditional approaches required hours of manual analysis, guesswork, and countless iterations. We knew there had to be a better way.
                </p>
                <p>
                  By combining cutting-edge AI vision technology with deep creative industry expertise, we built VIMA – a tool that transforms how professionals decode visual excellence.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop"
                alt="Team working"
                className="rounded-3xl shadow-2xl"
              />
              <div className="absolute -bottom-8 -left-8 bg-amber-600 text-white p-6 rounded-2xl shadow-xl">
                <p className="text-4xl font-bold">2024</p>
                <p className="text-sm opacity-80">Founded</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-6 md:px-12 bg-stone-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="border border-stone-900 rounded-full px-4 py-1 text-sm uppercase tracking-wider font-medium">
              Our Values
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-6">
              What drives us forward
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 shadow-sm border border-stone-200 hover:shadow-lg transition-shadow"
              >
                <div className="w-14 h-14 bg-amber-100 rounded-xl flex items-center justify-center mb-6">
                  <value.icon className="text-amber-700" size={28} />
                </div>
                <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                <p className="text-stone-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Team Section */}
      <section className="py-20 px-6 md:px-12 bg-stone-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="border border-stone-900 rounded-full px-4 py-1 text-sm uppercase tracking-wider font-medium">
              Our Team
            </span>
            <h2 className="text-3xl md:text-5xl font-bold mt-6">
              Meet the people behind VIMA
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {TEAM_MEMBERS.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group"
                onMouseEnter={() => {
                  setCursorVariant('text');
                  setCursorText('Hello!');
                }}
                onMouseLeave={() => {
                  setCursorVariant('default');
                  setCursorText('');
                }}
              >
                <div className="relative overflow-hidden rounded-2xl mb-4 aspect-square">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="text-xl font-bold">{member.name}</h3>
                <p className="text-amber-700 font-medium mb-2">{member.role}</p>
                <p className="text-stone-600 text-sm">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-stone-950">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Join us on our mission
            </h2>
            <p className="text-xl text-stone-400 mb-8 max-w-xl mx-auto">
              We&apos;re always looking for talented people who share our passion for creativity and innovation.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <MagneticButton
                href="/contact"
                className="bg-amber-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-amber-700 transition-colors"
                setCursorVariant={setCursorVariant}
              >
                Get in Touch
              </MagneticButton>
              <MagneticButton
                href="/pricing"
                className="border border-white/20 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-white/10 transition-colors"
                setCursorVariant={setCursorVariant}
              >
                View Pricing
              </MagneticButton>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

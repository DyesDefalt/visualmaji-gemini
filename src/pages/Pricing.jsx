import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Crown, Building2, Sparkles } from 'lucide-react';
import { Header, Footer, CustomCursor, MagneticButton } from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const PRICING_TIERS = [
  {
    name: 'Free',
    icon: Sparkles,
    subtitle: 'Get started',
    price: 0,
    period: 'forever',
    features: [
      '3 analyses per day',
      'Max 1080p resolution',
      '10 analyses per month',
      'Basic JSON output',
      'Standard support',
    ],
    cta: 'Start Free',
    popular: false,
    color: 'stone',
  },
  {
    name: 'Lite',
    icon: Zap,
    subtitle: 'For hobbyists',
    price: 1.99,
    nextPrice: 4.99,
    period: 'month',
    features: [
      '50 analyses per month',
      'Up to 4K resolution',
      'Priority processing',
      'Advanced JSON output',
      'Email support',
    ],
    cta: 'Get Lite',
    popular: false,
    color: 'warm',
  },
  {
    name: 'Standard',
    icon: Star,
    subtitle: 'Most popular',
    price: 3.99,
    nextPrice: 9.99,
    period: 'month',
    features: [
      '100 analyses per month',
      'Up to 4K resolution',
      'Priority processing',
      'Full JSON + Prompt output',
      'Priority email support',
    ],
    cta: 'Get Standard',
    popular: true,
    color: 'amber',
  },
  {
    name: 'Creator',
    icon: Crown,
    subtitle: 'For professionals',
    price: 5.99,
    nextPrice: 14.99,
    period: 'month',
    features: [
      '200 analyses per month',
      'Up to 8K resolution',
      'Fastest processing',
      'Full JSON + Prompt + History',
      'Credits carry over',
      'Priority support',
    ],
    cta: 'Get Creator',
    popular: false,
    color: 'earth',
  },
  {
    name: 'Business',
    icon: Building2,
    subtitle: 'For teams & agencies',
    price: 9.99,
    nextPrice: 24.99,
    period: 'month',
    features: [
      'Unlimited analyses',
      'Up to 8K resolution',
      'Fastest priority processing',
      'Full JSON + Prompt + History',
      'Credits carry over',
      'API access',
      'Dedicated support',
    ],
    cta: 'Get Business',
    popular: false,
    color: 'dark',
  },
];

const PricingCard = ({ tier, setCursorVariant }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const Icon = tier.icon;

  const colorClasses = {
    stone: 'from-stone-500 to-stone-700',
    warm: 'from-stone-600 to-stone-800',
    amber: 'from-amber-500 to-amber-700',
    earth: 'from-amber-700 to-stone-800',
    dark: 'from-stone-800 to-stone-950',
  };

  const handleClick = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/login', { state: { plan: tier.name.toLowerCase() } });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`relative bg-white/5 backdrop-blur-xl rounded-3xl p-8 border ${
        tier.popular 
          ? 'border-amber-500 shadow-2xl shadow-amber-500/20 scale-105' 
          : 'border-white/10'
      }`}
    >
      {tier.popular && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2">
          <span className="bg-gradient-to-r from-amber-500 to-amber-700 text-white px-4 py-1 rounded-full text-sm font-bold">
            Most Popular
          </span>
        </div>
      )}

      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClasses[tier.color]} flex items-center justify-center mb-6`}>
        <Icon className="text-white" size={28} />
      </div>

      <h3 className="text-2xl font-bold text-white mb-1">{tier.name}</h3>
      <p className="text-stone-400 text-sm mb-6">{tier.subtitle}</p>

      <div className="mb-6">
        {tier.price === 0 ? (
          <div className="flex items-end gap-1">
            <span className="text-5xl font-bold text-white">Free</span>
          </div>
        ) : (
          <>
            <div className="flex items-end gap-1">
              <span className="text-5xl font-bold text-white">${tier.price}</span>
              <span className="text-stone-400 mb-2">/{tier.period}</span>
            </div>
            {tier.nextPrice && (
              <p className="text-sm text-stone-500 mt-1">
                First month only, then ${tier.nextPrice}/{tier.period}
              </p>
            )}
          </>
        )}
      </div>

      <ul className="space-y-3 mb-8">
        {tier.features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3 text-stone-300">
            <Check className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <MagneticButton
        onClick={handleClick}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
          tier.popular
            ? 'bg-gradient-to-r from-amber-500 to-amber-700 text-white hover:shadow-lg hover:shadow-amber-500/30'
            : 'bg-white/10 text-white hover:bg-white/20'
        }`}
        setCursorVariant={setCursorVariant}
      >
        {tier.cta}
      </MagneticButton>
    </motion.div>
  );
};

export default function Pricing() {
  const [cursorVariant, setCursorVariant] = useState('default');
  const [cursorText, setCursorText] = useState('');

  return (
    <div className="min-h-screen bg-stone-950 font-sans text-white overflow-x-hidden selection:bg-amber-200">
      <CustomCursor cursorVariant={cursorVariant} cursorText={cursorText} />
      
      <Header setCursorVariant={setCursorVariant} />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block border border-amber-500/50 text-amber-400 px-4 py-1 rounded-full text-sm font-medium mb-6">
              Simple, transparent pricing
            </span>
            <h1 className="text-4xl md:text-7xl font-bold mb-6">
              Choose your plan
            </h1>
            <p className="text-xl text-stone-400 max-w-2xl mx-auto">
              Start free and upgrade as you grow. All plans include our core AI vision technology for prompt reverse engineering.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Grid */}
      <section className="pb-32 px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {PRICING_TIERS.map((tier) => (
              <PricingCard 
                key={tier.name} 
                tier={tier} 
                setCursorVariant={setCursorVariant} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-6 md:px-12 bg-stone-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold text-center mb-16">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            {[
              {
                q: 'What counts as one analysis?',
                a: 'Each image upload and analysis counts as one analysis. Re-analyzing with different settings on the same image also counts as a new analysis.',
              },
              {
                q: 'What does "credits carry over" mean?',
                a: 'For Creator and Business plans, unused analyses from the current month will be added to your next month\'s quota. Free, Lite, and Standard plans reset monthly.',
              },
              {
                q: 'Can I cancel anytime?',
                a: 'Yes! You can cancel your subscription at any time. You\'ll continue to have access until the end of your billing period.',
              },
              {
                q: 'What\'s the resolution limit?',
                a: 'Free tier is limited to 1080p. Paid tiers support higher resolutions for more detailed analysis - up to 4K for Lite/Standard and 8K for Creator/Business.',
              },
              {
                q: 'Do you offer refunds?',
                a: 'We offer a 7-day money-back guarantee for all paid plans. If you\'re not satisfied, contact our support team.',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-stone-900 rounded-2xl p-6 border border-stone-800"
              >
                <h3 className="text-xl font-bold mb-3">{item.q}</h3>
                <p className="text-stone-400">{item.a}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-r from-amber-600 to-amber-800 rounded-3xl p-12 md:p-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to get started?
            </h2>
            <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of creative professionals using VIMA to reverse engineer visual excellence.
            </p>
            <MagneticButton
              to="/login"
              className="bg-white text-stone-900 px-10 py-5 rounded-full text-xl font-bold hover:bg-stone-100 transition-colors"
              setCursorVariant={setCursorVariant}
            >
              Start for Free
            </MagneticButton>
          </motion.div>
        </div>
      </section>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

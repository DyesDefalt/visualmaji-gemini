'use client';

import { useState } from 'react';
import { Header, Footer, CustomCursor } from '../../../components/Layout';

export default function CookiePolicy() {
  const [cursorVariant, setCursorVariant] = useState('default');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <CustomCursor cursorVariant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 mb-4">Last updated: December 7, 2025</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Cookie Policy</h1>

          <div className="prose prose-stone prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-stone-600 leading-relaxed">
                This Cookie Policy explains how Visual Maji (VIMA) uses cookies and similar tracking technologies when you visit our website and use our AI-powered creative analysis tool. By using VIMA, you consent to the use of cookies as described in this policy.
              </p>
            </section>

            {/* What Are Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">1. What Are Cookies</h2>
              <p className="text-stone-600 mb-4">
                Cookies are small text files that are stored on your device when you visit a website. They help websites remember your preferences, understand how you use the site, and improve your overall experience.
              </p>
              <p className="text-stone-600">
                Cookies can be &quot;persistent&quot; (remaining on your device until deleted) or &quot;session&quot; cookies (deleted when you close your browser). They can also be &quot;first-party&quot; (set by VIMA) or &quot;third-party&quot; (set by our partners and service providers).
              </p>
            </section>

            {/* Cookie Types */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">2. Cookie Types</h2>
              <p className="text-stone-600 mb-4">
                We use different types of cookies to operate and improve our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.1 Essential Cookies</h3>
              <p className="text-stone-600 mb-4">
                These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and account authentication. You cannot opt out of essential cookies as they are required for the service to operate.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.2 Performance Cookies</h3>
              <p className="text-stone-600 mb-4">
                Performance cookies collect information about how you use our website, such as which pages you visit most often and if you receive error messages. This data helps us improve how our website works and understand user behavior patterns.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.3 Functionality Cookies</h3>
              <p className="text-stone-600 mb-4">
                These cookies allow our website to remember choices you make, such as your language preference, region, or display settings. They provide enhanced, personalized features and help us remember your preferences for future visits.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.4 Analytics Cookies</h3>
              <p className="text-stone-600">
                We use analytics cookies to understand how visitors interact with our website. These cookies help us measure and analyze traffic patterns, identify popular content, and improve our services based on aggregated usage data.
              </p>
            </section>

            {/* Cookie Purposes */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">3. Cookie Purposes</h2>
              <p className="text-stone-600 mb-4">
                We use cookies for the following purposes:
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.1 Authentication and Security</h3>
              <p className="text-stone-600 mb-4">
                Cookies help us verify your account and determine when you are logged in, so we can make it easier for you to access VIMA and show you the appropriate experience and features. They also help protect your account from unauthorized access.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.2 Preferences and Settings</h3>
              <p className="text-stone-600 mb-4">
                Cookies enable us to remember your settings and preferences, such as your preferred language, region, and accessibility options. This allows us to provide you with a consistent experience across sessions.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.3 Analytics and Research</h3>
              <p className="text-stone-600 mb-4">
                We use cookies to understand, improve, and research our products and services. This includes analyzing how users interact with VIMA, measuring the effectiveness of our features, and identifying areas for improvement.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.4 Performance Optimization</h3>
              <p className="text-stone-600">
                Cookies help us route traffic between servers and understand how quickly VIMA loads for different users. This allows us to optimize performance and ensure a smooth user experience.
              </p>
            </section>

            {/* Management Options */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">4. Management Options</h2>
              <p className="text-stone-600 mb-4">
                You have several options for managing cookies on your device.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.1 Browser Settings</h3>
              <p className="text-stone-600 mb-4">
                Most web browsers allow you to control cookies through their settings. You can typically set your browser to block all cookies, accept all cookies, or notify you when a cookie is set. The process varies by browser, so consult your browser&apos;s help documentation for specific instructions.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.2 Cookie Preferences</h3>
              <p className="text-stone-600 mb-4">
                You can manage your cookie preferences for non-essential cookies through our cookie consent banner when you first visit VIMA. You can update these preferences at any time through your account settings.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.3 Opt-Out Tools</h3>
              <p className="text-stone-600 mb-4">
                For analytics cookies, you can opt out of tracking by using browser extensions or visiting the opt-out pages provided by our analytics partners. Note that opting out may affect your experience with certain features.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.4 Impact of Disabling Cookies</h3>
              <p className="text-stone-600">
                If you choose to disable cookies, some features of VIMA may not function properly. Essential cookies cannot be disabled as they are required for the basic operation of our service. We recommend keeping essential and functionality cookies enabled for the best experience.
              </p>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">5. Third-Party Cookies</h2>
              <p className="text-stone-600 mb-4">
                Some cookies on our website are set by third-party services that appear on our pages.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.1 Analytics Providers</h3>
              <p className="text-stone-600 mb-4">
                We use third-party analytics services to help us understand how users interact with VIMA. These services may set their own cookies to collect information about your browsing activities across different websites.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.2 Payment Processors</h3>
              <p className="text-stone-600 mb-4">
                When you make a payment, our payment processor may set cookies to facilitate the transaction and prevent fraud. These cookies are subject to the payment processor&apos;s own privacy and cookie policies.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.3 Third-Party Control</h3>
              <p className="text-stone-600">
                We do not control third-party cookies. We encourage you to review the privacy and cookie policies of any third-party services you interact with through VIMA.
              </p>
            </section>

            {/* Updates and Contact */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">6. Updates and Contact</h2>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">6.1 Policy Updates</h3>
              <p className="text-stone-600 mb-4">
                We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website with a new &quot;Last updated&quot; date.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">6.2 Contact Us</h3>
              <p className="text-stone-600">
                If you have any questions about our use of cookies or this Cookie Policy, please contact us at privacy@visualmaji.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

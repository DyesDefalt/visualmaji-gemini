'use client';

import { useState } from 'react';
import { Header, Footer, CustomCursor } from '../../../components/Layout';

export default function PrivacyPolicy() {
  const [cursorVariant, setCursorVariant] = useState('default');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <CustomCursor cursorVariant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 mb-4">Last updated: December 7, 2025</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Privacy Policy</h1>

          <div className="prose prose-stone prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-stone-600 leading-relaxed">
                At Visual Maji (VIMA), we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, store, share, and protect your data when you use our AI-powered creative analysis tool.
              </p>
            </section>

            {/* Data Collection */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">1. Data Collection</h2>
              <p className="text-stone-600 mb-4">
                We collect information that you provide directly to us and information that is automatically collected when you use our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.1 Information You Provide</h3>
              <p className="text-stone-600 mb-4">
                When you create an account, we collect your name, email address, and password. If you subscribe to a paid plan, we collect payment information through our secure payment processor. We also collect any content you upload for analysis.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.2 Automatically Collected Information</h3>
              <p className="text-stone-600 mb-4">
                We automatically collect certain information when you access VIMA, including your IP address, browser type, device information, operating system, and usage patterns. This helps us improve our services and provide a better user experience.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.3 Cookies and Tracking Technologies</h3>
              <p className="text-stone-600">
                We use cookies and similar tracking technologies to collect information about your browsing activities. For more details, please refer to our Cookie Policy.
              </p>
            </section>

            {/* Data Usage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">2. Data Usage</h2>
              <p className="text-stone-600 mb-4">
                We use the information we collect for various purposes to provide, maintain, and improve our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.1 Service Provision</h3>
              <p className="text-stone-600 mb-4">
                We use your information to provide our AI-powered analysis services, process your requests, and deliver the results you expect. This includes analyzing uploaded content and generating structured metadata.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.2 Account Management</h3>
              <p className="text-stone-600 mb-4">
                We use your account information to manage your subscription, process payments, send service-related communications, and provide customer support.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.3 Service Improvement</h3>
              <p className="text-stone-600 mb-4">
                We analyze usage patterns and feedback to improve our AI algorithms, enhance user experience, and develop new features. This analysis is performed on aggregated, anonymized data whenever possible.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.4 Communications</h3>
              <p className="text-stone-600">
                We may use your email address to send you important updates about our services, security alerts, and promotional materials. You can opt out of promotional communications at any time.
              </p>
            </section>

            {/* Data Storage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">3. Data Storage</h2>
              <p className="text-stone-600 mb-4">
                We implement appropriate technical and organizational measures to protect your personal information.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.1 Storage Location</h3>
              <p className="text-stone-600 mb-4">
                Your data is stored on secure servers located in data centers with industry-standard security measures. We may transfer data internationally in compliance with applicable data protection laws.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.2 Retention Period</h3>
              <p className="text-stone-600 mb-4">
                We retain your personal information for as long as your account is active or as needed to provide you services. Uploaded content is retained according to your subscription plan settings. You may request deletion of your data at any time.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.3 Security Measures</h3>
              <p className="text-stone-600">
                We use encryption, access controls, and regular security audits to protect your data. However, no method of transmission over the Internet is completely secure, and we cannot guarantee absolute security.
              </p>
            </section>

            {/* Data Sharing */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">4. Data Sharing</h2>
              <p className="text-stone-600 mb-4">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.1 Service Providers</h3>
              <p className="text-stone-600 mb-4">
                We share information with third-party service providers who assist us in operating our platform, processing payments, and providing customer support. These providers are contractually obligated to protect your information.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.2 Legal Requirements</h3>
              <p className="text-stone-600 mb-4">
                We may disclose your information if required by law, court order, or government request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.3 Business Transfers</h3>
              <p className="text-stone-600">
                In the event of a merger, acquisition, or sale of assets, your information may be transferred to the acquiring entity. We will notify you of any such change and any choices you may have regarding your information.
              </p>
            </section>

            {/* User Rights */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">5. User Rights</h2>
              <p className="text-stone-600 mb-4">
                You have certain rights regarding your personal information, subject to applicable laws.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.1 Access and Portability</h3>
              <p className="text-stone-600 mb-4">
                You have the right to access the personal information we hold about you and to receive a copy of your data in a portable format. You can request this through your account settings or by contacting us.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.2 Correction and Update</h3>
              <p className="text-stone-600 mb-4">
                You have the right to correct or update inaccurate personal information. You can update most information directly through your account settings.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.3 Deletion</h3>
              <p className="text-stone-600 mb-4">
                You have the right to request deletion of your personal information. Upon request, we will delete your data unless we are required to retain it for legal or legitimate business purposes.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.4 Opt-Out</h3>
              <p className="text-stone-600 mb-4">
                You can opt out of promotional communications by clicking the unsubscribe link in our emails or updating your communication preferences in your account settings.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.5 Contact</h3>
              <p className="text-stone-600">
                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at privacy@visualmaji.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

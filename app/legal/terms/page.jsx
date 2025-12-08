'use client';

import { useState } from 'react';
import { Header, Footer, CustomCursor } from '../../../components/Layout';

export default function TermsOfService() {
  const [cursorVariant, setCursorVariant] = useState('default');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <CustomCursor cursorVariant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 mb-4">Last updated: December 7, 2025</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Terms of Service</h1>

          <div className="prose prose-stone prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-stone-600 leading-relaxed">
                Welcome to Visual Maji (VIMA). These Terms of Service govern your access to and use of our AI-powered creative analysis tool. By accessing or using VIMA, you agree to be bound by these terms. Please read them carefully before using our services.
              </p>
            </section>

            {/* Service Usage */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">1. Service Usage</h2>
              <p className="text-stone-600 mb-4">
                VIMA provides prompt reverse engineering services that analyze visual content and generate structured metadata. Our service is designed for creative professionals seeking to understand and recreate visual styles in a compliant manner.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.1 Eligibility</h3>
              <p className="text-stone-600 mb-4">
                You must be at least 18 years old to use VIMA. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into these terms.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.2 Account Registration</h3>
              <p className="text-stone-600 mb-4">
                To access certain features, you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.3 Service Availability</h3>
              <p className="text-stone-600">
                We strive to maintain continuous service availability but do not guarantee uninterrupted access. We may modify, suspend, or discontinue any aspect of the service at any time without prior notice.
              </p>
            </section>

            {/* User Responsibilities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">2. User Responsibilities</h2>
              <p className="text-stone-600 mb-4">
                As a user of VIMA, you agree to use our services responsibly and in compliance with all applicable laws and regulations.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.1 Acceptable Use</h3>
              <p className="text-stone-600 mb-4">
                You agree to use VIMA only for lawful purposes and in accordance with these terms. You shall not use the service to analyze content that you do not have the right to use or that infringes on the rights of others.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.2 Content Ownership</h3>
              <p className="text-stone-600 mb-4">
                You retain ownership of any content you upload to VIMA. However, you grant us a limited license to process and analyze your content solely for the purpose of providing our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.3 Prohibited Activities</h3>
              <p className="text-stone-600">
                You shall not attempt to reverse engineer, decompile, or disassemble any part of our service. You shall not use automated systems to access the service in a manner that exceeds reasonable use or circumvents usage limits.
              </p>
            </section>

            {/* Intellectual Property */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">3. Intellectual Property</h2>
              <p className="text-stone-600 mb-4">
                All intellectual property rights in VIMA, including but not limited to software, algorithms, designs, and trademarks, are owned by Visual Maji or its licensors.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.1 VIMA Ownership</h3>
              <p className="text-stone-600 mb-4">
                The VIMA platform, including its AI technology, user interface, and all related documentation, is protected by copyright, trademark, and other intellectual property laws. You may not copy, modify, or distribute any part of our service without prior written consent.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.2 Output Ownership</h3>
              <p className="text-stone-600 mb-4">
                The structured metadata and analysis outputs generated by VIMA based on your uploaded content are provided for your use. You may use these outputs for your creative projects, subject to applicable third-party rights.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.3 Feedback</h3>
              <p className="text-stone-600">
                Any feedback, suggestions, or ideas you provide regarding VIMA may be used by us without any obligation to compensate you. By submitting feedback, you grant us a perpetual, irrevocable license to use such feedback.
              </p>
            </section>

            {/* Liability Limitations */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">4. Liability Limitations</h2>
              <p className="text-stone-600 mb-4">
                To the maximum extent permitted by law, VIMA and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.1 Service Disclaimer</h3>
              <p className="text-stone-600 mb-4">
                VIMA is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied. We do not warrant that the service will be error-free, secure, or uninterrupted.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.2 Analysis Accuracy</h3>
              <p className="text-stone-600 mb-4">
                While we strive for accuracy in our AI-powered analysis, we do not guarantee the completeness or accuracy of any output. You are responsible for verifying the suitability of any analysis results for your intended use.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.3 Third-Party Content</h3>
              <p className="text-stone-600 mb-4">
                VIMA is not responsible for any third-party content you analyze or any claims arising from your use of analysis outputs. You are solely responsible for ensuring your use of outputs complies with applicable laws and third-party rights.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.4 Maximum Liability</h3>
              <p className="text-stone-600">
                In no event shall our total liability exceed the amount you paid to us in the twelve months preceding the claim, or $100, whichever is greater.
              </p>
            </section>

            {/* General Terms */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">5. General Terms</h2>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.1 Modifications</h3>
              <p className="text-stone-600 mb-4">
                We reserve the right to modify these terms at any time. We will notify you of material changes by posting the updated terms on our website. Your continued use of VIMA after such changes constitutes acceptance of the modified terms.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.2 Termination</h3>
              <p className="text-stone-600 mb-4">
                We may terminate or suspend your access to VIMA at any time, with or without cause, and with or without notice. Upon termination, your right to use the service will immediately cease.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.3 Governing Law</h3>
              <p className="text-stone-600 mb-4">
                These terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Visual Maji operates, without regard to conflict of law principles.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.4 Contact</h3>
              <p className="text-stone-600">
                If you have any questions about these Terms of Service, please contact us at hello@visualmaji.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

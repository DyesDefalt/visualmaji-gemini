'use client';

import { useState } from 'react';
import { Header, Footer, CustomCursor } from '../../../components/Layout';

export default function AcceptableUsePolicy() {
  const [cursorVariant, setCursorVariant] = useState('default');

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900">
      <CustomCursor cursorVariant={cursorVariant} />
      <Header setCursorVariant={setCursorVariant} />

      <main className="pt-32 pb-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          <p className="text-stone-500 mb-4">Last updated: December 7, 2025</p>
          <h1 className="text-4xl md:text-5xl font-bold mb-8">Acceptable Use Policy</h1>

          <div className="prose prose-stone prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-12">
              <p className="text-lg text-stone-600 leading-relaxed">
                This Acceptable Use Policy outlines the rules and guidelines for using Visual Maji (VIMA). By accessing or using our AI-powered creative analysis tool, you agree to comply with this policy. We are committed to maintaining a safe, respectful, and productive environment for all users.
              </p>
            </section>

            {/* Permitted Uses */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">1. Permitted Uses</h2>
              <p className="text-stone-600 mb-4">
                VIMA is designed to help creative professionals analyze visual content and generate structured metadata for legitimate creative purposes.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.1 Authorized Activities</h3>
              <p className="text-stone-600 mb-4">
                You may use VIMA for the following purposes:
              </p>
              <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
                <li>Analyzing visual content that you own or have proper authorization to use</li>
                <li>Generating prompts and metadata for your own creative projects</li>
                <li>Learning and understanding visual styles and techniques</li>
                <li>Educational and research purposes in compliance with applicable laws</li>
                <li>Commercial projects where you have the necessary rights and permissions</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.2 Content Requirements</h3>
              <p className="text-stone-600 mb-4">
                All content you upload or analyze through VIMA must be content that you have the legal right to use. This includes content you created, content you have licensed, or content that is in the public domain.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">1.3 Fair Use</h3>
              <p className="text-stone-600">
                We support the responsible use of our platform for purposes that may qualify as fair use under applicable copyright laws, such as commentary, criticism, education, and research. However, you are responsible for ensuring your use complies with all applicable laws.
              </p>
            </section>

            {/* Prohibited Activities */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">2. Prohibited Activities</h2>
              <p className="text-stone-600 mb-4">
                The following activities are strictly prohibited when using VIMA. Engaging in any of these activities may result in immediate termination of your account and potential legal action.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.1 Illegal Content and Activities</h3>
              <p className="text-stone-600 mb-4">
                You shall not use VIMA to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
                <li>Upload, analyze, or generate content that is illegal in any jurisdiction</li>
                <li>Create or distribute content depicting child exploitation or abuse</li>
                <li>Engage in fraud, identity theft, or other deceptive practices</li>
                <li>Violate any applicable local, state, national, or international law</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.2 Intellectual Property Violations</h3>
              <p className="text-stone-600 mb-4">
                You shall not use VIMA to:
              </p>
              <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
                <li>Infringe upon copyrights, trademarks, or other intellectual property rights</li>
                <li>Analyze content without proper authorization from the rights holder</li>
                <li>Create derivative works that violate third-party rights</li>
                <li>Circumvent digital rights management or copy protection measures</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.3 Harmful Content</h3>
              <p className="text-stone-600 mb-4">
                You shall not use VIMA to create, upload, or analyze:
              </p>
              <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
                <li>Content that promotes violence, hatred, or discrimination</li>
                <li>Harassment, bullying, or threatening material</li>
                <li>Misinformation or disinformation intended to deceive</li>
                <li>Content designed to harm individuals or groups</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.4 System Abuse</h3>
              <p className="text-stone-600 mb-4">
                You shall not:
              </p>
              <ul className="list-disc pl-6 text-stone-600 mb-4 space-y-2">
                <li>Attempt to gain unauthorized access to VIMA systems or user accounts</li>
                <li>Use automated tools to scrape, crawl, or extract data from our platform</li>
                <li>Interfere with or disrupt the integrity or performance of our services</li>
                <li>Attempt to reverse engineer, decompile, or disassemble our software</li>
                <li>Circumvent usage limits, rate limiting, or access controls</li>
                <li>Share account credentials or allow unauthorized access to your account</li>
              </ul>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">2.5 Commercial Misuse</h3>
              <p className="text-stone-600">
                You shall not resell, redistribute, or sublicense VIMA services without explicit written permission. You shall not use VIMA to build competing products or services.
              </p>
            </section>

            {/* Consequences */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">3. Consequences of Violations</h2>
              <p className="text-stone-600 mb-4">
                We take violations of this Acceptable Use Policy seriously. Depending on the severity and nature of the violation, we may take one or more of the following actions.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.1 Warning and Education</h3>
              <p className="text-stone-600 mb-4">
                For minor or first-time violations, we may issue a warning and provide guidance on proper use of our platform. We believe in educating users and giving them the opportunity to correct their behavior.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.2 Account Suspension</h3>
              <p className="text-stone-600 mb-4">
                For repeated or more serious violations, we may temporarily suspend your account. During suspension, you will not be able to access VIMA services. Suspension periods vary based on the severity of the violation.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.3 Account Termination</h3>
              <p className="text-stone-600 mb-4">
                For severe violations or repeated offenses, we may permanently terminate your account. Terminated accounts cannot be reinstated, and you may be prohibited from creating new accounts.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.4 Legal Action</h3>
              <p className="text-stone-600 mb-4">
                In cases involving illegal activity or significant harm, we reserve the right to report violations to appropriate law enforcement authorities and pursue legal remedies. We may also cooperate with legal investigations as required by law.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">3.5 Content Removal</h3>
              <p className="text-stone-600">
                We reserve the right to remove any content that violates this policy without prior notice. We may also preserve copies of removed content as necessary for legal compliance or investigation purposes.
              </p>
            </section>

            {/* Reporting */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">4. Reporting Violations</h2>
              <p className="text-stone-600 mb-4">
                We encourage users to report any suspected violations of this Acceptable Use Policy. Your reports help us maintain a safe and productive environment for all users.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.1 How to Report</h3>
              <p className="text-stone-600 mb-4">
                If you encounter content or behavior that violates this policy, please contact us at hello@visualmaji.com with details of the violation, including any relevant screenshots or documentation.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">4.2 Investigation Process</h3>
              <p className="text-stone-600">
                All reports are reviewed by our team. We will investigate reported violations and take appropriate action. Due to privacy considerations, we may not be able to disclose the specific actions taken in response to a report.
              </p>
            </section>

            {/* Policy Updates */}
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-4 text-stone-900">5. Policy Updates</h2>
              <p className="text-stone-600 mb-4">
                We may update this Acceptable Use Policy from time to time to reflect changes in our services, legal requirements, or best practices. We will notify users of material changes by posting the updated policy on our website.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.1 Notification</h3>
              <p className="text-stone-600 mb-4">
                Material changes to this policy will be communicated through our website and, where appropriate, via email to registered users. The &quot;Last updated&quot; date at the top of this policy indicates when it was last revised.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.2 Continued Use</h3>
              <p className="text-stone-600 mb-4">
                Your continued use of VIMA after any changes to this policy constitutes acceptance of the updated terms. If you do not agree with the changes, you should discontinue use of our services.
              </p>
              <h3 className="text-xl font-semibold mb-3 text-stone-800">5.3 Contact</h3>
              <p className="text-stone-600">
                If you have any questions about this Acceptable Use Policy, please contact us at hello@visualmaji.com.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer setCursorVariant={setCursorVariant} />
    </div>
  );
}

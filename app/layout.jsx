'use client';

import './globals.css';
import { AuthProvider } from '../components/context/AuthContext';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <title>Visual Maji - Creative Analysis Tool</title>
        <meta name="description" content="Visual Maji - AI-powered creative analysis tool" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}

'use client';

import '../styles/globals.css';
import Head from 'next/head';
import { usePathname } from 'next/navigation';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import AuthGuard from '@/components/Auth/AuthGuard';
import Navbar from '@/components/Navbar/Navbar';
import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import ReduxProvider from '@/components/Providers/ReduxProvider';
import { I18nClientProvider } from '@/components/Providers/I18nClientProvider';

const metadata = {
  title: 'نظام إدارة ITS',
  description: 'نظام إدارة جولات التفتيش',
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com/" crossOrigin="" />
        <link rel="stylesheet" as="style" 
            href="https://fonts.googleapis.com/css2?display=swap&amp;family=Inter%3Awght%40400%3B500%3B700%3B900&amp;family=Noto+Sans%3Awght%40400%3B500%3B700%3B900" />

        <title>Stitch Design</title>
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />

        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
      </head>
      <body className={isLoginPage ? "" : "pt-32"}> {/* Adjust padding based on Navbar and Breadcrumbs height */}
        <ReduxProvider>
          <AuthProvider>
            <AuthGuard>
              <I18nClientProvider>
                {!isLoginPage && <Navbar />}
                <main>
                  {children}
                </main>
              </I18nClientProvider>
            </AuthGuard>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
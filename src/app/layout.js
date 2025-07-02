// src/app/layout.js
import '../styles/globals.css';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import AuthGuard from '@/components/Auth/AuthGuard';
import Navbar from '@/components/Navbar/Navbar';
import ReduxProvider from '@/components/Providers/ReduxProvider';
import { I18nClientProvider } from '@/components/Providers/I18nClientProvider';

export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'نظام إدارة جولات التفتيش',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <AuthProvider>
            <AuthGuard>
              <I18nClientProvider>
                <Navbar />
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
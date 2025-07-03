import '../styles/globals.css';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import AuthGuard from '@/components/Auth/AuthGuard';
import ReduxProvider from '@/components/Providers/ReduxProvider';
import { I18nClientProvider } from '@/components/Providers/I18nClientProvider';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import LayoutClient from '@/components/LayoutClient';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const notoSansArabic = Noto_Sans_Arabic({ subsets: ['arabic'], variable: '--font-noto-sans-arabic' });

export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'نظام إدارة جولات التفتيش',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl" className={`${inter.variable} ${notoSansArabic.variable}`}>
      <body>
        <ReduxProvider>
          <AuthProvider>
            <AuthGuard>
              <I18nClientProvider>
                <LayoutClient>{children}</LayoutClient>
              </I18nClientProvider>
            </AuthGuard>
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
import '../styles/globals.css';
import Providers from './providers';

export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'تم إنشاؤه بواسطة Create Next App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

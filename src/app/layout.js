import '../styles/globals.css';
import ReduxProvider from '@/components/Providers/ReduxProvider';

export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'تم إنشاؤه بواسطة Create Next App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}
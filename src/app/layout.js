import '../styles/globals.css';
import { AuthProvider } from '@/components/Auth/AuthProvider';
import AuthGuard from '@/components/Auth/AuthGuard';
import Navbar from '@/components/Navbar/Navbar';

export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'نظام إدارة جولات التفتيش',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        <AuthProvider>
          <AuthGuard>
            <Navbar />
            <main>
              {children}
            </main>
          </AuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
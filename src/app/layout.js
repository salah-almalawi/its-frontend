import '../styles/globals.css';


export const metadata = {
  title: 'نظام إدارة ITS',
  description: 'تم إنشاؤه بواسطة Create Next App',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <body>
        {children}
      </body>
    </html>
  );
}

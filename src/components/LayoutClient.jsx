'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar/Navbar';

export default function LayoutClient({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <>
      {!isLoginPage && <Navbar />}
      <main className={isLoginPage ? "" : "pt-[var(--navbar-height)]"}>
        {children}
      </main>
    </>
  );
}
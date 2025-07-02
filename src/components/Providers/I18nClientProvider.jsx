'use client';

import { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n';

export function I18nClientProvider({ children }) {
  useEffect(() => {
    const updateDir = () => {
      document.documentElement.dir = i18n.dir(i18n.language);
    };

    // Set initial direction
    updateDir();

    // Update direction when language changes
    i18n.on('languageChanged', updateDir);

    // Cleanup
    return () => {
      i18n.off('languageChanged', updateDir);
    };
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      {children}
    </I18nextProvider>
  );
}
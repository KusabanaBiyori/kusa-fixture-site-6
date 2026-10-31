import type { ReactNode } from 'react';

export const metadata = {
  title: 'Kusa fixture site',
  description: 'Fixture repository for KusaBuilder Phase 2 verification.',
};

const RootLayout = ({ children }: { readonly children: ReactNode }) => (
  <html lang="en">
    <body>{children}</body>
  </html>
);

export default RootLayout;

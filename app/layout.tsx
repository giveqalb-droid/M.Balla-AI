import React from 'react';

export const metadata = {
  title: 'Assistant Pédagogique M. Balla | Next.js & Synthesis AI',
  description: 'Gestion prédictive de classe CEB Sénégal et analyse synthétique des apprentissages.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-amber-50/40 text-slate-800 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}

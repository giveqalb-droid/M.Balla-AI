import React from 'react';

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
      <body className="bg-amber-50/40 text-slate-800 font-sans min-h-screen">
        {children}
      </body>
    </html>
  );
}

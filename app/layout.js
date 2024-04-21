import { Inter } from 'next/font/google';
import './globals.css';
import Head from 'next/head';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'MedForm AI',
  description: 'Transform medical forms into AI interactive conversations',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
      <Head>
        <link rel="icon" href="public/favicon.ico" />
      </Head>
    </html>
  );
}

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Footer from './_components/footer';
import './globals.css';
import AuthProvider from './_providers/auth';
import { Toaster } from './_components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Barbershop Hub',
  description: 'Encontre sua barbearia favorita',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${inter.className} dark`}>
        <AuthProvider>
          <div className='flex flex-col h-screen'>
            <div className='flex-1'>{children}</div>
            <Footer />
          </div>
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

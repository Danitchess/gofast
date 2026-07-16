import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';
import { LocaleProvider } from '@/lib/i18n';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'], variable: '--font-inter' });
const poppins = Poppins({ subsets: ['latin'], weight: ['600', '700', '800'], variable: '--font-poppins' });

export const metadata = {
  title: {
    default: 'Go Fast Logistics — Transport dédié National & International 24/7',
    template: '%s — Go Fast Logistics',
  },
  description:
    "Go Fast Logistics : transport dédié et personnalisé, logistique événementielle et stockage en Belgique et en Europe. Flotte Mercedes récente, service 24/7, réservation en ligne.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`}>
      <body>
        <LocaleProvider>
          <Header />
          {children}
          <Footer />
          <CookieBanner />
        </LocaleProvider>
      </body>
    </html>
  );
}

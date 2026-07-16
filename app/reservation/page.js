import ReservationContent from '@/components/pages/ReservationContent';

export const metadata = {
  title: 'Réserver un transport',
  description: 'Réservez votre transport en ligne en 4 étapes : type de transport, trajet, coordonnées et confirmation. Devis sous 2h ouvrées.',
};

export default function ReservationPage() {
  return <ReservationContent />;
}

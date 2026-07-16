// Standard booking-office hours. Phone support stays 24/7 for urgent requests,
// but online reservations are checked against these slots.
export const BUSINESS_HOURS = {
  0: null, // Sunday — closed
  1: { open: '07:00', close: '19:00' },
  2: { open: '07:00', close: '19:00' },
  3: { open: '07:00', close: '19:00' },
  4: { open: '07:00', close: '19:00' },
  5: { open: '07:00', close: '19:00' },
  6: { open: '09:00', close: '13:00' },
};

const DAY_NAMES = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];

function toMinutes(hhmm) {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
}

// dateStr: 'YYYY-MM-DD', timeStr: 'HH:MM'
export function checkBusinessHours(dateStr, timeStr) {
  if (!dateStr || !timeStr) return { valid: true };

  const date = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(date.getTime())) return { valid: true };

  const day = date.getDay();
  const slot = BUSINESS_HOURS[day];

  if (!slot) {
    return { valid: false, reason: `Nous sommes fermés le ${DAY_NAMES[day]}. Merci de choisir un autre jour (lundi-samedi).` };
  }

  const minutes = toMinutes(timeStr);
  if (minutes < toMinutes(slot.open) || minutes > toMinutes(slot.close)) {
    return { valid: false, reason: `Le ${DAY_NAMES[day]}, nos réservations en ligne sont possibles entre ${slot.open} et ${slot.close}. Pour une urgence hors horaires, appelez le +32 (0)2 385 34 30.` };
  }

  return { valid: true };
}

export function isDateInPast(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(`${dateStr}T00:00:00`);
  return date.getTime() < today.getTime();
}

export function todayISO() {
  const d = new Date();
  const offset = d.getTimezoneOffset();
  const local = new Date(d.getTime() - offset * 60000);
  return local.toISOString().split('T')[0];
}

export const COUNTRIES = [
  { code: 'BE', name: 'Belgique', dial: '+32' },
  { code: 'FR', name: 'France', dial: '+33' },
  { code: 'NL', name: 'Pays-Bas', dial: '+31' },
  { code: 'LU', name: 'Luxembourg', dial: '+352' },
  { code: 'DE', name: 'Allemagne', dial: '+49' },
  { code: 'GB', name: 'Royaume-Uni', dial: '+44' },
  { code: 'IT', name: 'Italie', dial: '+39' },
  { code: 'ES', name: 'Espagne', dial: '+34' },
];

export const COUNTRY_MAP = Object.fromEntries(COUNTRIES.map((c) => [c.code, c]));

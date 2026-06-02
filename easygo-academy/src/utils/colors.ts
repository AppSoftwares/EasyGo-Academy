export const BRAND_COLORS = {
  primary: {
    orange: '#FF5E36',
    coral: '#FF5E36',
  },
  secondary: {
    purple: '#5D26C1',
    violet: '#5D26C1',
  },
  gradient: {
    start: '#FF5E36',
    end: '#5D26C1',
  },
  background: {
    light: '#FFFFFF',
    secondary: '#F4F5F9',
    dark: '#120E2E',
  },
  text: {
    primary: '#FFFFFF',
    secondary: '#120E2E',
    muted: '#6B7280',
  },
  accent: {
    success: '#00E676',
    warning: '#FFD700',
    error: '#FF5E36',
    info: '#5D26C1',
  },
  streak: {
    gold: '#FFD700',
    silver: '#C0C0C0',
    bronze: '#CD7F32',
  },
};

export const GRADIENT_CSS = `linear-gradient(135deg, ${BRAND_COLORS.gradient.start} 0%, ${BRAND_COLORS.gradient.end} 100%)`;

export const FONTS = {
  primary: "'Inter', system-ui, -apple-system, sans-serif",
  titles: "'Plus Jakarta Sans', 'Poppins', sans-serif",
  logo: "'Plus Jakarta Sans', sans-serif",
  academy: "'Inter', sans-serif",
};

export const getTheme = (isDarkMode: boolean) => ({
  bg: isDarkMode ? '#0f172a' : '#f8fafc',
  card: isDarkMode ? '#1e293b' : '#ffffff',
  text: isDarkMode ? '#f8fafc' : '#0f172a',
  textMuted: isDarkMode ? '#94a3b8' : '#64748b',
  border: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
  primary: '#f59e0b',
  secondary: '#8b5cf6',
  success: '#10b981',
  error: '#ef4444',
  accent: '#818cf8',
});

export type Theme = ReturnType<typeof getTheme>;

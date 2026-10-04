export const MysticColors = {
  // Deep space & void backgrounds
  bgVoid: '#070312',
  bgDark: '#0D061F',
  bgCard: '#170C33',
  bgCardHover: '#23124D',
  bgOverlay: 'rgba(7, 3, 18, 0.85)',
  bgGlass: 'rgba(35, 18, 77, 0.65)',
  
  // Glowing purples and violets
  purpleLight: '#E2D4F8',
  purpleMedium: '#9D65E8',
  purpleVibrant: '#8A2BE2',
  purpleDeep: '#491088',
  purpleGlow: 'rgba(157, 101, 232, 0.4)',
  
  // Astral Gold & Solar accents
  goldLight: '#FFF1B8',
  gold: '#F5CE62',
  goldDark: '#D4A017',
  goldGlow: 'rgba(245, 206, 98, 0.35)',

  // Mystic Blues & Magentas
  celestialBlue: '#4EA8DE',
  amethyst: '#C77DFF',
  astralRose: '#E056FD',
  emeraldMystic: '#2EC4B6',

  // Text colors
  textPrimary: '#F7F4FD',
  textSecondary: '#C1B3DC',
  textMuted: '#8374A0',
  textGold: '#F8DE7E',

  // Borders
  borderLight: 'rgba(157, 101, 232, 0.25)',
  borderGlow: 'rgba(245, 206, 98, 0.4)',
  borderCard: 'rgba(199, 125, 255, 0.18)',

  // Status & indicators
  success: '#48BB78',
  warning: '#ED8936',
  error: '#F56565',
};

export const Gradients = {
  mysticVoid: ['#070312', '#140A28', '#1F0F3D'] as const,
  cardSurface: ['#1C0F38', '#26144D'] as const,
  buttonPurple: ['#7B2CBF', '#9D4EDD', '#C77DFF'] as const,
  buttonGold: ['#D4A017', '#F5CE62', '#FFE494'] as const,
  cardBack: ['#130924', '#2C1354', '#4A1D8A'] as const,
  headerGlow: ['rgba(138, 43, 226, 0.3)', 'transparent'] as const,
  goldBorder: ['#F5CE62', '#9D4EDD', '#F5CE62'] as const,
};

export type ArcanaType = 'major' | 'minor';
export type TarotSuit = 'wands' | 'cups' | 'swords' | 'pentacles' | 'major';
export type ElementType = 'Fogo' | 'Água' | 'Ar' | 'Terra' | 'Espírito';

export interface TarotCard {
  id: string;
  name: string; // Portuguese name, e.g. "O Mago"
  nameEn: string; // English name, e.g. "The Magician"
  nameShort: string; // Short code, e.g. "ar01"
  type: ArcanaType;
  suit?: TarotSuit;
  value: string;
  valueInt: number;
  imageUrl: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
  description: string;
  advice: string;
  element: ElementType;
  astrology?: string;
}

export interface DrawnCard {
  card: TarotCard;
  isReversed: boolean;
  positionName: string; // e.g. "Passado", "Presente", "Desafio", "Conselho"
  positionDescription?: string;
  order: number;
}

export type SpreadType = 'one_card' | 'three_cards' | 'celtic_cross' | 'love' | 'career';

export interface SpreadConfig {
  id: SpreadType;
  title: string;
  subtitle: string;
  cardCount: number;
  positions: { name: string; description: string }[];
  icon: string;
  recommendedFor: string;
}

export interface TarotReading {
  id: string;
  userId: string;
  userEmail?: string;
  question: string;
  spreadType: SpreadType;
  spreadTitle: string;
  cards: DrawnCard[];
  interpretation: {
    directAnswer: string;
    cardsAnalysis: string;
    advice: string;
    elementalBalance: string;
    energyVibe: string;
  };
  createdAt: string; // ISO date string
}

export interface ZodiacSign {
  id: string;
  name: string;
  symbol: string;
  dates: string;
  element: ElementType;
  rulingPlanet: string;
  traits: string[];
  dailyHoroscope: {
    general: string;
    love: string;
    career: string;
    energy: number; // 1-100%
    luckyNumber: number;
    luckyColor: string;
    crystal: string;
  };
}

export interface MoonPhaseInfo {
  phaseName: string;
  phaseCode: 'new' | 'waxing_crescent' | 'first_quarter' | 'waxing_gibbous' | 'full' | 'waning_gibbous' | 'last_quarter' | 'waning_crescent';
  symbol: string;
  illumination: number; // percentage
  astrologicalEnergy: string;
  recommendedRitual: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  zodiacSign?: string;
  isAnonymous?: boolean;
  readingsCount?: number;
  createdAt?: string;
}

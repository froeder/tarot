import { TarotCard } from '../types/tarot';
import { TAROT_DECK, getRandomCards, getCardById } from '../data/tarotCards';

const TAROT_API_BASE = 'https://tarotapi.dev/api/v1';

export interface RemoteApiCard {
  name: string;
  name_short: string;
  type: string;
  value: string;
  value_int: number;
  suit?: string;
  meaning_up: string;
  meaning_rev: string;
  desc: string;
}

/**
 * Service to interact with the Tarot API with intelligent local caching & fallback
 */
export const TarotApiService = {
  /**
   * Fetches random cards from remote API if network is available,
   * otherwise seamlessly uses the high-precision embedded deck.
   */
  async drawCards(count: number, allowReversed = true): Promise<{ card: TarotCard; isReversed: boolean }[]> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s timeout for snappy mobile experience

      const response = await fetch(`${TAROT_API_BASE}/cards/random?n=${count}`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (response.ok) {
        const data = await response.json();
        const remoteCards: RemoteApiCard[] = data.cards || [];

        if (remoteCards.length >= count) {
          return remoteCards.map((rc) => {
            // Match with our rich Portuguese card
            const localCard = getCardById(rc.name_short);
            const isReversed = allowReversed ? Math.random() < 0.28 : false;

            if (localCard) {
              return { card: localCard, isReversed };
            }

            // Fallback if not found locally
            const fallbackCard: TarotCard = {
              id: rc.name_short,
              name: rc.name,
              nameEn: rc.name,
              nameShort: rc.name_short,
              type: rc.type === 'major' ? 'major' : 'minor',
              suit: (rc.suit as any) || 'major',
              value: rc.value,
              valueInt: rc.value_int,
              imageUrl: `https://sacred-texts.com/tarot/pkt/img/${rc.name_short}.jpg`,
              keywords: rc.meaning_up.split(',').slice(0, 4).map(s => s.trim()),
              meaningUpright: rc.meaning_up,
              meaningReversed: rc.meaning_rev,
              description: rc.desc || '',
              advice: 'Siga a sabedoria cósmica do arquétipo revelado.',
              element: 'Espírito',
            };
            return { card: fallbackCard, isReversed };
          });
        }
      }
    } catch {
      // Network failure or timeout -> graceful fallback to local deck
    }

    return getRandomCards(count, allowReversed);
  },

  /**
   * Get all 78 cards from local database
   */
  getAllCards(): TarotCard[] {
    return TAROT_DECK;
  },

  /**
   * Get card by code / id
   */
  getCard(id: string): TarotCard | undefined {
    return getCardById(id);
  },
};

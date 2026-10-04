import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { MysticButton } from '../components/MysticButton';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { useAuth } from '../context/AuthContext';
import { SPREADS } from '../data/spreadsData';
import { getRandomCards } from '../data/tarotCards';
import { ZODIAC_SIGNS } from '../data/horoscopeData';
import { getCurrentMoonPhase } from '../services/moonService';
import { StorageService } from '../services/storageService';
import { TarotCard, DrawnCard, SpreadType } from '../types/tarot';
import { MysticColors } from '../theme/colors';

interface HomeScreenProps {
  onNavigateToAsk: (spreadId?: SpreadType) => void;
  onNavigateToHoroscope: (signId?: string) => void;
  onNavigateToDeck: () => void;
  onNavigateToHistory: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onNavigateToAsk,
  onNavigateToHoroscope,
  onNavigateToDeck,
  onNavigateToHistory,
}) => {
  const { user } = useAuth();
  const [moonPhase, setMoonPhase] = useState(getCurrentMoonPhase());
  const [dailyCard, setDailyCard] = useState<DrawnCard | null>(null);
  const [isDailyCardRevealed, setIsDailyCardRevealed] = useState(false);
  const [selectedModalCard, setSelectedModalCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadDailyCard = useCallback(async () => {
    const userId = user?.uid || 'guest';
    const saved = await StorageService.getDailyCard(userId);
    if (saved) {
      setDailyCard(saved);
      setIsDailyCardRevealed(true);
    } else {
      // Pick random card for today
      const [drawn] = getRandomCards(1, true);
      const newDaily: DrawnCard = {
        card: drawn.card,
        isReversed: drawn.isReversed,
        positionName: 'Carta do Dia',
        positionDescription: 'Sua energia cósmica orientadora para hoje',
        order: 1,
      };
      setDailyCard(newDaily);
      setIsDailyCardRevealed(false);
      await StorageService.saveDailyCard(userId, newDaily);
    }
  }, [user?.uid]);

  // Load or generate Daily Card
  useEffect(() => {
    let isMounted = true;
    const userId = user?.uid || 'guest';
    StorageService.getDailyCard(userId).then(async (saved) => {
      if (!isMounted) return;
      if (saved) {
        setDailyCard(saved);
        setIsDailyCardRevealed(true);
      } else {
        const [drawn] = getRandomCards(1, true);
        const newDaily: DrawnCard = {
          card: drawn.card,
          isReversed: drawn.isReversed,
          positionName: 'Carta do Dia',
          positionDescription: 'Sua energia cósmica orientadora para hoje',
          order: 1,
        };
        if (isMounted) {
          setDailyCard(newDaily);
          setIsDailyCardRevealed(false);
        }
        await StorageService.saveDailyCard(userId, newDaily);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [user?.uid]);

  const handleRevealDailyCard = () => {
    setIsDailyCardRevealed(true);
  };

  const userZodiac = ZODIAC_SIGNS.find(
    (z) => z.name.toLowerCase() === (user?.zodiacSign || 'peixes').toLowerCase()
  ) || ZODIAC_SIGNS[0];

  const onRefresh = async () => {
    setRefreshing(true);
    setMoonPhase(getCurrentMoonPhase());
    await loadDailyCard();
    setRefreshing(false);
  };

  return (
    <StarBackground>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={MysticColors.purpleLight}
          />
        }
      >
        {/* Mystic Greeting & User Aura */}
        <View style={styles.greetingContainer}>
          <View>
            <Text style={styles.greetingSub}>Bênçãos Cósmicas,</Text>
            <Text style={styles.greetingTitle}>
              {user?.displayName || 'Consulente Astral'} ✨
            </Text>
          </View>

          <TouchableOpacity
            style={styles.zodiacPill}
            activeOpacity={0.8}
            onPress={() => onNavigateToHoroscope(userZodiac.id)}
          >
            <Text style={styles.zodiacSymbol}>{userZodiac.symbol}</Text>
            <Text style={styles.zodiacName}>{userZodiac.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Quick Question / Call to Action Card */}
        <TouchableOpacity
          activeOpacity={0.92}
          onPress={() => onNavigateToAsk()}
          style={styles.askBanner}
        >
          <LinearGradient
            colors={['#491088', '#250B4F', '#14062B']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.askBannerGradient}
          >
            <View style={styles.askContent}>
              <View style={styles.askBadge}>
                <Ionicons name="sparkles" size={12} color={MysticColors.gold} />
                <Text style={styles.askBadgeText}>ORÁCULO SAGRADO</Text>
              </View>
              <Text style={styles.askTitle}>Faça sua Pergunta</Text>
              <Text style={styles.askSubtitle}>
                Concentre-se em sua dúvida e tire as cartas para receber a resposta das estrelas.
              </Text>
              <View style={styles.askBtnSimulated}>
                <Text style={styles.askBtnText}>Consultar Baralho</Text>
                <Ionicons name="arrow-forward" size={14} color="#FFF" />
              </View>
            </View>

            <View style={styles.askCardsVisual}>
              <Ionicons name="eye-outline" size={44} color={MysticColors.gold} />
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* Moon Phase Banner */}
        <View style={styles.moonCard}>
          <LinearGradient
            colors={['rgba(35, 18, 77, 0.7)', 'rgba(19, 9, 36, 0.8)']}
            style={styles.moonGradient}
          >
            <View style={styles.moonHeader}>
              <View style={styles.moonSymbolBox}>
                <Text style={styles.moonSymbolText}>{moonPhase.symbol}</Text>
              </View>
              <View style={styles.moonDetails}>
                <View style={styles.moonPhaseRow}>
                  <Text style={styles.moonPhaseName}>{moonPhase.phaseName}</Text>
                  <Text style={styles.moonIllumination}>
                    {moonPhase.illumination}% Iluminada
                  </Text>
                </View>
                <Text style={styles.moonEnergyText} numberOfLines={2}>
                  {moonPhase.astrologicalEnergy}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Daily Card of the Day (Carta do Dia) */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="flame" size={18} color={MysticColors.gold} />
            <Text style={styles.sectionTitle}>Sua Carta do Dia</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Mensagem diária para seu espírito</Text>
        </View>

        <View style={styles.dailyCardContainer}>
          {dailyCard && (
            <TarotCardView
              card={dailyCard.card}
              isReversed={dailyCard.isReversed}
              isRevealed={isDailyCardRevealed}
              size="md"
              onPress={() => {
                if (!isDailyCardRevealed) {
                  handleRevealDailyCard();
                } else {
                  setSelectedModalCard({
                    card: dailyCard.card,
                    isReversed: dailyCard.isReversed,
                  });
                }
              }}
            />
          )}

          <View style={styles.dailyCardInfoBox}>
            {!isDailyCardRevealed ? (
              <View style={styles.unrevealedPrompt}>
                <Text style={styles.unrevealedTitle}>Carta do Destino</Text>
                <Text style={styles.unrevealedDesc}>
                  Toque na carta para revelar a mensagem que o universo preparou para você hoje.
                </Text>
                <MysticButton
                  title="Revelar Carta"
                  variant="gold"
                  size="sm"
                  icon="sparkles"
                  onPress={handleRevealDailyCard}
                />
              </View>
            ) : dailyCard ? (
              <View style={styles.revealedPrompt}>
                <Text style={styles.revealedCardName}>
                  {dailyCard.card.name} {dailyCard.isReversed ? '(Invertida)' : ''}
                </Text>
                <Text style={styles.revealedKeywords}>
                  {dailyCard.card.keywords.slice(0, 3).join(' • ')}
                </Text>
                <Text style={styles.revealedAdvice} numberOfLines={4}>
                  {`"${dailyCard.card.advice}"`}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setSelectedModalCard({
                      card: dailyCard.card,
                      isReversed: dailyCard.isReversed,
                    })
                  }
                  style={styles.seeDetailLink}
                >
                  <Text style={styles.seeDetailLinkText}>Ver Simbologia Completa ➔</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        {/* Featured Spreads / Tipos de Tiragens */}
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <Ionicons name="grid" size={18} color={MysticColors.amethyst} />
            <Text style={styles.sectionTitle}>Tiragens Especiais</Text>
          </View>
          <Text style={styles.sectionSubtitle}>Escolha o método ideal para sua questão</Text>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.spreadsScroll}
        >
          {SPREADS.map((s) => (
            <TouchableOpacity
              key={s.id}
              activeOpacity={0.85}
              onPress={() => onNavigateToAsk(s.id)}
              style={styles.spreadCard}
            >
              <LinearGradient
                colors={['#25124A', '#130926']}
                style={styles.spreadGradient}
              >
                <View style={styles.spreadTopRow}>
                  <View style={styles.spreadIconBox}>
                    <Ionicons
                      name={s.icon as any}
                      size={20}
                      color={MysticColors.gold}
                    />
                  </View>
                  <View style={styles.spreadCountBadge}>
                    <Text style={styles.spreadCountText}>{s.cardCount} cartas</Text>
                  </View>
                </View>

                <Text style={styles.spreadTitle}>{s.title}</Text>
                <Text style={styles.spreadDesc} numberOfLines={2}>
                  {s.subtitle}
                </Text>

                <View style={styles.spreadFooter}>
                  <Text style={styles.spreadStartText}>Iniciar Tiragem</Text>
                  <Ionicons name="chevron-forward" size={14} color={MysticColors.amethyst} />
                </View>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Mystic Features Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={styles.shortcutItem}
            activeOpacity={0.8}
            onPress={() => onNavigateToHoroscope()}
          >
            <LinearGradient
              colors={['#32165C', '#1A0B33']}
              style={styles.shortcutGradient}
            >
              <Ionicons name="planet-outline" size={26} color={MysticColors.gold} />
              <Text style={styles.shortcutTitle}>Horóscopo Diário</Text>
              <Text style={styles.shortcutSub}>Previsões dos 12 signos</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shortcutItem}
            activeOpacity={0.8}
            onPress={onNavigateToDeck}
          >
            <LinearGradient
              colors={['#32165C', '#1A0B33']}
              style={styles.shortcutGradient}
            >
              <Ionicons name="book-outline" size={26} color={MysticColors.celestialBlue} />
              <Text style={styles.shortcutTitle}>Guia dos Arcanos</Text>
              <Text style={styles.shortcutSub}>78 Cartas & Significados</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* History Quick Access */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onNavigateToHistory}
          style={styles.historyShortcut}
        >
          <Ionicons name="time-outline" size={20} color={MysticColors.purpleLight} />
          <Text style={styles.historyShortcutText}>
            Acessar Histórico de Tiragens Anteriores
          </Text>
          <Ionicons name="chevron-forward" size={18} color={MysticColors.purpleLight} />
        </TouchableOpacity>
      </ScrollView>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={selectedModalCard?.card || null}
        isReversed={selectedModalCard?.isReversed}
        visible={!!selectedModalCard}
        onClose={() => setSelectedModalCard(null)}
      />
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  greetingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 8,
  },
  greetingSub: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  greetingTitle: {
    color: MysticColors.textPrimary,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  zodiacPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(73, 16, 136, 0.45)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  zodiacSymbol: {
    fontSize: 16,
    color: MysticColors.gold,
    marginRight: 6,
  },
  zodiacName: {
    color: MysticColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  askBanner: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
    marginBottom: 20,
    shadowColor: MysticColors.purpleVibrant,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  askBannerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  askContent: {
    flex: 1,
    paddingRight: 10,
  },
  askBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 206, 98, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    marginBottom: 8,
  },
  askBadgeText: {
    color: MysticColors.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  askTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  askSubtitle: {
    color: MysticColors.purpleLight,
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 14,
  },
  askBtnSimulated: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: MysticColors.purpleVibrant,
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
  },
  askBtnText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '700',
  },
  askCardsVisual: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(35, 18, 77, 0.8)',
    borderWidth: 1.5,
    borderColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.2)',
    marginBottom: 24,
  },
  moonGradient: {
    padding: 14,
  },
  moonHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  moonSymbolBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(23, 12, 51, 0.9)',
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  moonSymbolText: {
    fontSize: 24,
  },
  moonDetails: {
    flex: 1,
  },
  moonPhaseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 2,
  },
  moonPhaseName: {
    color: MysticColors.goldLight,
    fontSize: 15,
    fontWeight: '700',
  },
  moonIllumination: {
    color: MysticColors.textSecondary,
    fontSize: 12,
  },
  moonEnergyText: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    color: MysticColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  sectionSubtitle: {
    color: MysticColors.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  dailyCardContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 12, 51, 0.65)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 24,
  },
  dailyCardInfoBox: {
    flex: 1,
    paddingLeft: 12,
  },
  unrevealedPrompt: {
    gap: 8,
  },
  unrevealedTitle: {
    color: MysticColors.goldLight,
    fontSize: 16,
    fontWeight: '700',
  },
  unrevealedDesc: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  revealedPrompt: {
    gap: 4,
  },
  revealedCardName: {
    color: MysticColors.textPrimary,
    fontSize: 16,
    fontWeight: '800',
  },
  revealedKeywords: {
    color: MysticColors.gold,
    fontSize: 11,
    fontWeight: '600',
  },
  revealedAdvice: {
    color: MysticColors.purpleLight,
    fontSize: 12,
    lineHeight: 17,
    fontStyle: 'italic',
    marginTop: 4,
  },
  seeDetailLink: {
    marginTop: 6,
  },
  seeDetailLinkText: {
    color: MysticColors.amethyst,
    fontSize: 12,
    fontWeight: '700',
  },
  spreadsScroll: {
    paddingRight: 16,
    gap: 12,
    marginBottom: 24,
  },
  spreadCard: {
    width: 200,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  spreadGradient: {
    padding: 14,
    height: 155,
    justifyContent: 'space-between',
  },
  spreadTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spreadIconBox: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(73, 16, 136, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spreadCountBadge: {
    backgroundColor: 'rgba(157, 101, 232, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  spreadCountText: {
    color: MysticColors.purpleLight,
    fontSize: 11,
    fontWeight: '700',
  },
  spreadTitle: {
    color: MysticColors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
    marginTop: 6,
  },
  spreadDesc: {
    color: MysticColors.textSecondary,
    fontSize: 11,
    lineHeight: 15,
  },
  spreadFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(157, 101, 232, 0.15)',
    paddingTop: 8,
  },
  spreadStartText: {
    color: MysticColors.amethyst,
    fontSize: 12,
    fontWeight: '700',
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  shortcutItem: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  shortcutGradient: {
    padding: 14,
    alignItems: 'center',
  },
  shortcutTitle: {
    color: MysticColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
  },
  shortcutSub: {
    color: MysticColors.textMuted,
    fontSize: 11,
    marginTop: 2,
    textAlign: 'center',
  },
  historyShortcut: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(35, 18, 77, 0.5)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 10,
  },
  historyShortcutText: {
    flex: 1,
    marginLeft: 10,
    color: MysticColors.purpleLight,
    fontSize: 13,
    fontWeight: '600',
  },
});

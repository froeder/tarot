import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { MysticButton } from '../components/MysticButton';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { SPREADS, getSpreadById } from '../data/spreadsData';
import { TarotApiService } from '../services/tarotApi';
import { synthesizeTarotReading } from '../services/interpretationEngine';
import { StorageService } from '../services/storageService';
import { useAuth } from '../context/AuthContext';
import { DrawnCard, SpreadType, TarotCard, TarotReading } from '../types/tarot';
import { MysticColors } from '../theme/colors';

function getRandomIndices(count: number, max: number): number[] {
  const indices: number[] = [];
  while (indices.length < count && indices.length < max) {
    const randIdx = Math.floor(Math.random() * max);
    if (!indices.includes(randIdx)) {
      indices.push(randIdx);
    }
  }
  return indices;
}

function generateReadingId(): string {
  return `reading_${Date.now()}`;
}

interface AskTarotScreenProps {
  initialSpreadId?: SpreadType;
  onReadingComplete: (reading: TarotReading) => void;
  onBack?: () => void;
}

const QUESTION_SUGGESTIONS = [
  'O que o destino me reserva no amor?',
  'Como devo agir na minha carreira hoje?',
  'Qual lição espiritual preciso aprender agora?',
  'Devo dar o próximo passo nesta decisão?',
  'Como superar o obstáculo diante de mim?',
];

export const AskTarotScreen: React.FC<AskTarotScreenProps> = ({
  initialSpreadId = 'three_cards',
  onReadingComplete,
  onBack,
}) => {
  const { user } = useAuth();
  const [question, setQuestion] = useState('');
  const [selectedSpread, setSelectedSpread] = useState<SpreadType>(initialSpreadId);
  const [step, setStep] = useState<'question' | 'shuffling' | 'picking' | 'revealed'>('question');
  

  const [isSynthesizing, setIsSynthesizing] = useState(false);
  const [completedReading, setCompletedReading] = useState<TarotReading | null>(null);

  // Deck pool to pick from
  const [deckPool, setDeckPool] = useState<{ card: TarotCard; isReversed: boolean }[]>([]);
  const [selectedPoolIndices, setSelectedPoolIndices] = useState<number[]>([]);

  // Modal for detail view
  const [modalCard, setModalCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);

  const currentSpreadConfig = getSpreadById(selectedSpread);
  const neededCards = currentSpreadConfig.cardCount;

  const prepareDeckPool = useCallback(async () => {
    const pool = await TarotApiService.drawCards(12, true);
    setDeckPool(pool);
    setSelectedPoolIndices([]);
  }, []);

  // Initialize deck pool on mount or spread change
  useEffect(() => {
    let isMounted = true;
    TarotApiService.drawCards(12, true).then((pool) => {
      if (isMounted) {
        setDeckPool(pool);
        setSelectedPoolIndices([]);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [selectedSpread]);

  const finalizeReading = useCallback(async (chosenIndices: number[]) => {
    setIsSynthesizing(true);
    setStep('revealed');

    const drawn: DrawnCard[] = chosenIndices.map((poolIdx, order) => {
      const item = deckPool[poolIdx];
      const positionMeta = currentSpreadConfig.positions[order] || {
        name: `Carta ${order + 1}`,
        description: 'Aspecto da questão',
      };

      return {
        card: item.card,
        isReversed: item.isReversed,
        positionName: positionMeta.name,
        positionDescription: positionMeta.description,
        order: order + 1,
      };
    });

    // Synthesize interpretation
    const interpretation = synthesizeTarotReading(question, selectedSpread, drawn);

    const reading: TarotReading = {
      id: generateReadingId(),
      userId: user?.uid || 'guest',
      userEmail: user?.email,
      question: question.trim() || 'Consulta Geral das Estrelas',
      spreadType: selectedSpread,
      spreadTitle: currentSpreadConfig.title,
      cards: drawn,
      interpretation,
      createdAt: new Date().toISOString(),
    };

    // Save to storage & firestore
    await StorageService.saveReading(reading);
    setCompletedReading(reading);
    setIsSynthesizing(false);
  }, [currentSpreadConfig, deckPool, question, selectedSpread, user?.email, user?.uid]);

  const handleStartShuffling = async () => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {}
    setStep('shuffling');
    await prepareDeckPool();

    // Shuffling suspense animation delay
    setTimeout(() => {
      setStep('picking');
    }, 1800);
  };

  const handlePickCardFromPool = (index: number) => {
    if (selectedPoolIndices.includes(index)) return;
    if (selectedPoolIndices.length >= neededCards) return;

    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {}

    const newIndices = [...selectedPoolIndices, index];
    setSelectedPoolIndices(newIndices);

    // If all cards chosen, proceed to reveal & interpretation
    if (newIndices.length === neededCards) {
      finalizeReading(newIndices);
    }
  };

  const handleAutoPickAll = () => {
    const indicesToPick = getRandomIndices(neededCards, deckPool.length);
    setSelectedPoolIndices(indicesToPick);
    finalizeReading(indicesToPick);
  };



  const handleReset = () => {
    setQuestion('');
    setStep('question');
    setSelectedPoolIndices([]);
    setCompletedReading(null);
  };

  return (
    <StarBackground>
      <Header
        title="Oráculo Místico"
        subtitle={currentSpreadConfig.title}
        showBack={!!onBack}
        onBack={onBack}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* STEP 1: FORMULATE QUESTION & SPREAD */}
        {step === 'question' && (
          <View style={styles.stepContainer}>
            <View style={styles.introBox}>
              <Ionicons name="compass" size={24} color={MysticColors.gold} />
              <Text style={styles.introTitle}>Conecte-se com sua Intuição</Text>
              <Text style={styles.introDesc}>
                Respire fundo, feche os olhos por alguns instantes e concentre-se na situação sobre a qual deseja luz e direcionamento.
              </Text>
            </View>

            {/* Question Input */}
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Sua Pergunta ao Baralho (Opcional):</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ex: Qual caminho profissional devo seguir?"
                placeholderTextColor={MysticColors.textMuted}
                value={question}
                onChangeText={setQuestion}
                multiline
                maxLength={200}
              />
              <Text style={styles.charCounter}>{question.length}/200</Text>
            </View>

            {/* Suggestions */}
            <View style={styles.suggestionsContainer}>
              <Text style={styles.suggestionsLabel}>Sugestões de Dúvidas:</Text>
              <View style={styles.suggestionsChips}>
                {QUESTION_SUGGESTIONS.map((sug, i) => (
                  <TouchableOpacity
                    key={i}
                    style={styles.suggestionChip}
                    onPress={() => setQuestion(sug)}
                  >
                    <Text style={styles.suggestionChipText}>{sug}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Spread Selector */}
            <View style={styles.spreadSelectorSection}>
              <Text style={styles.inputLabel}>Escolha a Tiragem:</Text>
              <View style={styles.spreadGrid}>
                {SPREADS.map((sp) => {
                  const isSelected = sp.id === selectedSpread;
                  return (
                    <TouchableOpacity
                      key={sp.id}
                      activeOpacity={0.8}
                      onPress={() => setSelectedSpread(sp.id)}
                      style={[
                        styles.spreadOption,
                        isSelected && styles.spreadOptionSelected,
                      ]}
                    >
                      <View style={styles.spreadOptionHeader}>
                        <Ionicons
                          name={sp.icon as any}
                          size={18}
                          color={isSelected ? MysticColors.gold : MysticColors.amethyst}
                        />
                        <Text
                          style={[
                            styles.spreadOptionBadge,
                            isSelected && styles.spreadOptionBadgeSelected,
                          ]}
                        >
                          {sp.cardCount} {sp.cardCount === 1 ? 'carta' : 'cartas'}
                        </Text>
                      </View>
                      <Text
                        style={[
                          styles.spreadOptionTitle,
                          isSelected && styles.spreadOptionTitleSelected,
                        ]}
                      >
                        {sp.title}
                      </Text>
                      <Text style={styles.spreadOptionSub} numberOfLines={2}>
                        {sp.subtitle}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Action Button */}
            <MysticButton
              title="Embaralhar as Cartas Sagradas"
              variant="purple"
              size="lg"
              icon="sparkles"
              onPress={handleStartShuffling}
              style={styles.mainActionBtn}
            />
          </View>
        )}

        {/* STEP 2: SHUFFLING SUSPENSE ANIMATION */}
        {step === 'shuffling' && (
          <View style={styles.shufflingContainer}>
            <View style={styles.crystalGlow}>
              <Ionicons name="sparkles" size={54} color={MysticColors.gold} />
            </View>
            <Text style={styles.shufflingTitle}>Embaralhando o Cosmos...</Text>
            <Text style={styles.shufflingDesc}>
              As 78 energias arquetípicas estão se alinhando à frequência da sua intenção.
            </Text>
            <ActivityIndicator size="large" color={MysticColors.amethyst} style={{ marginTop: 24 }} />
          </View>
        )}

        {/* STEP 3: INTERACTIVE PICKING */}
        {step === 'picking' && (
          <View style={styles.stepContainer}>
            <View style={styles.pickingHeader}>
              <Text style={styles.pickingTitle}>
                Escolha {neededCards} {neededCards === 1 ? 'carta' : 'cartas'}
              </Text>
              <Text style={styles.pickingCounter}>
                {selectedPoolIndices.length} de {neededCards} selecionadas
              </Text>
            </View>

            {/* Cards Pool */}
            <View style={styles.deckPoolGrid}>
              {deckPool.map((_, index) => {
                const isChosen = selectedPoolIndices.includes(index);
                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={0.85}
                    disabled={isChosen}
                    onPress={() => handlePickCardFromPool(index)}
                    style={[
                      styles.poolCardItem,
                      isChosen && styles.poolCardChosen,
                    ]}
                  >
                    <TarotCardView
                      isRevealed={false}
                      size="sm"
                      disabled
                    />
                    {isChosen && (
                      <View style={styles.chosenOrderBadge}>
                        <Text style={styles.chosenOrderText}>
                          {selectedPoolIndices.indexOf(index) + 1}
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Quick Auto Pick option */}
            <MysticButton
              title="Tirar Automaticamente pelo Destino"
              variant="outline"
              size="md"
              icon="shuffle"
              onPress={handleAutoPickAll}
              style={{ marginTop: 20 }}
            />
          </View>
        )}

        {/* STEP 4: REVEALED & INTERPRETED READING */}
        {step === 'revealed' && (
          <View style={styles.stepContainer}>
            {isSynthesizing ? (
              <View style={styles.shufflingContainer}>
                <ActivityIndicator size="large" color={MysticColors.gold} />
                <Text style={styles.shufflingTitle}>Decifrando os Arcanos...</Text>
                <Text style={styles.shufflingDesc}>
                  A sabedoria milenar está tecendo a resposta para sua dúvida.
                </Text>
              </View>
            ) : completedReading ? (
              <>
                {/* Question reminder */}
                {completedReading.question !== 'Consulta Geral das Estrelas' && (
                  <View style={styles.questionEchoBox}>
                    <Text style={styles.questionEchoLabel}>Sua Pergunta:</Text>
                    <Text style={styles.questionEchoText}>
                      {`"${completedReading.question}"`}
                    </Text>
                  </View>
                )}

                {/* Energy Vibe Badge */}
                <View style={styles.vibeBanner}>
                  <Text style={styles.vibeText}>
                    {completedReading.interpretation.energyVibe}
                  </Text>
                </View>

                {/* Cards Drawn Carousel/Row */}
                <Text style={styles.drawnCardsHeading}>Arcanos Revelados:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.drawnCardsScroll}
                >
                  {completedReading.cards.map((dc, i) => (
                    <TarotCardView
                      key={i}
                      card={dc.card}
                      isReversed={dc.isReversed}
                      positionName={dc.positionName}
                      isRevealed={true}
                      size="md"
                      onPress={() =>
                        setModalCard({ card: dc.card, isReversed: dc.isReversed })
                      }
                    />
                  ))}
                </ScrollView>

                {/* Oracle Direct Answer */}
                <View style={styles.oracleAnswerCard}>
                  <LinearGradient
                    colors={['rgba(73, 16, 136, 0.45)', 'rgba(35, 18, 77, 0.6)']}
                    style={styles.oracleGradient}
                  >
                    <View style={styles.oracleHeaderRow}>
                      <Ionicons name="eye" size={20} color={MysticColors.gold} />
                      <Text style={styles.oracleTitle}>A Voz do Oráculo</Text>
                    </View>
                    <Text style={styles.oracleDirectText}>
                      {completedReading.interpretation.directAnswer}
                    </Text>
                  </LinearGradient>
                </View>

                {/* Advice Card */}
                <View style={styles.adviceCard}>
                  <View style={styles.adviceHeaderRow}>
                    <Ionicons name="sparkles" size={18} color={MysticColors.amethyst} />
                    <Text style={styles.adviceHeading}>Conselho Sagrado</Text>
                  </View>
                  <Text style={styles.adviceBodyText}>
                    {completedReading.interpretation.advice}
                  </Text>
                </View>

                {/* Elemental Balance */}
                <View style={styles.elementalCard}>
                  <Ionicons name="water-outline" size={18} color={MysticColors.celestialBlue} />
                  <Text style={styles.elementalBodyText}>
                    {completedReading.interpretation.elementalBalance}
                  </Text>
                </View>

                {/* Actions */}
                <View style={styles.resultActions}>
                  <MysticButton
                    title="Ver Análise Completa"
                    variant="gold"
                    size="lg"
                    icon="book-outline"
                    onPress={() => onReadingComplete(completedReading)}
                  />

                  <MysticButton
                    title="Fazer Outra Tiragem"
                    variant="outline"
                    size="md"
                    icon="refresh"
                    onPress={handleReset}
                    style={{ marginTop: 12 }}
                  />
                </View>
              </>
            ) : null}
          </View>
        )}
      </ScrollView>

      {/* Card Detail Modal */}
      <CardDetailModal
        card={modalCard?.card || null}
        isReversed={modalCard?.isReversed}
        visible={!!modalCard}
        onClose={() => setModalCard(null)}
      />
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 110,
  },
  stepContainer: {
    flex: 1,
  },
  introBox: {
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    alignItems: 'center',
    marginBottom: 20,
  },
  introTitle: {
    color: MysticColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginTop: 8,
    marginBottom: 4,
  },
  introDesc: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    lineHeight: 18,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    color: MysticColors.goldLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'rgba(23, 12, 51, 0.85)',
    borderWidth: 1.5,
    borderColor: MysticColors.purpleMedium,
    borderRadius: 14,
    padding: 14,
    color: '#FFF',
    fontSize: 15,
    minHeight: 70,
    textAlignVertical: 'top',
  },
  charCounter: {
    alignSelf: 'flex-end',
    color: MysticColors.textMuted,
    fontSize: 11,
    marginTop: 4,
  },
  suggestionsContainer: {
    marginBottom: 20,
  },
  suggestionsLabel: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  suggestionsChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionChip: {
    backgroundColor: 'rgba(73, 16, 136, 0.35)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.25)',
  },
  suggestionChipText: {
    color: MysticColors.purpleLight,
    fontSize: 12,
  },
  spreadSelectorSection: {
    marginBottom: 24,
  },
  spreadGrid: {
    gap: 10,
  },
  spreadOption: {
    backgroundColor: 'rgba(23, 12, 51, 0.7)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1.5,
    borderColor: 'rgba(157, 101, 232, 0.2)',
  },
  spreadOptionSelected: {
    borderColor: MysticColors.gold,
    backgroundColor: 'rgba(49, 21, 99, 0.9)',
  },
  spreadOptionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  spreadOptionBadge: {
    backgroundColor: 'rgba(157, 101, 232, 0.2)',
    color: MysticColors.purpleLight,
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  spreadOptionBadgeSelected: {
    backgroundColor: 'rgba(245, 206, 98, 0.2)',
    color: MysticColors.gold,
  },
  spreadOptionTitle: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  spreadOptionTitleSelected: {
    color: MysticColors.goldLight,
  },
  spreadOptionSub: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  mainActionBtn: {
    marginTop: 8,
    marginBottom: 16,
  },
  shufflingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  crystalGlow: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(73, 16, 136, 0.5)',
    borderWidth: 2,
    borderColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  shufflingTitle: {
    color: MysticColors.gold,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
  },
  shufflingDesc: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
    paddingHorizontal: 30,
    lineHeight: 19,
  },
  pickingHeader: {
    alignItems: 'center',
    marginBottom: 18,
  },
  pickingTitle: {
    color: MysticColors.goldLight,
    fontSize: 18,
    fontWeight: '800',
  },
  pickingCounter: {
    color: MysticColors.amethyst,
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  deckPoolGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  poolCardItem: {
    position: 'relative',
  },
  poolCardChosen: {
    opacity: 0.35,
  },
  chosenOrderBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chosenOrderText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 13,
  },
  questionEchoBox: {
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 12,
  },
  questionEchoLabel: {
    color: MysticColors.goldLight,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  questionEchoText: {
    color: '#FFF',
    fontSize: 14,
    fontStyle: 'italic',
    marginTop: 2,
  },
  vibeBanner: {
    backgroundColor: 'rgba(73, 16, 136, 0.4)',
    alignSelf: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MysticColors.amethyst,
    marginBottom: 16,
  },
  vibeText: {
    color: MysticColors.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
  drawnCardsHeading: {
    color: MysticColors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  drawnCardsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  oracleAnswerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.gold,
    marginBottom: 14,
  },
  oracleGradient: {
    padding: 16,
  },
  oracleHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  oracleTitle: {
    color: MysticColors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  oracleDirectText: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  adviceCard: {
    backgroundColor: 'rgba(23, 12, 51, 0.7)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 12,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  adviceHeading: {
    color: MysticColors.amethyst,
    fontSize: 14,
    fontWeight: '700',
  },
  adviceBodyText: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  elementalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(35, 18, 77, 0.35)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(78, 168, 222, 0.25)',
    marginBottom: 20,
  },
  elementalBodyText: {
    flex: 1,
    color: MysticColors.celestialBlue,
    fontSize: 12,
    lineHeight: 17,
  },
  resultActions: {
    marginTop: 6,
  },
});

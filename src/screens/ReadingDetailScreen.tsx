import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { TarotCardView } from '../components/TarotCardView';
import { CardDetailModal } from '../components/CardDetailModal';
import { MysticButton } from '../components/MysticButton';
import { StorageService } from '../services/storageService';
import { TarotReading, TarotCard } from '../types/tarot';
import { MysticColors } from '../theme/colors';

interface ReadingDetailScreenProps {
  reading: TarotReading;
  onBack: () => void;
  onDeleted?: () => void;
}

export const ReadingDetailScreen: React.FC<ReadingDetailScreenProps> = ({
  reading,
  onBack,
  onDeleted,
}) => {
  const [selectedCard, setSelectedCard] = useState<{ card: TarotCard; isReversed: boolean } | null>(null);

  const formattedDate = new Date(reading.createdAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleShare = async () => {
    try {
      const cardsList = reading.cards
        .map((c) => `• ${c.positionName}: ${c.card.name} (${c.isReversed ? 'Invertida' : 'Ereta'})`)
        .join('\n');

      const message = `✨ Consulta ao Tarot Místico ✨\n\nPergunta: "${reading.question}"\nTiragem: ${reading.spreadTitle}\nData: ${formattedDate}\n\nArcanos:\n${cardsList}\n\n🔮 Resposta do Oráculo:\n${reading.interpretation.directAnswer}\n\n🌟 Conselho:\n${reading.interpretation.advice}\n\n-- Revelado pelo app MeuTarot`;

      await Share.share({
        message,
        title: `Tiragem de Tarot - ${reading.spreadTitle}`,
      });
    } catch (e) {
      console.warn('Share error', e);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Remover Tiragem',
      'Deseja realmente excluir esta leitura do seu histórico?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await StorageService.deleteReading(reading.userId, reading.id);
            if (onDeleted) onDeleted();
            onBack();
          },
        },
      ]
    );
  };

  return (
    <StarBackground>
      <Header
        title="Revelação do Oráculo"
        subtitle={reading.spreadTitle}
        showBack
        onBack={onBack}
        rightAction={{
          icon: 'share-social-outline',
          onPress: handleShare,
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Date and spread metadata */}
        <View style={styles.metaRow}>
          <View style={styles.spreadBadge}>
            <Text style={styles.spreadBadgeText}>{reading.spreadTitle}</Text>
          </View>
          <Text style={styles.dateText}>{formattedDate}</Text>
        </View>

        {/* Question card */}
        <View style={styles.questionCard}>
          <Text style={styles.questionLabel}>A Pergunta Formulada:</Text>
          <Text style={styles.questionText}>"{reading.question}"</Text>
        </View>

        {/* Energy Vibe & Dominant Element */}
        <View style={styles.vibesContainer}>
          <View style={styles.vibePill}>
            <Ionicons name="sparkles" size={14} color={MysticColors.gold} />
            <Text style={styles.vibePillText}>{reading.interpretation.energyVibe}</Text>
          </View>
        </View>

        {/* Cards Row / Visual */}
        <Text style={styles.sectionTitle}>Cartas Sorteadas (Toque para Detalhes):</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cardsScroll}
        >
          {reading.cards.map((dc, idx) => (
            <TarotCardView
              key={idx}
              card={dc.card}
              isReversed={dc.isReversed}
              positionName={dc.positionName}
              size="md"
              onPress={() => setSelectedCard({ card: dc.card, isReversed: dc.isReversed })}
            />
          ))}
        </ScrollView>

        {/* Oracle Direct Answer */}
        <View style={styles.interpretationCard}>
          <LinearGradient
            colors={['#32165C', '#1A0B33']}
            style={styles.cardGradient}
          >
            <View style={styles.cardHeaderRow}>
              <Ionicons name="eye" size={20} color={MysticColors.gold} />
              <Text style={styles.cardHeaderTitle}>Resposta do Oráculo</Text>
            </View>
            <Text style={styles.directAnswerText}>
              {reading.interpretation.directAnswer}
            </Text>
          </LinearGradient>
        </View>

        {/* Detailed Positions Analysis */}
        <View style={styles.sectionBox}>
          <Text style={styles.sectionHeaderTitle}>📖 Interpretação Detalhada por Posição:</Text>
          {reading.cards.map((dc, idx) => (
            <View key={idx} style={styles.cardDetailItem}>
              <View style={styles.cardDetailHeader}>
                <Text style={styles.positionBadgeTitle}>{dc.positionName}</Text>
                <Text style={styles.cardItemTitle}>
                  {dc.card.name} {dc.isReversed ? '⚠️ Invertida' : '☀️ Ereta'}
                </Text>
              </View>
              <Text style={styles.cardMeaningText}>
                {dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright}
              </Text>
              <Text style={styles.cardAdviceMini}>
                Conselho: {dc.card.advice}
              </Text>
            </View>
          ))}
        </View>

        {/* Sacred Advice */}
        <View style={styles.adviceBox}>
          <View style={styles.adviceHeaderRow}>
            <Ionicons name="flame" size={18} color={MysticColors.gold} />
            <Text style={styles.adviceHeaderTitle}>Direcionamento Espiritual</Text>
          </View>
          <Text style={styles.adviceText}>{reading.interpretation.advice}</Text>
        </View>

        {/* Elemental Balance */}
        <View style={styles.elementalBox}>
          <Ionicons name="planet" size={18} color={MysticColors.celestialBlue} />
          <Text style={styles.elementalText}>
            {reading.interpretation.elementalBalance}
          </Text>
        </View>

        {/* Footer Actions */}
        <View style={styles.actionsRow}>
          <MysticButton
            title="Compartilhar Tiragem"
            variant="purple"
            size="md"
            icon="share-social-outline"
            onPress={handleShare}
            style={{ flex: 1, marginRight: 8 }}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={handleDelete}
            activeOpacity={0.8}
          >
            <Ionicons name="trash-outline" size={20} color={MysticColors.error} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Card detail modal */}
      <CardDetailModal
        card={selectedCard?.card || null}
        isReversed={selectedCard?.isReversed}
        visible={!!selectedCard}
        onClose={() => setSelectedCard(null)}
      />
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  spreadBadge: {
    backgroundColor: 'rgba(157, 101, 232, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  spreadBadgeText: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '700',
  },
  dateText: {
    color: MysticColors.textMuted,
    fontSize: 12,
  },
  questionCard: {
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 14,
  },
  questionLabel: {
    color: MysticColors.gold,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  questionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
    marginTop: 4,
  },
  vibesContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  vibePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(73, 16, 136, 0.5)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MysticColors.borderGlow,
  },
  vibePillText: {
    color: MysticColors.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardsScroll: {
    gap: 8,
    paddingBottom: 16,
  },
  interpretationCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.gold,
    marginBottom: 16,
  },
  cardGradient: {
    padding: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  cardHeaderTitle: {
    color: MysticColors.gold,
    fontSize: 16,
    fontWeight: '800',
  },
  directAnswerText: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    lineHeight: 22,
  },
  sectionBox: {
    backgroundColor: 'rgba(23, 12, 51, 0.6)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 16,
  },
  sectionHeaderTitle: {
    color: MysticColors.purpleLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardDetailItem: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 101, 232, 0.15)',
    paddingBottom: 10,
    marginBottom: 10,
  },
  cardDetailHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  positionBadgeTitle: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '700',
  },
  cardItemTitle: {
    color: MysticColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  cardMeaningText: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  cardAdviceMini: {
    color: MysticColors.amethyst,
    fontSize: 11,
    fontStyle: 'italic',
    marginTop: 4,
  },
  adviceBox: {
    backgroundColor: 'rgba(73, 16, 136, 0.4)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 206, 98, 0.35)',
    marginBottom: 14,
  },
  adviceHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  adviceHeaderTitle: {
    color: MysticColors.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  adviceText: {
    color: MysticColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  elementalBox: {
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
  elementalText: {
    flex: 1,
    color: MysticColors.celestialBlue,
    fontSize: 12,
    lineHeight: 17,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  deleteButton: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: 'rgba(245, 101, 101, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(245, 101, 101, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

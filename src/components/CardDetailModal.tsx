import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { TarotCard } from '../types/tarot';
import { MysticColors } from '../theme/colors';

const { height } = Dimensions.get('window');

interface CardDetailModalProps {
  card: TarotCard | null;
  isReversed?: boolean;
  visible: boolean;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isReversed = false,
  visible,
  onClose,
}) => {
  if (!card) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <LinearGradient
            colors={['#1F0F3D', '#0D061F']}
            style={styles.gradient}
          >
            {/* Header bar */}
            <View style={styles.header}>
              <View style={styles.tagGroup}>
                <View style={styles.elementBadge}>
                  <Text style={styles.elementText}>✦ {card.element}</Text>
                </View>
                {card.astrology && (
                  <View style={styles.astroBadge}>
                    <Text style={styles.astroText}>🪐 {card.astrology}</Text>
                  </View>
                )}
                {isReversed && (
                  <View style={styles.reversedTag}>
                    <Text style={styles.reversedTagText}>INVERTIDA</Text>
                  </View>
                )}
              </View>

              <TouchableOpacity
                onPress={onClose}
                style={styles.closeBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={MysticColors.purpleLight} />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Card visual showcase */}
              <View style={styles.imageContainer}>
                <View
                  style={[
                    styles.imageBorder,
                    isReversed && styles.reversedTransform,
                  ]}
                >
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.cardTitle}>{card.name}</Text>
                <Text style={styles.cardEnTitle}>{card.nameEn}</Text>
              </View>

              {/* Keywords */}
              <View style={styles.keywordsRow}>
                {card.keywords.map((kw, i) => (
                  <View key={i} style={styles.keywordPill}>
                    <Text style={styles.keywordText}>{kw}</Text>
                  </View>
                ))}
              </View>

              {/* Advice */}
              <View style={styles.adviceBox}>
                <View style={styles.adviceHeader}>
                  <Ionicons name="sparkles" size={16} color={MysticColors.gold} />
                  <Text style={styles.adviceTitle}>Conselho do Oráculo</Text>
                </View>
                <Text style={styles.adviceContent}>{card.advice}</Text>
              </View>

              {/* Meanings */}
              <View style={styles.section}>
                <Text style={styles.sectionHeading}>
                  {isReversed ? '⚠️ Significado Invertido (Nesta Tiragem)' : '☀️ Significado Ereto'}
                </Text>
                <Text style={styles.meaningText}>
                  {isReversed ? card.meaningReversed : card.meaningUpright}
                </Text>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionHeading}>
                  {isReversed ? '☀️ Significado Ereto' : '🌙 Significado Invertido'}
                </Text>
                <Text style={styles.meaningTextSecondary}>
                  {isReversed ? card.meaningUpright : card.meaningReversed}
                </Text>
              </View>

              {/* Description */}
              {card.description && (
                <View style={styles.section}>
                  <Text style={styles.sectionHeading}>🔮 Simbologia & Mistério</Text>
                  <Text style={styles.descText}>{card.description}</Text>
                </View>
              )}
            </ScrollView>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 2, 14, 0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    height: height * 0.88,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    overflow: 'hidden',
    borderTopWidth: 1.5,
    borderColor: MysticColors.borderGlow,
  },
  gradient: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 101, 232, 0.15)',
  },
  tagGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  elementBadge: {
    backgroundColor: 'rgba(78, 168, 222, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MysticColors.celestialBlue,
  },
  elementText: {
    color: MysticColors.celestialBlue,
    fontSize: 12,
    fontWeight: '700',
  },
  astroBadge: {
    backgroundColor: 'rgba(199, 125, 255, 0.18)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  astroText: {
    color: MysticColors.amethyst,
    fontSize: 12,
    fontWeight: '600',
  },
  reversedTag: {
    backgroundColor: 'rgba(245, 101, 101, 0.3)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MysticColors.error,
  },
  reversedTagText: {
    color: MysticColors.error,
    fontSize: 11,
    fontWeight: '800',
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(35, 18, 77, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingVertical: 16,
    paddingBottom: 40,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  imageBorder: {
    width: 140,
    height: 230,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: MysticColors.gold,
    backgroundColor: '#0D061F',
    shadowColor: MysticColors.purpleVibrant,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 12,
    elevation: 8,
  },
  reversedTransform: {
    transform: [{ rotate: '180deg' }],
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: MysticColors.textPrimary,
    marginTop: 12,
    letterSpacing: 0.5,
  },
  cardEnTitle: {
    fontSize: 13,
    color: MysticColors.textMuted,
    fontStyle: 'italic',
    marginTop: 2,
  },
  keywordsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 16,
  },
  keywordPill: {
    backgroundColor: 'rgba(157, 101, 232, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  keywordText: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '600',
  },
  adviceBox: {
    backgroundColor: 'rgba(73, 16, 136, 0.35)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(245, 206, 98, 0.35)',
    marginBottom: 18,
  },
  adviceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  adviceTitle: {
    color: MysticColors.gold,
    fontWeight: '700',
    fontSize: 14,
  },
  adviceContent: {
    color: MysticColors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  section: {
    marginBottom: 16,
    backgroundColor: 'rgba(23, 12, 51, 0.6)',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.12)',
  },
  sectionHeading: {
    color: MysticColors.purpleLight,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
  },
  meaningText: {
    color: MysticColors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
  },
  meaningTextSecondary: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    lineHeight: 20,
  },
  descText: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
});

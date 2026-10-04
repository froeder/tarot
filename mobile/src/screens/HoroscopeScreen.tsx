import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { ZODIAC_SIGNS } from '../data/horoscopeData';
import { ZodiacSign } from '../types/tarot';
import { MysticColors } from '../theme/colors';

interface HoroscopeScreenProps {
  initialSignId?: string;
  onBack?: () => void;
}

export const HoroscopeScreen: React.FC<HoroscopeScreenProps> = ({
  initialSignId = 'aries',
  onBack,
}) => {
  const [selectedSignId, setSelectedSignId] = useState(initialSignId.toLowerCase());

  const currentSign: ZodiacSign =
    ZODIAC_SIGNS.find((s) => s.id === selectedSignId) || ZODIAC_SIGNS[0];

  return (
    <StarBackground>
      <Header
        title="Horóscopo Místico"
        subtitle="Previsões dos 12 Signos do Zodíaco"
        showBack={!!onBack}
        onBack={onBack}
      />

      {/* Horizontal Sign Selector */}
      <View style={styles.selectorWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.signScroll}
        >
          {ZODIAC_SIGNS.map((sign) => {
            const isSelected = sign.id === currentSign.id;
            return (
              <TouchableOpacity
                key={sign.id}
                activeOpacity={0.8}
                onPress={() => setSelectedSignId(sign.id)}
                style={[
                  styles.signTab,
                  isSelected && styles.signTabSelected,
                ]}
              >
                <Text
                  style={[
                    styles.signSymbol,
                    isSelected && styles.signSymbolSelected,
                  ]}
                >
                  {sign.symbol}
                </Text>
                <Text
                  style={[
                    styles.signName,
                    isSelected && styles.signNameSelected,
                  ]}
                >
                  {sign.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Main Sign Showcase Card */}
        <View style={styles.heroCard}>
          <LinearGradient
            colors={['#3B146B', '#1C0B36']}
            style={styles.heroGradient}
          >
            <View style={styles.heroTopRow}>
              <View>
                <Text style={styles.heroDates}>{currentSign.dates}</Text>
                <Text style={styles.heroSignName}>{currentSign.name}</Text>
              </View>
              <View style={styles.heroSymbolOrb}>
                <Text style={styles.heroSymbolText}>{currentSign.symbol}</Text>
              </View>
            </View>

            {/* Traits */}
            <View style={styles.traitsRow}>
              <View style={styles.elementBadge}>
                <Text style={styles.elementBadgeText}>✦ {currentSign.element}</Text>
              </View>
              <View style={styles.planetBadge}>
                <Text style={styles.planetBadgeText}>🪐 {currentSign.rulingPlanet}</Text>
              </View>
              {currentSign.traits.slice(0, 2).map((tr, i) => (
                <View key={i} style={styles.traitPill}>
                  <Text style={styles.traitPillText}>{tr}</Text>
                </View>
              ))}
            </View>
          </LinearGradient>
        </View>

        {/* Daily Energy Meter */}
        <View style={styles.energyCard}>
          <View style={styles.energyHeader}>
            <View style={styles.energyTitleGroup}>
              <Ionicons name="flash" size={18} color={MysticColors.gold} />
              <Text style={styles.energyTitle}>Vibração Cósmica Hoje</Text>
            </View>
            <Text style={styles.energyPercentText}>
              {currentSign.dailyHoroscope.energy}%
            </Text>
          </View>
          <View style={styles.energyBarBg}>
            <LinearGradient
              colors={[MysticColors.purpleVibrant, MysticColors.gold]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[
                styles.energyBarFill,
                { width: `${currentSign.dailyHoroscope.energy}%` },
              ]}
            />
          </View>
        </View>

        {/* General Horoscope */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="sparkles" size={18} color={MysticColors.gold} />
            <Text style={styles.sectionTitle}>Panorama Astral</Text>
          </View>
          <Text style={styles.sectionBody}>
            {currentSign.dailyHoroscope.general}
          </Text>
        </View>

        {/* Love Horoscope */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={18} color="#FF6B8B" />
            <Text style={styles.sectionTitle}>Amor & Coração</Text>
          </View>
          <Text style={styles.sectionBody}>
            {currentSign.dailyHoroscope.love}
          </Text>
        </View>

        {/* Career & Work */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Ionicons name="briefcase" size={18} color={MysticColors.celestialBlue} />
            <Text style={styles.sectionTitle}>Trabalho & Finanças</Text>
          </View>
          <Text style={styles.sectionBody}>
            {currentSign.dailyHoroscope.career}
          </Text>
        </View>

        {/* Mystic Lucky Elements */}
        <View style={styles.luckyGrid}>
          <View style={styles.luckyItem}>
            <Ionicons name="dice" size={20} color={MysticColors.gold} />
            <Text style={styles.luckyLabel}>Número da Sorte</Text>
            <Text style={styles.luckyValue}>
              {currentSign.dailyHoroscope.luckyNumber}
            </Text>
          </View>

          <View style={styles.luckyItem}>
            <Ionicons name="color-palette" size={20} color={MysticColors.amethyst} />
            <Text style={styles.luckyLabel}>Cor do Dia</Text>
            <Text style={styles.luckyValue}>
              {currentSign.dailyHoroscope.luckyColor}
            </Text>
          </View>

          <View style={styles.luckyItem}>
            <Ionicons name="diamond" size={20} color={MysticColors.celestialBlue} />
            <Text style={styles.luckyLabel}>Cristal Guia</Text>
            <Text style={styles.luckyValue}>
              {currentSign.dailyHoroscope.crystal}
            </Text>
          </View>
        </View>
      </ScrollView>
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  selectorWrapper: {
    backgroundColor: 'rgba(13, 6, 31, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 101, 232, 0.15)',
    paddingVertical: 10,
  },
  signScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  signTab: {
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: 'rgba(35, 18, 77, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.15)',
    minWidth: 70,
  },
  signTabSelected: {
    backgroundColor: MysticColors.purpleDeep,
    borderColor: MysticColors.gold,
  },
  signSymbol: {
    fontSize: 20,
    color: MysticColors.textSecondary,
    marginBottom: 2,
  },
  signSymbolSelected: {
    color: MysticColors.gold,
  },
  signName: {
    fontSize: 11,
    color: MysticColors.textSecondary,
    fontWeight: '600',
  },
  signNameSelected: {
    color: MysticColors.textPrimary,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  heroCard: {
    borderRadius: 18,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
    marginBottom: 16,
  },
  heroGradient: {
    padding: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  heroDates: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '600',
  },
  heroSignName: {
    color: '#FFF',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 2,
  },
  heroSymbolOrb: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(73, 16, 136, 0.6)',
    borderWidth: 1.5,
    borderColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroSymbolText: {
    fontSize: 28,
    color: MysticColors.gold,
  },
  traitsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  elementBadge: {
    backgroundColor: 'rgba(78, 168, 222, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: MysticColors.celestialBlue,
  },
  elementBadgeText: {
    color: MysticColors.celestialBlue,
    fontSize: 11,
    fontWeight: '700',
  },
  planetBadge: {
    backgroundColor: 'rgba(199, 125, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  planetBadgeText: {
    color: MysticColors.amethyst,
    fontSize: 11,
    fontWeight: '700',
  },
  traitPill: {
    backgroundColor: 'rgba(247, 244, 253, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  traitPillText: {
    color: MysticColors.textSecondary,
    fontSize: 11,
  },
  energyCard: {
    backgroundColor: 'rgba(23, 12, 51, 0.75)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 14,
  },
  energyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  energyTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  energyTitle: {
    color: MysticColors.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
  energyPercentText: {
    color: MysticColors.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  energyBarBg: {
    height: 8,
    backgroundColor: 'rgba(7, 3, 18, 0.8)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  energyBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  sectionCard: {
    backgroundColor: 'rgba(23, 12, 51, 0.65)',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  sectionTitle: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  sectionBody: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    lineHeight: 19,
  },
  luckyGrid: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6,
  },
  luckyItem: {
    flex: 1,
    backgroundColor: 'rgba(35, 18, 77, 0.5)',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
  },
  luckyLabel: {
    color: MysticColors.textMuted,
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
  luckyValue: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '800',
    marginTop: 2,
    textAlign: 'center',
  },
});

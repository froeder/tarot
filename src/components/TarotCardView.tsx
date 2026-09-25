import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { TarotCard } from '../types/tarot';
import { MysticColors, Gradients } from '../theme/colors';

interface TarotCardViewProps {
  card?: TarotCard;
  isReversed?: boolean;
  positionName?: string;
  isRevealed?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  disabled?: boolean;
}

export const TarotCardView: React.FC<TarotCardViewProps> = ({
  card,
  isReversed = false,
  positionName,
  isRevealed = true,
  size = 'md',
  onPress,
  disabled = false,
}) => {
  const animatedValue = useRef(new Animated.Value(isRevealed ? 180 : 0)).current;

  useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: isRevealed ? 180 : 0,
      friction: 8,
      tension: 10,
      useNativeDriver: true,
    }).start();
  }, [isRevealed]);

  const frontInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['180deg', '360deg'],
  });

  const backInterpolate = animatedValue.interpolate({
    inputRange: [0, 180],
    outputRange: ['0deg', '180deg'],
  });

  const frontAnimatedStyle = {
    transform: [{ rotateY: frontInterpolate }],
  };

  const backAnimatedStyle = {
    transform: [{ rotateY: backInterpolate }],
  };

  const handlePress = () => {
    if (disabled) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {}
    if (onPress) onPress();
  };

  const dimensions = {
    sm: { width: 90, height: 145 },
    md: { width: 130, height: 215 },
    lg: { width: 190, height: 310 },
  }[size];

  return (
    <View style={styles.wrapper}>
      {positionName && (
        <View style={styles.positionBadge}>
          <Text style={styles.positionText} numberOfLines={1}>
            {positionName}
          </Text>
        </View>
      )}

      <TouchableOpacity
        activeOpacity={0.88}
        onPress={handlePress}
        disabled={disabled}
        style={[styles.cardContainer, dimensions]}
      >
        {/* Back of Card (Shown when unrevealed) */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardBack,
            dimensions,
            backAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={Gradients.cardBack}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardBackGradient}
          >
            <View style={styles.sacredGeometry}>
              <View style={styles.outerCircle}>
                <View style={styles.innerSquare} />
                <Ionicons name="sparkles" size={size === 'sm' ? 18 : 30} color={MysticColors.gold} />
              </View>
              <Text style={styles.backSigilText}>✦</Text>
            </View>
          </LinearGradient>
        </Animated.View>

        {/* Front of Card (Shown when revealed) */}
        <Animated.View
          style={[
            styles.cardFace,
            styles.cardFront,
            dimensions,
            frontAnimatedStyle,
          ]}
        >
          <LinearGradient
            colors={['#241247', '#120826']}
            style={styles.frontContainer}
          >
            {card ? (
              <>
                <View
                  style={[
                    styles.imageWrapper,
                    isReversed && styles.reversedImage,
                  ]}
                >
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.cardImage}
                    resizeMode="cover"
                  />
                  {isReversed && (
                    <View style={styles.reversedBadge}>
                      <Text style={styles.reversedBadgeText}>INVERTIDA</Text>
                    </View>
                  )}
                </View>

                {/* Card Title & Archetype Info */}
                <View style={styles.cardInfo}>
                  <Text style={styles.cardName} numberOfLines={1}>
                    {card.name}
                  </Text>
                  {size !== 'sm' && card.keywords && (
                    <Text style={styles.cardKeywords} numberOfLines={1}>
                      {card.keywords.slice(0, 2).join(' • ')}
                    </Text>
                  )}
                </View>
              </>
            ) : (
              <View style={styles.emptyCard}>
                <Ionicons name="help" size={24} color={MysticColors.textMuted} />
              </View>
            )}
          </LinearGradient>
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    margin: 6,
  },
  positionBadge: {
    backgroundColor: 'rgba(73, 16, 136, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 6,
  },
  positionText: {
    color: MysticColors.goldLight,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardContainer: {
    position: 'relative',
    borderRadius: 12,
    shadowColor: MysticColors.purpleVibrant,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 8,
  },
  cardFace: {
    position: 'absolute',
    borderRadius: 12,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
  },
  cardBack: {
    zIndex: 1,
  },
  cardFront: {
    zIndex: 2,
  },
  cardBackGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  sacredGeometry: {
    width: '85%',
    height: '90%',
    borderWidth: 1,
    borderColor: 'rgba(245, 206, 98, 0.4)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerCircle: {
    width: '60%',
    height: '40%',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerSquare: {
    position: 'absolute',
    width: '70%',
    height: '70%',
    borderWidth: 1,
    borderColor: 'rgba(245, 206, 98, 0.3)',
    transform: [{ rotate: '45deg' }],
  },
  backSigilText: {
    marginTop: 8,
    fontSize: 16,
    color: MysticColors.goldLight,
  },
  frontContainer: {
    flex: 1,
  },
  imageWrapper: {
    flex: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  reversedImage: {
    transform: [{ rotate: '180deg' }],
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  reversedBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(245, 101, 101, 0.88)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  reversedBadgeText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardInfo: {
    paddingVertical: 5,
    paddingHorizontal: 4,
    backgroundColor: 'rgba(13, 6, 31, 0.92)',
    alignItems: 'center',
  },
  cardName: {
    color: MysticColors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  cardKeywords: {
    color: MysticColors.goldLight,
    fontSize: 9,
    marginTop: 1,
    textAlign: 'center',
  },
  emptyCard: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

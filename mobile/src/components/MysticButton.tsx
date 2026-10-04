import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { MysticColors, Gradients } from '../theme/colors';

interface MysticButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'purple' | 'gold' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
  disabled?: boolean;
  style?: any;
}

export const MysticButton: React.FC<MysticButtonProps> = ({
  title,
  onPress,
  variant = 'purple',
  size = 'md',
  icon,
  loading = false,
  disabled = false,
  style,
}) => {
  const handlePress = () => {
    if (disabled || loading) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // Haptics optional on web
    }
    onPress();
  };

  const isOutline = variant === 'outline';
  const isGhost = variant === 'ghost';
  const isGold = variant === 'gold';

  const gradientColors = isGold
    ? Gradients.buttonGold
    : Gradients.buttonPurple;

  return (
    <TouchableOpacity
      activeOpacity={0.82}
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.buttonBase,
        styles[`size_${size}`],
        isOutline && styles.outlineButton,
        isGhost && styles.ghostButton,
        disabled && styles.disabled,
        style,
      ]}
    >
      {!isOutline && !isGhost ? (
        <LinearGradient
          colors={gradientColors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, styles[`size_${size}`]]}
        >
          {loading ? (
            <ActivityIndicator color={isGold ? '#1A0C2F' : '#FFF'} />
          ) : (
            <View style={styles.contentRow}>
              {icon && (
                <Ionicons
                  name={icon}
                  size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
                  color={isGold ? '#1A0C2F' : '#FFF'}
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  styles.text,
                  styles[`text_${size}`],
                  isGold && styles.textGoldDark,
                ]}
              >
                {title}
              </Text>
            </View>
          )}
        </LinearGradient>
      ) : (
        <View style={styles.contentRow}>
          {loading ? (
            <ActivityIndicator color={MysticColors.purpleLight} />
          ) : (
            <>
              {icon && (
                <Ionicons
                  name={icon}
                  size={size === 'sm' ? 16 : size === 'lg' ? 22 : 18}
                  color={isOutline ? MysticColors.amethyst : MysticColors.textSecondary}
                  style={styles.icon}
                />
              )}
              <Text
                style={[
                  styles.text,
                  styles[`text_${size}`],
                  isOutline && styles.textAmethyst,
                  isGhost && styles.textGhost,
                ]}
              >
                {title}
              </Text>
            </>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonBase: {
    borderRadius: 14,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: 8,
  },
  size_sm: {
    height: 38,
    paddingHorizontal: 14,
  },
  size_md: {
    height: 48,
    paddingHorizontal: 20,
  },
  size_lg: {
    height: 56,
    paddingHorizontal: 26,
  },
  text: {
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  text_sm: {
    fontSize: 13,
  },
  text_md: {
    fontSize: 15,
  },
  text_lg: {
    fontSize: 17,
  },
  textGoldDark: {
    color: '#15082B',
  },
  textAmethyst: {
    color: MysticColors.amethyst,
  },
  textGhost: {
    color: MysticColors.textSecondary,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: MysticColors.purpleMedium,
    backgroundColor: 'rgba(73, 16, 136, 0.25)',
  },
  ghostButton: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.5,
  },
});

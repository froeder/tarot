import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MysticColors } from '../theme/colors';

interface HeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: {
    icon: keyof typeof Ionicons.glyphMap;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  rightAction,
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          {showBack && (
            <TouchableOpacity
              onPress={onBack}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={MysticColors.purpleLight} />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.titleContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          )}
        </View>

        <View style={styles.rightContainer}>
          {rightAction && (
            <TouchableOpacity
              onPress={rightAction.onPress}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons
                name={rightAction.icon}
                size={22}
                color={MysticColors.gold}
              />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: 'rgba(7, 3, 18, 0.95)',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 24) : 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 101, 232, 0.15)',
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  leftContainer: {
    width: 40,
    alignItems: 'flex-start',
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    color: MysticColors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  subtitle: {
    color: MysticColors.goldLight,
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  rightContainer: {
    width: 40,
    alignItems: 'flex-end',
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(35, 18, 77, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

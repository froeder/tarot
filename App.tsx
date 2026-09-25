import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { AskTarotScreen } from './src/screens/AskTarotScreen';
import { HoroscopeScreen } from './src/screens/HoroscopeScreen';
import { HistoryScreen } from './src/screens/HistoryScreen';
import { ProfileScreen } from './src/screens/ProfileScreen';
import { DeckScreen } from './src/screens/DeckScreen';
import { ReadingDetailScreen } from './src/screens/ReadingDetailScreen';
import { AuthScreen } from './src/screens/AuthScreen';
import { StarBackground } from './src/components/StarBackground';
import { TarotReading, SpreadType } from './src/types/tarot';
import { MysticColors } from './src/theme/colors';

type TabType = 'home' | 'ask' | 'horoscope' | 'history' | 'profile';

function MainApp() {
  const { user, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Subscreen navigation
  const [activeSpreadId, setActiveSpreadId] = useState<SpreadType | undefined>('three_cards');
  const [selectedHoroscopeSign, setSelectedHoroscopeSign] = useState<string | undefined>('aries');
  const [viewingReading, setViewingReading] = useState<TarotReading | null>(null);
  const [isViewingDeck, setIsViewingDeck] = useState(false);

  if (isLoading) {
    return (
      <StarBackground>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={MysticColors.gold} />
          <Text style={styles.loadingText}>Conectando ao Cosmos...</Text>
        </View>
      </StarBackground>
    );
  }

  // If user is not authenticated and not in guest mode, show AuthScreen
  if (!user) {
    return <AuthScreen />;
  }

  // Render subscreen: Reading Detail
  if (viewingReading) {
    return (
      <ReadingDetailScreen
        reading={viewingReading}
        onBack={() => setViewingReading(null)}
      />
    );
  }

  // Render subscreen: Deck Encyclopedia
  if (isViewingDeck) {
    return <DeckScreen onBack={() => setIsViewingDeck(false)} />;
  }

  return (
    <View style={styles.appContainer}>
      <StatusBar style="light" />

      {/* Screen Content */}
      <View style={styles.screenContainer}>
        {activeTab === 'home' && (
          <HomeScreen
            onNavigateToAsk={(spreadId) => {
              setActiveSpreadId(spreadId || 'three_cards');
              setActiveTab('ask');
            }}
            onNavigateToHoroscope={(signId) => {
              setSelectedHoroscopeSign(signId);
              setActiveTab('horoscope');
            }}
            onNavigateToDeck={() => setIsViewingDeck(true)}
            onNavigateToHistory={() => setActiveTab('history')}
          />
        )}

        {activeTab === 'ask' && (
          <AskTarotScreen
            initialSpreadId={activeSpreadId}
            onReadingComplete={(reading) => setViewingReading(reading)}
          />
        )}

        {activeTab === 'horoscope' && (
          <HoroscopeScreen
            initialSignId={selectedHoroscopeSign}
          />
        )}

        {activeTab === 'history' && (
          <HistoryScreen
            onSelectReading={(reading) => setViewingReading(reading)}
            onNavigateToAsk={() => setActiveTab('ask')}
          />
        )}

        {activeTab === 'profile' && <ProfileScreen />}
      </View>

      {/* Mystic Bottom Navigation Bar */}
      <SafeAreaView style={styles.bottomNavSafe}>
        <View style={styles.bottomNav}>
          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('home')}
          >
            <Ionicons
              name={activeTab === 'home' ? 'sparkles' : 'sparkles-outline'}
              size={22}
              color={activeTab === 'home' ? MysticColors.gold : MysticColors.textSecondary}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'home' && styles.navLabelActive,
              ]}
            >
              Início
            </Text>
            {activeTab === 'home' && <View style={styles.navActiveDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('ask')}
          >
            <View style={styles.navAskOrb}>
              <Ionicons
                name="color-wand"
                size={22}
                color="#FFF"
              />
            </View>
            <Text
              style={[
                styles.navLabel,
                activeTab === 'ask' && styles.navLabelActive,
              ]}
            >
              Perguntar
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('horoscope')}
          >
            <Ionicons
              name={activeTab === 'horoscope' ? 'planet' : 'planet-outline'}
              size={22}
              color={activeTab === 'horoscope' ? MysticColors.gold : MysticColors.textSecondary}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'horoscope' && styles.navLabelActive,
              ]}
            >
              Horóscopo
            </Text>
            {activeTab === 'horoscope' && <View style={styles.navActiveDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('history')}
          >
            <Ionicons
              name={activeTab === 'history' ? 'time' : 'time-outline'}
              size={22}
              color={activeTab === 'history' ? MysticColors.gold : MysticColors.textSecondary}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'history' && styles.navLabelActive,
              ]}
            >
              Histórico
            </Text>
            {activeTab === 'history' && <View style={styles.navActiveDot} />}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navItem}
            activeOpacity={0.8}
            onPress={() => setActiveTab('profile')}
          >
            <Ionicons
              name={activeTab === 'profile' ? 'person' : 'person-outline'}
              size={22}
              color={activeTab === 'profile' ? MysticColors.gold : MysticColors.textSecondary}
            />
            <Text
              style={[
                styles.navLabel,
                activeTab === 'profile' && styles.navLabelActive,
              ]}
            >
              Perfil
            </Text>
            {activeTab === 'profile' && <View style={styles.navActiveDot} />}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    backgroundColor: MysticColors.bgVoid,
  },
  screenContainer: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    color: MysticColors.goldLight,
    marginTop: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomNavSafe: {
    backgroundColor: 'rgba(10, 4, 22, 0.95)',
    borderTopWidth: 1.5,
    borderTopColor: 'rgba(157, 101, 232, 0.25)',
  },
  bottomNav: {
    flexDirection: 'row',
    height: 64,
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
    height: '100%',
  },
  navAskOrb: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: MysticColors.purpleVibrant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    borderWidth: 1.5,
    borderColor: MysticColors.gold,
  },
  navLabel: {
    color: MysticColors.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  navLabelActive: {
    color: MysticColors.gold,
    fontWeight: '800',
  },
  navActiveDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MysticColors.gold,
  },
});

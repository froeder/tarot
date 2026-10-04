import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { MysticButton } from '../components/MysticButton';
import { useAuth } from '../context/AuthContext';
import { ZODIAC_SIGNS } from '../data/horoscopeData';
import { isFirebaseInitialized } from '../services/firebase';
import { MysticColors } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditingZodiac, setIsEditingZodiac] = useState(false);

  const currentZodiac = ZODIAC_SIGNS.find(
    (z) => z.name.toLowerCase() === (user?.zodiacSign || 'peixes').toLowerCase()
  ) || ZODIAC_SIGNS[0];

  const handleSelectZodiac = async (signName: string) => {
    await updateProfile({ zodiacSign: signName });
    setIsEditingZodiac(false);
  };

  return (
    <StarBackground>
      <Header title="Perfil Místico" subtitle="Sua jornada estelar" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <LinearGradient
            colors={['#32165C', '#170A2D']}
            style={styles.profileGradient}
          >
            <View style={styles.avatarOrb}>
              {user?.photoURL ? (
                <Image
                  source={{ uri: user.photoURL }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <Text style={styles.avatarSymbol}>{currentZodiac.symbol}</Text>
              )}
            </View>

            <Text style={styles.userName}>{user?.displayName || 'Consulente Astral'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Visitante Místico'}</Text>

            {user?.isAnonymous ? (
              <View style={styles.guestBadge}>
                <Ionicons name="sparkles" size={12} color={MysticColors.gold} />
                <Text style={styles.guestBadgeText}>Modo Visitante Místico</Text>
              </View>
            ) : (
              <View style={styles.googleBadge}>
                <Ionicons name="logo-google" size={12} color="#EA4335" />
                <Text style={styles.googleBadgeText}>Conta Astral Vinculada</Text>
              </View>
            )}

            {/* Zodiac Pill & Edit */}
            <TouchableOpacity
              style={styles.zodiacCardPill}
              activeOpacity={0.8}
              onPress={() => setIsEditingZodiac(true)}
            >
              <Text style={styles.zodiacPillSymbol}>{currentZodiac.symbol}</Text>
              <Text style={styles.zodiacPillName}>Signo: {currentZodiac.name}</Text>
              <Ionicons name="create-outline" size={16} color={MysticColors.gold} style={{ marginLeft: 6 }} />
            </TouchableOpacity>
          </LinearGradient>
        </View>

        {/* Sync Status Card */}
        <View style={styles.backendCard}>
          <View style={styles.backendHeader}>
            <Ionicons
              name={isFirebaseInitialized ? 'cloud-done-outline' : 'cloud-offline-outline'}
              size={22}
              color={isFirebaseInitialized ? MysticColors.success : MysticColors.gold}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.backendTitle}>Sincronização Astral</Text>
              <Text style={styles.backendStatus}>
                {isFirebaseInitialized
                  ? 'Conectado • Histórico sincronizado em nuvem'
                  : 'Modo Offline • Salvo no aparelho'}
              </Text>
            </View>
          </View>
          <Text style={styles.backendDesc}>
            Suas tiragens e histórico de cartas ficam sincronizados e protegidos com segurança.
          </Text>
        </View>

        {/* Zodiac Attributes */}
        <View style={styles.zodiacDetailsBox}>
          <Text style={styles.detailsHeading}>Seu Mapa Astral Rápido</Text>
          <View style={styles.attributesGrid}>
            <View style={styles.attrItem}>
              <Text style={styles.attrLabel}>Elemento</Text>
              <Text style={styles.attrVal}>✦ {currentZodiac.element}</Text>
            </View>
            <View style={styles.attrItem}>
              <Text style={styles.attrLabel}>Regente</Text>
              <Text style={styles.attrVal}>🪐 {currentZodiac.rulingPlanet}</Text>
            </View>
            <View style={styles.attrItem}>
              <Text style={styles.attrLabel}>Cristal Guia</Text>
              <Text style={styles.attrVal}>💎 {currentZodiac.dailyHoroscope.crystal}</Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <MysticButton
          title="Encerrar Sessão Astral"
          variant="outline"
          size="md"
          icon="log-out-outline"
          onPress={signOut}
          style={styles.signOutBtn}
        />
      </ScrollView>

      {/* Zodiac Selection Modal */}
      <Modal visible={isEditingZodiac} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.zodiacModalBox}>
            <Text style={styles.modalTitle}>Escolha seu Signo Regente</Text>
            <ScrollView style={{ maxHeight: 350 }}>
              {ZODIAC_SIGNS.map((z) => (
                <TouchableOpacity
                  key={z.id}
                  style={styles.zodiacOptionItem}
                  onPress={() => handleSelectZodiac(z.name)}
                >
                  <Text style={styles.modalZodiacSymbol}>{z.symbol}</Text>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.modalZodiacName}>{z.name}</Text>
                    <Text style={styles.modalZodiacDates}>{z.dates}</Text>
                  </View>
                  <Text style={styles.modalZodiacElem}>{z.element}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <MysticButton
              title="Fechar"
              variant="outline"
              size="sm"
              onPress={() => setIsEditingZodiac(false)}
              style={{ marginTop: 12 }}
            />
          </View>
        </View>
      </Modal>
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 110,
  },
  profileCard: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
    marginBottom: 16,
  },
  profileGradient: {
    padding: 24,
    alignItems: 'center',
  },
  avatarOrb: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(73, 16, 136, 0.7)',
    borderWidth: 2,
    borderColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarSymbol: {
    fontSize: 36,
    color: MysticColors.gold,
  },
  userName: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  userEmail: {
    color: MysticColors.textSecondary,
    fontSize: 13,
    marginTop: 2,
  },
  guestBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(245, 206, 98, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  guestBadgeText: {
    color: MysticColors.gold,
    fontSize: 11,
    fontWeight: '700',
  },
  googleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 8,
  },
  googleBadgeText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  zodiacCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(23, 12, 51, 0.8)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginTop: 14,
  },
  zodiacPillSymbol: {
    fontSize: 18,
    color: MysticColors.gold,
    marginRight: 6,
  },
  zodiacPillName: {
    color: MysticColors.goldLight,
    fontSize: 14,
    fontWeight: '700',
  },
  backendCard: {
    backgroundColor: 'rgba(23, 12, 51, 0.7)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 16,
  },
  backendHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  backendTitle: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  backendStatus: {
    color: MysticColors.goldLight,
    fontSize: 12,
    marginTop: 1,
  },
  backendDesc: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
  },
  zodiacDetailsBox: {
    backgroundColor: 'rgba(23, 12, 51, 0.6)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 24,
  },
  detailsHeading: {
    color: MysticColors.purpleLight,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 12,
  },
  attributesGrid: {
    flexDirection: 'row',
    gap: 8,
  },
  attrItem: {
    flex: 1,
    backgroundColor: 'rgba(35, 18, 77, 0.5)',
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  attrLabel: {
    color: MysticColors.textMuted,
    fontSize: 10,
    marginBottom: 4,
  },
  attrVal: {
    color: MysticColors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  signOutBtn: {
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 2, 14, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  zodiacModalBox: {
    backgroundColor: '#170A2D',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
  },
  configModalBox: {
    backgroundColor: '#170A2D',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: MysticColors.borderGlow,
  },
  modalTitle: {
    color: MysticColors.gold,
    fontSize: 18,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  configSubtitle: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 14,
    lineHeight: 17,
  },
  zodiacOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(157, 101, 232, 0.15)',
  },
  modalZodiacSymbol: {
    fontSize: 24,
    color: MysticColors.gold,
    width: 34,
    textAlign: 'center',
  },
  modalZodiacName: {
    color: MysticColors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  modalZodiacDates: {
    color: MysticColors.textMuted,
    fontSize: 11,
  },
  modalZodiacElem: {
    color: MysticColors.celestialBlue,
    fontSize: 12,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 10,
  },
  configInputLabel: {
    color: MysticColors.goldLight,
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  configInput: {
    backgroundColor: 'rgba(13, 6, 31, 0.9)',
    borderWidth: 1,
    borderColor: MysticColors.purpleMedium,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    color: '#FFF',
    fontSize: 13,
  },
});

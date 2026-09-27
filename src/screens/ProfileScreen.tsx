import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { Header } from '../components/Header';
import { MysticButton } from '../components/MysticButton';
import { useAuth } from '../context/AuthContext';
import { ZODIAC_SIGNS } from '../data/horoscopeData';
import { isFirebaseInitialized, defaultFirebaseConfig, saveCustomFirebaseConfig } from '../services/firebase';
import { MysticColors } from '../theme/colors';

export const ProfileScreen: React.FC = () => {
  const { user, signOut, updateProfile } = useAuth();
  const [isEditingZodiac, setIsEditingZodiac] = useState(false);
  const [isConfigModalVisible, setIsConfigModalVisible] = useState(false);

  // Firebase config editor state
  const [apiKey, setApiKey] = useState(defaultFirebaseConfig.apiKey);
  const [projectId, setProjectId] = useState(defaultFirebaseConfig.projectId);
  const [authDomain, setAuthDomain] = useState(defaultFirebaseConfig.authDomain);
  const [databaseId, setDatabaseId] = useState(defaultFirebaseConfig.databaseId || 'frojho-tarot');

  const currentZodiac = ZODIAC_SIGNS.find(
    (z) => z.name.toLowerCase() === (user?.zodiacSign || 'peixes').toLowerCase()
  ) || ZODIAC_SIGNS[0];

  const handleSelectZodiac = async (signName: string) => {
    await updateProfile({ zodiacSign: signName });
    setIsEditingZodiac(false);
  };

  const handleSaveFirebaseConfig = async () => {
    await saveCustomFirebaseConfig({
      ...defaultFirebaseConfig,
      apiKey: apiKey.trim(),
      projectId: projectId.trim(),
      authDomain: authDomain.trim(),
      databaseId: databaseId.trim(),
    });
    setIsConfigModalVisible(false);
    Alert.alert('Configuração Salva', 'As novas chaves do Firebase foram gravadas com sucesso!');
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
              <Text style={styles.avatarSymbol}>{currentZodiac.symbol}</Text>
            </View>

            <Text style={styles.userName}>{user?.displayName || 'Consulente Astral'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Visitante Místico'}</Text>

            {user?.isAnonymous && (
              <View style={styles.guestBadge}>
                <Ionicons name="sparkles" size={12} color={MysticColors.gold} />
                <Text style={styles.guestBadgeText}>Modo Visitante Místico</Text>
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

        {/* Backend & Firebase Status Card */}
        <View style={styles.backendCard}>
          <View style={styles.backendHeader}>
            <Ionicons
              name={isFirebaseInitialized ? 'shield-checkmark' : 'cloud-offline'}
              size={22}
              color={isFirebaseInitialized ? MysticColors.success : MysticColors.gold}
            />
            <View style={{ flex: 1, marginLeft: 10 }}>
              <Text style={styles.backendTitle}>Backend Firebase</Text>
              <Text style={styles.backendStatus}>
                {isFirebaseInitialized
                  ? 'Conectado • Auth & Firestore ativos'
                  : 'Modo Offline / Demonstração Ativo'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.configBtn}
              onPress={() => setIsConfigModalVisible(true)}
            >
              <Ionicons name="settings-outline" size={18} color={MysticColors.goldLight} />
            </TouchableOpacity>
          </View>
          <Text style={styles.backendDesc}>
            Suas tiragens e histórico são mantidos e sincronizados com persistência local e nuvem.
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

      {/* Firebase Config Modal */}
      <Modal visible={isConfigModalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.configModalBox}>
            <Text style={styles.modalTitle}>Configuração do Firebase</Text>
            <Text style={styles.configSubtitle}>
              Insira as credenciais do seu projeto Firebase se desejar conectar à sua própria conta:
            </Text>

            <View style={styles.inputGroup}>
              <Text style={styles.configInputLabel}>Project ID:</Text>
              <TextInput
                style={styles.configInput}
                value={projectId}
                onChangeText={setProjectId}
                placeholder="meutarot-app"
                placeholderTextColor={MysticColors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.configInputLabel}>API Key:</Text>
              <TextInput
                style={styles.configInput}
                value={apiKey}
                onChangeText={setApiKey}
                placeholder="AIzaSy..."
                placeholderTextColor={MysticColors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.configInputLabel}>Auth Domain:</Text>
              <TextInput
                style={styles.configInput}
                value={authDomain}
                onChangeText={setAuthDomain}
                placeholder="frojho-tarot.firebaseapp.com"
                placeholderTextColor={MysticColors.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.configInputLabel}>Banco Firestore (Database ID):</Text>
              <TextInput
                style={styles.configInput}
                value={databaseId}
                onChangeText={setDatabaseId}
                placeholder="frojho-tarot"
                placeholderTextColor={MysticColors.textMuted}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
              <MysticButton
                title="Cancelar"
                variant="outline"
                size="md"
                onPress={() => setIsConfigModalVisible(false)}
                style={{ flex: 1 }}
              />
              <MysticButton
                title="Salvar"
                variant="gold"
                size="md"
                onPress={handleSaveFirebaseConfig}
                style={{ flex: 1 }}
              />
            </View>
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
  configBtn: {
    padding: 8,
    backgroundColor: 'rgba(73, 16, 136, 0.5)',
    borderRadius: 10,
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

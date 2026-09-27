import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { StarBackground } from '../components/StarBackground';
import { MysticButton } from '../components/MysticButton';
import { useAuth } from '../context/AuthContext';
import { ZODIAC_SIGNS } from '../data/horoscopeData';
import { MysticColors } from '../theme/colors';

export const AuthScreen: React.FC = () => {
  const { signIn, signUp, signInWithGoogle, signInAsGuest } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [selectedZodiac, setSelectedZodiac] = useState('Peixes');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async () => {
    setErrorMessage('');
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Por favor, preencha todos os campos sagrados.');
      return;
    }

    if (!isLogin && !name.trim()) {
      setErrorMessage('Por favor, informe como o oráculo deve chamar você.');
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signIn(email.trim(), password);
      } else {
        await signUp(email.trim(), password, name.trim(), selectedZodiac);
      }
    } catch (err: any) {
      console.warn('Auth error:', err);
      let msg = 'Erro ao conectar com as energias astrais.';
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        msg = 'E-mail ou senha incorretos.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'Este e-mail já possui um portal sagrado aberto.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'A senha deve conter pelo menos 6 caracteres místicos.';
      }
      setErrorMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: any) {
      console.warn('Google sign-in error:', err);
      let msg = 'Não foi possível autenticar com o Google.';
      if (err.code === 'auth/popup-closed-by-user') {
        msg = 'A janela do Google foi fechada antes de concluir o login.';
      } else if (err.code === 'auth/popup-blocked') {
        msg = 'O navegador bloqueou o pop-up do Google. Permita pop-ups para entrar.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        msg = 'Já existe uma conta associada a este e-mail.';
      } else if (err.message) {
        msg = err.message;
      }
      setErrorMessage(msg);
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    try {
      await signInAsGuest('Buscador Místico', selectedZodiac);
    } catch (err) {
      console.warn('Guest login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <StarBackground>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo & Mystical Title */}
          <View style={styles.headerBox}>
            <View style={styles.orbGlow}>
              <Ionicons name="sparkles" size={38} color={MysticColors.gold} />
            </View>
            <Text style={styles.appTitle}>Meu Tarot</Text>
            <Text style={styles.appSubtitle}>Portal dos Mistérios & Oráculo Cósmico</Text>
          </View>

          {/* Tab Switcher */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[styles.tabBtn, isLogin && styles.tabBtnActive]}
              onPress={() => {
                setIsLogin(true);
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>
                Entrar
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.tabBtn, !isLogin && styles.tabBtnActive]}
              onPress={() => {
                setIsLogin(false);
                setErrorMessage('');
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>
                Criar Conta
              </Text>
            </TouchableOpacity>
          </View>

          {/* Error Message Banner */}
          {errorMessage ? (
            <View style={styles.errorBox}>
              <Ionicons name="alert-circle" size={18} color={MysticColors.error} />
              <Text style={styles.errorText}>{errorMessage}</Text>
            </View>
          ) : null}

          {/* Form */}
          <View style={styles.formCard}>
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Seu Nome / Como prefere ser chamado:</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Ex: Luna Astral"
                  placeholderTextColor={MysticColors.textMuted}
                  value={name}
                  onChangeText={setName}
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>E-mail:</Text>
              <TextInput
                style={styles.input}
                placeholder="seuemail@exemplo.com"
                placeholderTextColor={MysticColors.textMuted}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Senha:</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={MysticColors.textMuted}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            {/* Zodiac Selector when registering */}
            {!isLogin && (
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Seu Signo do Zodíaco:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.zodiacScroll}
                >
                  {ZODIAC_SIGNS.map((z) => {
                    const isSelected = selectedZodiac === z.name;
                    return (
                      <TouchableOpacity
                        key={z.id}
                        onPress={() => setSelectedZodiac(z.name)}
                        style={[
                          styles.zodiacChip,
                          isSelected && styles.zodiacChipSelected,
                        ]}
                      >
                        <Text style={styles.zodiacChipSymbol}>{z.symbol}</Text>
                        <Text
                          style={[
                            styles.zodiacChipText,
                            isSelected && styles.zodiacChipTextSelected,
                          ]}
                        >
                          {z.name}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}

            {/* Submit Button */}
            <MysticButton
              title={isLogin ? 'Abrir Portal Sagrado' : 'Consagrar Iniciação'}
              variant="purple"
              size="lg"
              icon={isLogin ? 'key-outline' : 'sparkles'}
              loading={loading}
              onPress={handleSubmit}
              style={{ marginTop: 12 }}
            />
          </View>

          {/* Social and Alternate Login Section */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OU CONECTE-SE COM</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In Button */}
            <TouchableOpacity
              style={styles.googleBtn}
              activeOpacity={0.85}
              onPress={handleGoogleLogin}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator color={MysticColors.purpleDeep} />
              ) : (
                <View style={styles.googleBtnContent}>
                  <Ionicons name="logo-google" size={20} color="#EA4335" style={styles.googleIcon} />
                  <Text style={styles.googleBtnText}>Continuar com Google</Text>
                </View>
              )}
            </TouchableOpacity>

            {/* Guest Mode Button */}
            <TouchableOpacity
              style={styles.guestLinkBtn}
              activeOpacity={0.8}
              onPress={handleGuestLogin}
              disabled={loading || googleLoading}
            >
              <Ionicons name="infinite-outline" size={18} color={MysticColors.gold} style={{ marginRight: 8 }} />
              <Text style={styles.guestLinkText}>Entrar como Visitante Místico (Sem conta)</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </StarBackground>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 40,
    justifyContent: 'center',
  },
  headerBox: {
    alignItems: 'center',
    marginBottom: 24,
  },
  orbGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(73, 16, 136, 0.65)',
    borderWidth: 2,
    borderColor: MysticColors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: MysticColors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 16,
    elevation: 10,
    marginBottom: 12,
  },
  appTitle: {
    color: MysticColors.textPrimary,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 1,
  },
  appSubtitle: {
    color: MysticColors.goldLight,
    fontSize: 13,
    marginTop: 4,
    fontWeight: '500',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(23, 12, 51, 0.8)',
    borderRadius: 14,
    padding: 4,
    borderWidth: 1,
    borderColor: MysticColors.borderCard,
    marginBottom: 18,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  tabBtnActive: {
    backgroundColor: MysticColors.purpleDeep,
    borderWidth: 1,
    borderColor: MysticColors.purpleLight,
  },
  tabText: {
    color: MysticColors.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFF',
    fontWeight: '800',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 101, 101, 0.2)',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: MysticColors.error,
    marginBottom: 16,
  },
  errorText: {
    color: MysticColors.error,
    fontSize: 13,
    flex: 1,
  },
  formCard: {
    backgroundColor: 'rgba(23, 12, 51, 0.65)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    borderColor: MysticColors.borderCard,
    marginBottom: 20,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    color: MysticColors.goldLight,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    backgroundColor: 'rgba(13, 6, 31, 0.85)',
    borderWidth: 1,
    borderColor: MysticColors.purpleMedium,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    color: '#FFF',
    fontSize: 15,
  },
  zodiacScroll: {
    gap: 8,
    paddingVertical: 4,
  },
  zodiacChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 18, 77, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(157, 101, 232, 0.2)',
  },
  zodiacChipSelected: {
    backgroundColor: MysticColors.purpleDeep,
    borderColor: MysticColors.gold,
  },
  zodiacChipSymbol: {
    fontSize: 16,
    color: MysticColors.gold,
  },
  zodiacChipText: {
    color: MysticColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },
  zodiacChipTextSelected: {
    color: MysticColors.goldLight,
    fontWeight: '800',
  },
  socialSection: {
    alignItems: 'center',
    width: '100%',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(157, 101, 232, 0.25)',
  },
  dividerText: {
    color: MysticColors.textMuted,
    paddingHorizontal: 12,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  googleBtn: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 16,
  },
  googleBtnContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIcon: {
    marginRight: 10,
  },
  googleBtnText: {
    color: '#1F1F1F',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  guestLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: 'rgba(35, 18, 77, 0.55)',
    borderWidth: 1,
    borderColor: 'rgba(245, 206, 98, 0.35)',
    width: '100%',
  },
  guestLinkText: {
    color: MysticColors.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
});

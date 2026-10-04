# 🔮 Meu Tarot - App Mobile (Expo SDK 57)

Versão mobile do **Meu Tarot** desenvolvida com **React Native**, **Expo (SDK 57)** e **Firebase**.

---

## 📱 Como Executar no Dispositivo ou Emulador

### 1. Instalar as dependências
```bash
cd mobile
npm install
```

### 2. Configurar o arquivo `.env`
O arquivo `.env` já foi preparado com base nas variáveis do seu projeto. Caso precise reconfigurar ou adicionar novas chaves:
- Copie o `.env.example` para `.env`:
```bash
cp .env.example .env
```
- Preencha os valores das credenciais do Firebase (`EXPO_PUBLIC_FIREBASE_*`).

> ⚠️ **Segurança de Chaves de API**: O arquivo `.env` está explicitamente listado no `.gitignore` para nunca ser enviado para o repositório Git. Variáveis que começam com `EXPO_PUBLIC_` são injetadas pelo Expo em tempo de empacotamento.

### 3. Iniciar o servidor Expo
```bash
npm start
# ou
npx expo start
```

- Para abrir no **Android** (emulador ou via cabo USB com depuração ativada): pressione `a` no terminal ou execute `npm run android`.
- Para abrir no **iOS** (macOS com Xcode): pressione `i` no terminal ou execute `npm run ios`.
- Para abrir pelo **Expo Go** no seu smartphone físico: abra o app Expo Go e escaneie o QR Code exibido no terminal.

---

## 🛠️ Comandos de Verificação & Qualidade

```bash
# Verificação de tipos TypeScript
npm run typecheck

# Linter do código
npm run lint

# Diagnóstico de integridade do Expo
npx expo-doctor
```

---

## 📱 Estrutura do App Mobile

- `src/screens/`: Telas principais (Início, Tiragens, Horóscopo, Histórico, Perfil, Enciclopédia de Cartas, Detalhes e Autenticação).
- `src/components/`: Componentes reutilizáveis otimizados para touch, animação 3D de cartas e efeitos místicos.
- `src/services/`: Integrações com Firebase Auth/Firestore, Tarot API, Moon Phase e Google Auth.
- `src/context/`: Contexto global de autenticação com persistência nativa (`AsyncStorage`).
- `src/theme/`: Cores astrais e temas místicos.
- `src/data/`: Banco completo dos 78 arcanos em português e dados astrológicos.

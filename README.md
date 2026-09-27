# 🔮 Meu Tarot - App Místico em React Native & Expo

Aplicativo mobile místico e completo desenvolvido com **React Native**, **Expo (SDK 57)** e **Firebase** (Authentication e Cloud Firestore) para backend.

---

## ✨ Funcionalidades Principais

1. **Autenticação & Registro Místico (Firebase Auth)**:
   - Cadastro com Nome, E-mail, Senha e seleção do **Signo do Zodíaco**.
   - Login com e-mail e senha.
   - **Modo Visitante Místico (Guest Mode)**: permite explorar tiragens e oráculos imediatamente sem necessidade de cadastro prévio.
   - Perfil do usuário com estatísticas, signo regente e gerenciamento de conta.

2. **Perguntas ao Oráculo & Tiragens Interativas**:
   - Campo para o consulente formular sua pergunta ou escolher sugestões espirituais.
   - **5 Modalidades de Tiragem**:
     - *Carta do Momento (1 carta)*: Respostas diretas e conselho imediato.
     - *Passado, Presente e Futuro (3 cartas)*: Análise da linha temporal.
     - *Amor & Conexões (3 cartas)*: Energia própria, da outra pessoa e futuro da relação.
     - *Carreira & Prosperidade (3 cartas)*: Momento atual, desafios e vitória material.
     - *Cruz Mística da Verdade (5 cartas)*: Leitura aprofundada multidimensional.
   - Ritual de embaralhamento animado com feedback tátil (Haptics).
   - Escolha interativa de cartas viradas para baixo diretamente pelo usuário na tela ou opção de tiragem automática.
   - Animação de rotação 3D (Flip Card) revelando arte, arcanos e posições (Ereta / Invertida).

3. **Integração com API de Tarot & Interpretação Inteligente**:
   - Integração com a **Tarot API** (`https://tarotapi.dev/api/v1`) com fallback e enriquecimento local completo de todas as **78 cartas** do clássico baralho Rider-Waite em português.
   - **Motor de Interpretação Mística**:
     - Resposta direta do oráculo à pergunta formulada.
     - Análise detalhada por carta e posição (Ereta/Invertida).
     - Conselho sagrado para ação prática e espiritual.
     - Cálculo e análise do equilíbrio elemental (**Fogo, Água, Ar, Terra, Espírito**).
     - Vibração energética cósmica da tiragem.

4. **Histórico de Tiragens Persistido**:
   - Sincronização em nuvem no **Cloud Firestore** (`users/{uid}/readings/{readingId}`) com cache local via **AsyncStorage**.
   - Busca por texto e filtros por tipo de tiragem.
   - Visualização detalhada, exclusão e compartilhamento social da tiragem.

5. **Recursos Místicos Adicionais**:
   - **Carta do Dia**: Seleção diária personalizada e mantida ao longo do dia para o usuário.
   - **Fases da Lua em Tempo Real**: Cálculo astronômico da fase atual da lua, porcentagem de iluminação e recomendação de rituais lunares.
   - **Horóscopo Diário dos 12 Signos**: Previsões diárias para Amor, Trabalho e Energia Geral, medidor de vibração cósmica, número da sorte, cor do dia e cristal guia.
   - **Guia dos Arcanos (Enciclopédia)**: Catálogo com as 78 cartas, filtros por Arcanos Maiores e Naipes (Paus, Copas, Espadas, Ouros), palavras-chave e modal de detalhes.

6. **Identidade Visual Imersiva**:
   - Paleta rica em tons de roxo profundo, violeta, ametista e dourado astral.
   - Céu estrelado animado com nebulosas cósmicas e geometria sagrada.
   - Navegação inferior mística com ícones luminosos.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- App **Expo Go** no smartphone (Android/iOS) ou emulador configurado.

### Comandos

```bash
# Iniciar o servidor de desenvolvimento Expo
npx expo start

# Executar no Android (emulador ou dispositivo)
npx expo run:android # ou pelo menu do Expo Start digitando 'a'

# Executar no iOS (macOS necessário)
npx expo run:ios # ou pelo menu do Expo Start digitando 'i'

# Executar na Web
npx expo start --web
```

---

## ⚙️ Configuração do Firebase & Hosting

O app já vem preparado para ler automaticamente as credenciais do seu arquivo `.env` usando o padrão oficial do Expo (`EXPO_PUBLIC_*`).

1. **Projeto Firebase**: `frojho`
2. **Banco Cloud Firestore**: `frojho-tarot`
3. **Firebase Hosting**: `https://frojho-tarot.web.app`

Exemplo de [.env](file:///c:/Users/john/Documents/Projetos/meuTarot/.env) configurado:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSy...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=frojho-tarot.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=frojho
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=frojho.firebasestorage.app
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1029343752086
EXPO_PUBLIC_FIREBASE_APP_ID=1:1029343752086:web:3551e7509e2278702437b7
EXPO_PUBLIC_FIREBASE_DATABASE_ID=frojho-tarot
EXPO_PUBLIC_FIREBASE_HOSTING_URL=https://frojho-tarot.web.app
```

### 🌐 Deploy para o Firebase Hosting

Para exportar a versão Web e publicar no Firebase Hosting (`frojho-tarot.web.app`):

```bash
npm run deploy:hosting
```

> **Nota:** Caso o `.env` esteja em branco ou incompleto, o app entra automaticamente no **Modo Místico Local/Offline**, permitindo utilizar todas as funcionalidades e histórico normalmente sem travar!

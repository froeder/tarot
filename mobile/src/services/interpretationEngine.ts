import { DrawnCard, SpreadType } from '../types/tarot';

interface InterpretationResult {
  directAnswer: string;
  cardsAnalysis: string;
  advice: string;
  elementalBalance: string;
  energyVibe: string;
}

export function synthesizeTarotReading(
  question: string,
  spreadType: SpreadType,
  drawnCards: DrawnCard[]
): InterpretationResult {
  const cleanQuestion = question.trim();
  const hasQuestion = cleanQuestion.length > 0;

  // Calculate elemental distribution
  const elementCounts: Record<string, number> = {
    Fogo: 0,
    Água: 0,
    Ar: 0,
    Terra: 0,
    Espírito: 0,
  };

  let majorCount = 0;
  let reversedCount = 0;

  drawnCards.forEach(({ card, isReversed }) => {
    if (card.element && elementCounts[card.element] !== undefined) {
      elementCounts[card.element]++;
    }
    if (card.type === 'major') majorCount++;
    if (isReversed) reversedCount++;
  });

  const totalCards = drawnCards.length || 1;
  const dominantElement = Object.entries(elementCounts).reduce((a, b) => (b[1] > a[1] ? b : a))[0];

  // Elemental balance interpretation
  let elementalText = '';
  switch (dominantElement) {
    case 'Fogo':
      elementalText = `Predomínio de Fogo (${Math.round((elementCounts.Fogo / totalCards) * 100)}%): Energia de paixão, iniciativa, coragem e dinamismo acelerado regendo a questão.`;
      break;
    case 'Água':
      elementalText = `Predomínio de Água (${Math.round((elementCounts.Água / totalCards) * 100)}%): O coração, as emoções profundas, a intuição e as conexões de alma guiam os acontecimentos.`;
      break;
    case 'Ar':
      elementalText = `Predomínio de Ar (${Math.round((elementCounts.Ar / totalCards) * 100)}%): A mente, a clareza dos fatos, o discernimento e a comunicação lúcida são as chaves mestras.`;
      break;
    case 'Terra':
      elementalText = `Predomínio de Terra (${Math.round((elementCounts.Terra / totalCards) * 100)}%): Estabilidade material, passos firmes e tangíveis, finanças e paciência para colher o que foi plantado.`;
      break;
    default:
      elementalText = 'Forças sutis do Espírito atuando diretamente no destino através dos Arcanos Maiores.';
  }

  // Energy Vibe
  let energyVibe = 'Harmonia & Revelação Cósmica ✨';
  if (reversedCount >= totalCards / 2) {
    energyVibe = 'Momento de Ajuste & Reflexão Interior 🌙';
  } else if (majorCount >= 2) {
    energyVibe = 'Poderoso Alinhamento do Destino 🌟';
  } else if (dominantElement === 'Fogo' || dominantElement === 'Terra') {
    energyVibe = 'Conquista, Ação & Manifestação Prática 🔥';
  }

  // Cards Analysis synthesis
  const cardsBreakdown = drawnCards.map((dc, index) => {
    const cardStatus = dc.isReversed ? 'Invertida' : 'Ereta';
    const meaning = dc.isReversed ? dc.card.meaningReversed : dc.card.meaningUpright;
    return `• ${dc.positionName}: ${dc.card.name} (${cardStatus})\n  Significado: ${meaning}\n  Conselho da Carta: ${dc.card.advice}`;
  }).join('\n\n');

  // Direct Answer generation based on question and card archetypes
  let directAnswer = '';
  const firstCard = drawnCards[0];
  const lastCard = drawnCards[drawnCards.length - 1];

  if (spreadType === 'one_card') {
    const isPositive = !firstCard.isReversed && (firstCard.card.type === 'major' || firstCard.card.valueInt >= 6);
    if (hasQuestion) {
      directAnswer = isPositive
        ? `Os astros apontam para um caminho favorável. A energia de ${firstCard.card.name} responde à sua pergunta com afirmação e luz, contanto que você mantenha o alinhamento com sua verdade.`
        : `O oráculo pede ponderação e ajuste de rota em relação à sua pergunta. ${firstCard.card.name} (${firstCard.isReversed ? 'Invertida' : 'Ereta'}) indica bloqueios passageiros ou necessidade de prudência antes de agir.`;
    } else {
      directAnswer = `A carta ${firstCard.card.name} rege o seu momento atual. Ela traz como arquétipo guia: "${firstCard.card.keywords.join(', ')}".`;
    }
  } else if (spreadType === 'love') {
    directAnswer = `No campo dos afetos, a combinação revela uma ligação profunda em processo de maturação. O desfecho com ${lastCard.card.name} (${lastCard.isReversed ? 'Invertida' : 'Ereta'}) indica que a reciprocidade depende da transparência e do desapego de inseguranças antigas.`;
  } else if (spreadType === 'career') {
    directAnswer = `No caminho profissional e financeiro, a estrutura revela oportunidades sólidas de evolução. A presença de ${lastCard.card.name} coroa a tiragem orientando que a persistência estratégica trará reconhecimento duradouro.`;
  } else if (spreadType === 'three_cards') {
    directAnswer = hasQuestion
      ? `Em resposta à pergunta "${cleanQuestion}": O oráculo revela uma transição evidente. As raízes em ${firstCard.card.name} abriram caminho para o presente, e o futuro aponta para a manifestação de ${lastCard.card.name} (${lastCard.isReversed ? 'Invertida' : 'Ereta'}), indicando que suas ações conscientes agora determinarão o sucesso pleno.`
      : `Uma jornada de três atos: o passado em ${firstCard.card.name} liberta você para o momento presente, preparando o terreno sagrado para as promessas de ${lastCard.card.name}.`;
  } else {
    // Celtic Cross / 5 cards
    directAnswer = `Uma leitura multidimensional e profunda: O coração da sua busca está marcado por ${firstCard.card.name}. As forças ocultas operam para desatar os nós do destino e a carta final, ${lastCard.card.name}, consagra a resposta com sabedoria atemporal.`;
  }

  // Spiritual Advice
  const advice = `O conselho supremo do Oráculo para o seu momento é: ${lastCard.card.advice} Cultive o equilíbrio do elemento ${dominantElement} e lembre-se de que o Tarot é um espelho sagrado da alma; o poder de escolha final reside sempre no seu livre-arbítrio.`;

  return {
    directAnswer,
    cardsAnalysis: cardsBreakdown,
    advice,
    elementalBalance: elementalText,
    energyVibe,
  };
}

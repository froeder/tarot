import { MoonPhaseInfo } from '../types/tarot';

/**
 * Calculates current Moon Phase based on astronomical synodic cycle
 */
export function getCurrentMoonPhase(): MoonPhaseInfo {
  // Known reference new moon epoch: Jan 11, 2024 at 11:57 UTC
  const referenceNewMoon = new Date('2024-01-11T11:57:00Z').getTime();
  const synodicMonthMs = 29.53058770576 * 24 * 60 * 60 * 1000;
  
  const now = Date.now();
  const diff = now - referenceNewMoon;
  const cycleFraction = (diff % synodicMonthMs) / synodicMonthMs;
  const normalizedFraction = cycleFraction < 0 ? cycleFraction + 1 : cycleFraction;

  // Day in cycle (0 to 29.5)
  const age = normalizedFraction * 29.53;
  // Illumination calculation (approximate cosine)
  const illumination = Math.round(((1 - Math.cos(normalizedFraction * 2 * Math.PI)) / 2) * 100);

  if (age < 1.84) {
    return {
      phaseName: 'Lua Nova',
      phaseCode: 'new',
      symbol: '🌑',
      illumination,
      astrologicalEnergy: 'Momento sagrado de plantar intenções, silêncio interior e novos começos.',
      recommendedRitual: 'Escreva seus desejos em papel virgem sob a luz das velas roxas e medite na semente do seu sonho.',
    };
  } else if (age < 5.53) {
    return {
      phaseName: 'Lua Crescente',
      phaseCode: 'waxing_crescent',
      symbol: '🌒',
      illumination,
      astrologicalEnergy: 'Energia de impulso, coragem e tomada de passos práticos nos seus projetos.',
      recommendedRitual: 'Consagre seus cristais e tome iniciativas ousadas para alimentar suas metas.',
    };
  } else if (age < 9.22) {
    return {
      phaseName: 'Quarto Crescente',
      phaseCode: 'first_quarter',
      symbol: '🌓',
      illumination,
      astrologicalEnergy: 'Superação de desafios iniciais, firmeza de propósito e decisões firmes.',
      recommendedRitual: 'Faça uma defumação com sálvia ou alecrim para afastar hesitações e fortalecer sua determinação.',
    };
  } else if (age < 12.91) {
    return {
      phaseName: 'Gibosa Crescente',
      phaseCode: 'waxing_gibbous',
      symbol: '🌔',
      illumination,
      astrologicalEnergy: 'Aperfeiçoamento, paciência e nutrição dos detalhes finais antes do ápice.',
      recommendedRitual: 'Pratique a gratidão pelo que já floresceu e refine os últimos ajustes dos seus planos.',
    };
  } else if (age < 16.61) {
    return {
      phaseName: 'Lua Cheia',
      phaseCode: 'full',
      symbol: '🌕',
      illumination,
      astrologicalEnergy: 'Ápice magnético, revelação de mistérios, fertilidade e clarividência máxima.',
      recommendedRitual: 'Banhos de ervas aromáticas e tiragens profundas de Tarot. A clarividência atinge o ápice cósmico.',
    };
  } else if (age < 20.30) {
    return {
      phaseName: 'Gibosa Minguante',
      phaseCode: 'waning_gibbous',
      symbol: '🌖',
      illumination,
      astrologicalEnergy: 'Compartilhamento de sabedoria, gratidão pela colheita e reflexão sincera.',
      recommendedRitual: 'Ensine algo que você aprendeu e limpe energias estagnadas no seu altar ou quarto.',
    };
  } else if (age < 23.99) {
    return {
      phaseName: 'Quarto Minguante',
      phaseCode: 'last_quarter',
      symbol: '🌗',
      illumination,
      astrologicalEnergy: 'Desapego, perdão libertador e eliminação de hábitos que não servem mais.',
      recommendedRitual: 'Escreva o que deseja banir da sua vida e queime o papel em caldeirão seguro.',
    };
  } else {
    return {
      phaseName: 'Lua Balsâmica',
      phaseCode: 'waning_crescent',
      symbol: '🌘',
      illumination,
      astrologicalEnergy: 'Descanso profundo da alma, cura, regeneração e preparação para o novo ciclo.',
      recommendedRitual: 'Beba chá de camomila ou melissa, repouse e escute mensagens vindas dos seus sonhos.',
    };
  }
}

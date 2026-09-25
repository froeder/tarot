import { SpreadConfig } from '../types/tarot';

export const SPREADS: SpreadConfig[] = [
  {
    id: 'one_card',
    title: 'Carta do Momento',
    subtitle: 'Conselho rápido e direto para sua dúvida',
    cardCount: 1,
    icon: 'sparkles',
    recommendedFor: 'Respostas diretas de Sim/Não, conselho do momento ou reflexão do dia',
    positions: [
      { name: 'O Conselho do Oráculo', description: 'A resposta central e a energia que rege sua pergunta neste instante.' },
    ],
  },
  {
    id: 'three_cards',
    title: 'Passado, Presente e Futuro',
    subtitle: 'Compreenda a linha do tempo e o desdobramento da questão',
    cardCount: 3,
    icon: 'hourglass-outline',
    recommendedFor: 'Evolução de qualquer situação geral, decisões de vida e planos futuros',
    positions: [
      { name: 'O Passado', description: 'As raízes e influências que construíram o cenário atual.' },
      { name: 'O Presente', description: 'A energia viva agora, desafios imediatos e o estado atual das coisas.' },
      { name: 'O Futuro', description: 'Para onde os caminhos apontam se a energia continuar fluindo assim.' },
    ],
  },
  {
    id: 'love',
    title: 'Amor & Conexões',
    subtitle: 'Tiragem mística para o coração e relacionamentos',
    cardCount: 3,
    icon: 'heart-outline',
    recommendedFor: 'Relacionamentos amorosos, reencontros, afinidades de alma e dilemas afetivos',
    positions: [
      { name: 'A Sua Energia', description: 'O que o seu coração sente, seus anseios e vibração no amor.' },
      { name: 'A Energia do Outro / Situação', description: 'A vibração da pessoa de interesse ou as circunstâncias do relacionamento.' },
      { name: 'A Ponte & Futuro', description: 'O caminho de harmonia possível e a lição espiritual da união.' },
    ],
  },
  {
    id: 'career',
    title: 'Carreira & Prosperidade',
    subtitle: 'Alinhamento profissional, negócios e finanças',
    cardCount: 3,
    icon: 'briefcase-outline',
    recommendedFor: 'Mudança de emprego, investimentos, novos projetos e vocação',
    positions: [
      { name: 'O Cenário Atual', description: 'A sua posição profissional e recursos disponíveis no momento.' },
      { name: 'O Desafio / Oportunidade', description: 'O teste a ser superado ou a porta secreta de crescimento.' },
      { name: 'O Sucesso & Conselho', description: 'A melhor estratégia para alcançar abundância e realização.' },
    ],
  },
  {
    id: 'celtic_cross',
    title: 'Cruz Mística da Verdade',
    subtitle: 'Análise profunda e multidimensional da sua pergunta',
    cardCount: 5,
    icon: 'compass-outline',
    recommendedFor: 'Perguntas complexas, encruzilhadas existenciais e busca de revelação total',
    positions: [
      { name: 'O Coração da Questão', description: 'A essência primordial da sua pergunta.' },
      { name: 'O Desafio Oculto', description: 'O que está bloqueando ou testando sua força.' },
      { name: 'A Raiz Espiritual', description: 'A motivação profunda e causa subconsciente.' },
      { name: 'A Luz da Consciência', description: 'O que você deve focar e nutrir neste momento.' },
      { name: 'O Desfecho Supremo', description: 'A resolução sagrada e o conselho místico definitivo.' },
    ],
  },
];

export function getSpreadById(id: string): SpreadConfig {
  return SPREADS.find(s => s.id === id) || SPREADS[0];
}

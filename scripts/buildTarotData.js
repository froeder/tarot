const fs = require('fs');
const path = require('path');

const majorCardsPt = {
  ar00: {
    name: "O Louco",
    keywords: ["Novos Começos", "Inocência", "Espontaneidade", "Salto de Fé", "Liberdade"],
    upright: "O início de uma jornada extraordinária. Coragem para abraçar o desconhecido, confiar no fluxo do universo e dar o salto de fé.",
    reversed: "Imprudência, ingenuidade perigosa, medo de assumir riscos ou agir por impulso cego.",
    advice: "Dê o salto de fé com o coração puro. O universo ampara quem ousa recomeçar.",
    element: "Ar",
    astrology: "Urano"
  },
  ar01: {
    name: "O Mago",
    keywords: ["Poder Pessoal", "Manifestação", "Habilidade", "Criatividade", "Foco"],
    upright: "Você possui todos os talentos e ferramentas necessários para transformar pensamentos em realidade palpável.",
    reversed: "Talento desperdiçado, manipulação, ilusões, falta de foco ou planos não executados.",
    advice: "Aja agora com convicção. Você é o criador da sua própria realidade.",
    element: "Fogo",
    astrology: "Mercúrio"
  },
  ar02: {
    name: "A Sacerdotisa",
    keywords: ["Intuição", "Mistério", "Sabedoria Oculta", "Subconsciente", "Paz Interior"],
    upright: "Conexão profunda com sua voz interior. Os mistérios estão sendo revelados no silêncio da sua alma.",
    reversed: "Segredos reprimidos, ignorar a intuição, desconexão espiritual ou fofocas.",
    advice: "Silencie o ruído externo e escute o sussurro da sua intuição sagrada.",
    element: "Água",
    astrology: "Lua"
  },
  ar03: {
    name: "A Imperatriz",
    keywords: ["Fertilidade", "Abundância", "Criação", "Sensualidade", "Nutrição"],
    upright: "Prosperidade florescendo. Período de abundância, criatividade e beleza que nutre tudo ao redor.",
    reversed: "Bloqueio criativo, dependência emocional, negligência do autocuidado ou excessos.",
    advice: "Nutra seus projetos e cuide de si com afeto. A colheita será generosa.",
    element: "Terra",
    astrology: "Vênus"
  },
  ar04: {
    name: "O Imperador",
    keywords: ["Estrutura", "Estabilidade", "Autoridade", "Proteção", "Disciplina"],
    upright: "Liderança firme, ordem estabelecida e determinação para construir fundações sólidas para o futuro.",
    reversed: "Tirania, rigidez excessiva, falta de disciplina ou dificuldade com autoridade.",
    advice: "Traga ordem e limites saudáveis para sua vida. Assuma o controle com sabedoria.",
    element: "Fogo",
    astrology: "Áries"
  },
  ar05: {
    name: "O Hierofante",
    keywords: ["Sabedoria Espiritual", "Tradição", "Mentoria", "Ética", "Conhecimento"],
    upright: "Busca de sentido superior, aconselhamento com mentores confiáveis e respeito a valores sagrados.",
    reversed: "Dogmatismo, crenças limitantes, rebeldia cega ou conselhos enganosos.",
    advice: "Apoie-se na sabedoria atemporal e mantenha sua integridade ética inabalável.",
    element: "Terra",
    astrology: "Touro"
  },
  ar06: {
    name: "Os Enamorados",
    keywords: ["Amor", "Harmonia", "Escolhas do Coração", "Alinhamento", "Parceria"],
    upright: "União profunda, atração mística e a necessidade de tomar uma decisão crucial alinhada com sua alma.",
    reversed: "Desarmonia em relações, escolhas desalinhadas, conflito de valores ou desunião.",
    advice: "Escolha com o coração. O amor verdadeiro floresce na verdade mútua.",
    element: "Ar",
    astrology: "Gêmeos"
  },
  ar07: {
    name: "O Carro",
    keywords: ["Triunfo", "Força de Vontade", "Autocontrole", "Vitória", "Direção"],
    upright: "Progresso veloz e superação de obstáculos através do foco inabalável e domínio das próprias emoções.",
    reversed: "Perda de rumo, agressividade, falta de controle ou sensação de estar sem direção.",
    advice: "Assuma as rédeas do seu destino e siga em frente sem hesitar.",
    element: "Água",
    astrology: "Câncer"
  },
  ar08: {
    name: "A Força",
    keywords: ["Coragem", "Compaixão", "Paciência", "Domínio Interior", "Ternura"],
    upright: "A força suave que domina as feras internas. Resiliência, benevolência e equilíbrio entre razão e instinto.",
    reversed: "Dúvida sobre o próprio poder, raiva desmedida, esgotamento ou fraqueza momentânea.",
    advice: "A gentileza e a paciência conquistam mais do que qualquer imposição física.",
    element: "Fogo",
    astrology: "Leão"
  },
  ar09: {
    name: "O Eremita",
    keywords: ["Introspecção", "Busca da Verdade", "Solidão Sagrada", "Guia Interior", "Iluminação"],
    upright: "Momento de recolhimento para clarear os pensamentos e encontrar sua luz guia no silêncio da reflexão.",
    reversed: "Isolamento excessivo, solidão amarga, recusa em pedir conselhos ou medo do contato.",
    advice: "Recolha-se para encontrar a luz interior antes de dar os próximos passos no mundo exterior.",
    element: "Terra",
    astrology: "Virgem"
  },
  ar10: {
    name: "A Roda da Fortuna",
    keywords: ["Destino", "Ciclos", "Mudanças Positivas", "Sorte", "Karma"],
    upright: "Os ventos cósmicos estão mudando a seu favor. Novos ciclos e sincronicidades afortunadas se manifestam.",
    reversed: "Resistência a transformações necessárias, fase temporária de imprevistos ou má sorte aparente.",
    advice: "Aceite os ciclos da vida. Quando a roda gira, esteja pronto para surfar na crista da onda.",
    element: "Fogo",
    astrology: "Júpiter"
  },
  ar11: {
    name: "A Justiça",
    keywords: ["Equidade", "Verdade", "Causa e Efeito", "Clareza", "Responsabilidade"],
    upright: "A verdade prevalece. Resolução justa de pendências, colheita exata do que foi semeado e lucidez moral.",
    reversed: "Injustiça, falta de imparcialidade, desonestidade consigo mesmo ou julgamentos precipitados.",
    advice: "Pese os fatos com imparcialidade e aja com retidão impecável.",
    element: "Ar",
    astrology: "Libra"
  },
  ar12: {
    name: "O Enforcado",
    keywords: ["Nova Perspectiva", "Pausa", "Entrega", "Rendição Consciente", "Iluminação"],
    upright: "Uma pausa necessária para enxergar o mundo sob outro ângulo. Sacrifício iluminado que liberta a mente.",
    reversed: "Estagnação teimosa, resistência inútil, martírio desnecessário ou adiamento de decisões.",
    advice: "Mude de perspectiva e solte o controle. As melhores respostas surgem quando você para de forçar.",
    element: "Água",
    astrology: "Netuno"
  },
  ar13: {
    name: "A Morte",
    keywords: ["Transformação", "Fim de Ciclo", "Renascimento", "Desapego", "Metamorfose"],
    upright: "Encerramento natural de uma etapa que não serve mais. O que se vai abre espaço para um renascimento luminoso.",
    reversed: "Medo crônico da mudança, apego a situações falidas ou estagnação por medo do desconhecido.",
    advice: "Deixe o passado ir embora com gratidão. O novo ciclo só pode nascer se o velho se despedir.",
    element: "Água",
    astrology: "Escorpião"
  },
  ar14: {
    name: "A Temperança",
    keywords: ["Equilíbrio", "Harmonia", "Paciência", "Alquimia", "Cura"],
    upright: "Harmonização de energias opostas. Serenidade, cura física e espiritual e moderação virtuosa.",
    reversed: "Descompasso, extremismos, impaciência destrutiva ou excessos que drenam sua energia.",
    advice: "Misture com sabedoria os ingredientes da sua vida. O caminho do meio é o caminho da paz.",
    element: "Fogo",
    astrology: "Sagitário"
  },
  ar15: {
    name: "O Diabo",
    keywords: ["Sombra", "Apego", "Materialismo", "Ilusão", "Libertação"],
    upright: "Alerta sobre ilusões, vícios, apegos tóxicos ou limitações autoimpostas. O primeiro passo é reconhecer as amarras.",
    reversed: "Libertação de hábitos destrutivos, superação do medo e quebra de correntes antigas.",
    advice: "Encare suas sombras sem medo. A corrente que prende você é você mesmo quem pode desatar.",
    element: "Terra",
    astrology: "Capricórnio"
  },
  ar16: {
    name: "A Torre",
    keywords: ["Ruptura", "Revelação", "Queda de Ilusões", "Despertar Súbito", "Libertação"],
    upright: "Um abalo que desmorona estruturas falsas. Doloroso no início, mas indispensável para fundações autênticas.",
    reversed: "Evitar o inevitável, prolongar o colapso por medo ou reconstrução após a tempestade.",
    advice: "Não tema as verdades que desabam velhas mentiras. É a chance de edificar sobre a rocha viva.",
    element: "Fogo",
    astrology: "Marte"
  },
  ar17: {
    name: "A Estrela",
    keywords: ["Esperança", "Fé Renovada", "Inspiração", "Bênçãos Cósmicas", "Cura"],
    upright: "Um farol de luz e serenidade após a tempestade. Sonhos sendo abençoados pelas estrelas e paz no coração.",
    reversed: "Falta de esperança passageira, desânimo, pessimismo ou desconfiança no destino.",
    advice: "Mantenha a fé nas alturas. O universo conspira silenciosamente para curar suas dores.",
    element: "Ar",
    astrology: "Aquário"
  },
  ar18: {
    name: "A Lua",
    keywords: ["Ilusão", "Medo do Oculto", "Inconsciente", "Sonhos", "Clarividência"],
    upright: "Mergulho em águas misteriosas. Atenção a enganos e ilusões; confie na sua sensibilidade sem cair na paranoia.",
    reversed: "Esclarecimento de mal-entendidos, revelação de farsas e dissipa da névoa mental.",
    advice: "Caminhe com cuidado na névoa. Deixe que a luz da verdade dissipe os monstros imaginários.",
    element: "Água",
    astrology: "Peixes"
  },
  ar19: {
    name: "O Sol",
    keywords: ["Alegria", "Sucesso Pleno", "Vitalidade", "Clareza", "Celebração"],
    upright: "O brilho máximo da luz divina. Conquistas luminosas, calor humano, saúde renovada e realização autêntica.",
    reversed: "Entusiasmo excessivo, orgulho infantil ou otimismo temporariamente obscurecido por nuvens passageiras.",
    advice: "Brilhe com todo o seu fulgor. A alegria genuína é sua maior proteção e magnetismo.",
    element: "Fogo",
    astrology: "Sol"
  },
  ar20: {
    name: "O Julgamento",
    keywords: ["Despertar", "Renovação Cósmica", "Chamado da Alma", "Redenção", "Decisão Final"],
    upright: "O toque da trombeta que acorda você para sua missão superior. Liberação de culpas e novo nascimento espiritual.",
    reversed: "Autocrítica impiedosa, medo de atender ao próprio chamado ou relutância em perdoar.",
    advice: "Ouça o chamado do seu coração. Perdoe o passado e levante-se para a sua glória.",
    element: "Fogo",
    astrology: "Plutão"
  },
  ar21: {
    name: "O Mundo",
    keywords: ["Completude", "Triunfo Cósmico", "Integração", "Realização Total", "Jornada Completa"],
    upright: "A coroação de uma grande jornada. Harmonização universal, conquista de sonhos e sensação de plenitude divina.",
    reversed: "Pequenos detalhes pendentes para concluir um ciclo, sensação de incompletude ou hesitação final.",
    advice: "Comemore suas vitórias! Você completou um ciclo com maestria e agora o mundo é o seu jardim.",
    element: "Terra",
    astrology: "Saturno"
  }
};

const suitData = {
  wands: {
    pt: "Paus",
    element: "Fogo",
    domain: "paixão, ação, criatividade, projetos e energia vital",
    values: {
      ace: { name: "Ás de Paus", upright: "Centelha criativa, entusiasmo transbordante e novas oportunidades empolgantes.", rev: "Falta de iniciativa, atrasos em começos ou energia dispersa." },
      two: { name: "Dois de Paus", upright: "Planejamento futuro, visão além do horizonte e decisão de expandir horizontes.", rev: "Medo de dar o próximo passo, planos hesitantes ou limites estreitos." },
      three: { name: "Três de Paus", upright: "Expansão bem-sucedida, navios trazendo bons frutos e horizontes abertos.", rev: "Obstáculos na expansão, frustração com prazos ou desilusão." },
      four: { name: "Quatro de Paus", upright: "Celebração, harmonia no lar, comunidade acolhedora e paz conquistada.", rev: "Desentendimentos familiares leves, celebração adiada ou falta de harmonia temporária." },
      five: { name: "Cinco de Paus", upright: "Competição construtiva, conflito de ideias e necessidade de provar seu valor.", rev: "Discussões estéreis, evitação de conflitos ou trégua bem-vinda." },
      six: { name: "Seis de Paus", upright: "Vitória pública, reconhecimento dos seus méritos e aclamação de sucesso.", rev: "Orgulho ferido, falta de reconhecimento ou queda de expectativa pública." },
      seven: { name: "Sete de Paus", upright: "Defesa corajosa da sua posição, firmeza diante de pressões e perseverança.", rev: "Sensação de sobrecarga, desistência perante oposição ou teimosia cega." },
      eight: { name: "Oito de Paus", upright: "Acontecimentos rápidos, notícias importantes chegando velozmente e dinamismo.", rev: "Atrasos inesperados, decisões precipitadas ou comunicação truncada." },
      nine: { name: "Nove de Paus", upright: "Resiliência na última barreira, cautela vigilante e força para o teste final.", rev: "Exaustão, paranoia defensiva ou desconfiança que afasta aliados." },
      ten: { name: "Dez de Paus", upright: "Sobrecarga pesada, excesso de responsabilidades assumidas e estresse.", rev: "Aprender a delegar fardos, alívio iminente ou colapso por teimosia." },
      page: { name: "Valete de Paus", upright: "Mensageiro de boas ideias, espírito explorador e curiosidade vibrante.", rev: "Impaciência, promessas vazias ou infantilidade em compromissos." },
      knight: { name: "Cavaleiro de Paus", upright: "Ação audaciosa, determinação impetuosa e jornada cheia de paixão.", rev: "Agressividade, atitudes impensadas ou temperamento volátil." },
      queen: { name: "Rainha de Paus", upright: "Carisma radiante, confiança magnética, liderança acolhedora e alegria.", rev: "Ciúmes, exigências temperamentais ou ego inflado." },
      king: { name: "Rei de Paus", upright: "Liderança inspiradora, visão ampla de empreendimentos e honradez.", rev: "Autoritarismo, expectativas irrealistas ou imposição agressiva." }
    }
  },
  cups: {
    pt: "Copas",
    element: "Água",
    domain: "amor, emoções, intuição, relacionamentos e paz interior",
    values: {
      ace: { name: "Ás de Copas", upright: "Transbordamento de amor, abertura emocional profunda e despertar da intuição.", rev: "Bloqueio emocional, mágoa não resolvida ou amor não correspondido." },
      two: { name: "Dois de Copas", upright: "Conexão de almas, reciprocidade afetiva e parceria amorosa equilibrada.", rev: "Desarmonia na relação, quebra de comunicação ou desconfiança." },
      three: { name: "Três de Copas", upright: "Celebração entre amigos, reunião de pessoas queridas e alegria compartilhada.", rev: "Excesso de festas, fofocas entre conhecidos ou isolamento do grupo." },
      four: { name: "Quatro de Copas", upright: "Apatia emocional, desmotivação ou ignorar oportunidades preciosas diante de si.", rev: "Despertar do tédio, nova motivação e aceitação de uma bênção oferecida." },
      five: { name: "Cinco de Copas", upright: "Luto por perdas passadas, tristeza focada no que se foi esquecendo o que restou.", rev: "Superação da dor, consolo e capacidade de recomeçar a amar." },
      six: { name: "Seis de Copas", upright: "Nostalgia doce, reencontro com raízes, inocência do coração e memórias felizes.", rev: "Viver preso ao passado, imaturidade emocional ou necessidade de seguir adiante." },
      seven: { name: "Sete de Copas", upright: "Múltiplas opções e ilusões. Necessidade de separar fantasia da realidade prática.", rev: "Clareza após confusão mental, foco em uma escolha real e lucidez." },
      eight: { name: "Oito de Copas", upright: "Decisão corajosa de deixar para trás o que não preenche mais o coração.", rev: "Medo de partir, apego ao vazio ou retorno a situações nocivas." },
      nine: { name: "Nove de Copas", upright: "A carta dos desejos realizados, satisfação pessoal plena e bem-estar afetivo.", rev: "Arrogância pelo sucesso, gula ou insatisfação oculta sob aparente ganho." },
      ten: { name: "Dez de Copas", upright: "Felicidade familiar completa, bênçãos emocionais e paz duradoura no lar.", rev: "Tensões domésticas temporárias, falta de harmonia ou valores desalinhados." },
      page: { name: "Valete de Copas", upright: "Mensagens afetuosas, sensibilidade poética e intuições surpreendentes.", rev: "Sensibilidade exagerada, enganos sentimentais ou recados não confiáveis." },
      knight: { name: "Cavaleiro de Copas", upright: "O cavaleiro romântico que traz propostas sinceras e segue o coração.", rev: "Ilusões amorosas, promessas sedutoras porém vazias ou manipulação emocional." },
      queen: { name: "Rainha de Copas", upright: "Compaixão sublime, sensibilidade mediúnica e coração curador e acolhedor.", rev: "Dramatizações emocionais, codependência ou vulnerabilidade extrema." },
      king: { name: "Rei de Copas", upright: "Equilíbrio emocional maduro, serenidade diante de tempestades e liderança compassiva.", rev: "Manipulação fria, repressão severa de sentimentos ou oscilações de humor." }
    }
  },
  swords: {
    pt: "Espadas",
    element: "Ar",
    domain: "mente, verdade, clareza, decisões e superação de dilemas",
    values: {
      ace: { name: "Ás de Espadas", upright: "Claridade mental fulgurante, verdade cortante e triunfo da razão.", rev: "Confusão mental, palavras cruéis ou uso destrutivo do intelecto." },
      two: { name: "Dois de Espadas", upright: "Dilema de olhos vendados, trégua tensa e necessidade de decidir com coragem.", rev: "Decisão forçada pela realidade, fim da indecisão ou sobrecarga informativa." },
      three: { name: "Três de Espadas", upright: "Dor no coração, decepção ou verdade dolorosa que liberta ilusões.", rev: "Cicatrização de feridas, perdão libertador e alívio do sofrimento." },
      four: { name: "Quatro de Espadas", upright: "Descanso mental necessário, trégua, recuperação de energias e meditação.", rev: "Retorno da atividade após repouso ou esgotamento por falta de pausa." },
      five: { name: "Cinco de Espadas", upright: "Vitória vazia onde todos perdem algo, conflito mesquinho e orgulho ferido.", rev: "Desejo de reconciliação, aprender com o erro e abandonar rivalidades tolas." },
      six: { name: "Seis de Espadas", upright: "Travessia para águas mais calmas, transição suave para um ambiente seguro.", rev: "Dificuldade na transição, bagagem pesada levada consigo ou turbulência." },
      seven: { name: "Sete de Espadas", upright: "Estratégia discreta, astúcia necessária ou alerta contra desonestidade.", rev: "Descoberta de segredos, confissão sincera ou planos que falham por covardia." },
      eight: { name: "Oito de Espadas", upright: "Prisão mental ilusória, sensação de impotência provocada por crenças limitantes.", rev: "Libertação das próprias amarras mentais, enxergar a saída e recuperar o poder." },
      nine: { name: "Nove de Espadas", upright: "Insônia, angústia mental e pesadelos gerados por preocupações excessivas.", rev: "Amanhecer da esperança, alívio do tormento e perspectiva realista." },
      ten: { name: "Dez de Espadas", upright: "O fundo do poço atingido; a tempestade enfim passou e o amanhecer se aproxima.", rev: "Recuperação após golpe duro, renascimento inevitável e alívio total." },
      page: { name: "Valete de Espadas", upright: "Curiosidade intelectual viva, vigilância aguçada e busca pela verdade dos fatos.", rev: "Espionagem fútil, comentários mordazes ou cinismo arrogante." },
      knight: { name: "Cavaleiro de Espadas", upright: "Ação rápida e incisiva, coragem implacável na defesa da verdade.", rev: "Precipitação destrutiva, grosseria nas palavras ou fanatismo." },
      queen: { name: "Rainha de Espadas", upright: "Percepção aguçada, lucidez cirúrgica, independência e honestidade cristalina.", rev: "Amargura, julgamentos frios e cruéis ou isolamento rancoroso." },
      king: { name: "Rei de Espadas", upright: "Autoridade intelectual, clareza ética irrevogável e justiça fundamentada na verdade.", rev: "Tirania intelectual, frieza desumanizada ou julgamentos implacáveis." }
    }
  },
  pentacles: {
    pt: "Ouros",
    element: "Terra",
    domain: "matéria, finanças, trabalho, corpo físico e segurança",
    values: {
      ace: { name: "Ás de Ouros", upright: "Semente de prosperidade, nova oportunidade financeira e abundância tangível.", rev: "Oportunidade de investimento perdida, apego mesquinho ou ganância tola." },
      two: { name: "Dois de Ouros", upright: "Equilíbrio habilidoso entre múltiplas tarefas, flexibilidade e adaptação prática.", rev: "Desequilíbrio financeiro, sobrecarga de afazeres ou instabilidade." },
      three: { name: "Três de Ouros", upright: "Trabalho em equipe bem-sucedido, maestria artesanal e reconhecimento profissional.", rev: "Falta de cooperação no projeto, trabalho medíocre ou críticas duras." },
      four: { name: "Quatro de Ouros", upright: "Segurança financeira conquistada, mas alerta contra apego excessivo ou avareza.", rev: "Abertura para gastar com generosidade ou perdas por descuido financeiro." },
      five: { name: "Cinco de Ouros", upright: "Sensação temporária de carência, isolamento ou frio exterior; busque refúgio.", rev: "Fim das dificuldades materiais, acolhimento e renovação da segurança." },
      six: { name: "Seis de Ouros", upright: "Generosidade, partilha justa de recursos, caridade recebida ou concedida.", rev: "Dívidas impagáveis, caridade com segundas intenções ou desigualdade." },
      seven: { name: "Sete de Ouros", upright: "Paciência para aguardar a colheita dos frutos que foram semeados com suor.", rev: "Impaciência com o crescimento, cansaço do trabalho ou colheita frustrada." },
      eight: { name: "Oito de Ouros", upright: "Dedicação diligente ao aprimoramento de habilidades, estudo e maestria prática.", rev: "Trabalho monótono e sem alma, falta de foco ou perfeccionismo paralisante." },
      nine: { name: "Nove de Ouros", upright: "Independência financeira, desfrute dos prazeres refinados e autossuficiência.", rev: "Solidão em meio ao luxo, falsas aparências ou perdas materiais." },
      ten: { name: "Dez de Ouros", upright: "Legado duradouro, riqueza compartilhada entre gerações e segurança no lar.", rev: "Disputas de herança, laços familiares rompidos por dinheiro ou ruína material." },
      page: { name: "Valete de Ouros", upright: "Estudante aplicado, novo projeto prático com potencial sólido e ambição saudável.", rev: "Preguiça nos estudos, falta de compromisso financeiro ou procrastinação." },
      knight: { name: "Cavaleiro de Ouros", upright: "Trabalho metódico, confiabilidade total, persistência inabalável e progresso seguro.", rev: "Lentidão excessiva, teimosia cega ou rotina entediante." },
      queen: { name: "Rainha de Ouros", upright: "Acolhimento prático, prosperidade grounded, bom senso e cuidado com a saúde.", rev: "Materialismo fútil, desleixo com o lar ou preocupações financeiras neuróticas." },
      king: { name: "Rei de Ouros", upright: "Mestre dos negócios e da matéria, abundância sólida, generosidade e solidez.", rev: "Avareza implacável, corrupção material ou apego exclusivo aos bens terrenos." }
    }
  }
};

// Build all 78 cards
const allCards = [];

// Major Arcana (ar00 to ar21)
for (let i = 0; i <= 21; i++) {
  const code = i < 10 ? `ar0${i}` : `ar${i}`;
  const m = majorCardsPt[code];
  if (!m) continue;

  allCards.push({
    id: code,
    name: m.name,
    nameEn: `Major ${i}`,
    nameShort: code,
    type: "major",
    suit: "major",
    value: i.toString(),
    valueInt: i,
    imageUrl: `https://sacred-texts.com/tarot/pkt/img/${code}.jpg`,
    keywords: m.keywords,
    meaningUpright: m.upright,
    meaningReversed: m.reversed,
    description: `Arcano Maior ${i}: ${m.name}. Um dos 22 mistérios supremos do Tarot que representam os grandes arquétipos universais da jornada da alma humana.`,
    advice: m.advice,
    element: m.element,
    astrology: m.astrology
  });
}

// Minor Arcana (wands, cups, swords, pentacles)
const suitKeys = ["wands", "cups", "swords", "pentacles"];
const valKeys = [
  "ace", "two", "three", "four", "five", "six", "seven",
  "eight", "nine", "ten", "page", "knight", "queen", "king"
];
const suitPrefix = {
  wands: "wa",
  cups: "cu",
  swords: "sw",
  pentacles: "pe"
};
const valCodes = {
  ace: "ac", two: "02", three: "03", four: "04", five: "05",
  six: "06", seven: "07", eight: "08", nine: "09", ten: "10",
  page: "pa", knight: "kn", queen: "qu", king: "ki"
};
const valInts = {
  ace: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7,
  eight: 8, nine: 9, ten: 10, page: 11, knight: 12, queen: 13, king: 14
};

for (const suitKey of suitKeys) {
  const sData = suitData[suitKey];
  for (const valKey of valKeys) {
    const cardData = sData.values[valKey];
    const code = `${suitPrefix[suitKey]}${valCodes[valKey]}`;
    
    allCards.push({
      id: code,
      name: cardData.name,
      nameEn: `${valKey.toUpperCase()} of ${suitKey}`,
      nameShort: code,
      type: "minor",
      suit: suitKey,
      value: valKey,
      valueInt: valInts[valKey],
      imageUrl: `https://sacred-texts.com/tarot/pkt/img/${code}.jpg`,
      keywords: [sData.pt, sData.element, cardData.name.split(" ")[0]],
      meaningUpright: cardData.upright,
      meaningReversed: cardData.rev,
      description: `${cardData.name} do Naipe de ${sData.pt}, regido pelo elemento ${sData.element}. Conectado a temas de ${sData.domain}.`,
      advice: `Canalize a força de ${sData.element.toLowerCase()} com equilíbrio: ${cardData.upright}`,
      element: sData.element,
      astrology: sData.element === "Fogo" ? "Sol/Marte" : sData.element === "Água" ? "Lua/Netuno" : sData.element === "Ar" ? "Mercúrio" : "Saturno"
    });
  }
}

const fileContent = `import { TarotCard } from '../types/tarot';

export const TAROT_DECK: TarotCard[] = ${JSON.stringify(allCards, null, 2)};

export const MAJOR_ARCANA = TAROT_DECK.filter(c => c.type === 'major');
export const MINOR_ARCANA = TAROT_DECK.filter(c => c.type === 'minor');

export function getCardById(id: string): TarotCard | undefined {
  return TAROT_DECK.find(c => c.id === id || c.nameShort === id);
}

export function getRandomCards(count: number, allowReversed = true): { card: TarotCard; isReversed: boolean }[] {
  const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map(card => ({
    card,
    isReversed: allowReversed ? Math.random() < 0.28 : false,
  }));
}
`;

fs.writeFileSync(path.join(__dirname, '../src/data/tarotCards.ts'), fileContent, 'utf8');
console.log(`Generated perfect Portuguese Tarot Deck with ${allCards.length} cards!`);

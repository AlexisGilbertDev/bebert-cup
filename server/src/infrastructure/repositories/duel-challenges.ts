import type { Challenge } from '../../domain/entities/challenge.entity.js';

export const DUEL_CHALLENGES: Challenge[] = [
  {
    id: 'duel-jongle',
    name: 'La Jongle',
    description:
      'Chacun jongle de son côté. Saisissez votre nombre de touches — le classement détermine les points. En cas d\'égalité, on rejoue.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-jongle-distance',
    name: 'Jongle — Plus Longue Distance',
    description:
      'Chacun jongle en avançant le plus loin possible sans laisser tomber le ballon. Saisissez votre distance en mètres — le classement détermine les points.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-tour-du-monde',
    name: 'Tour du Monde — 45 secondes',
    description:
      'Chacun son tour, réalisez le plus de tours du monde possible en 45 secondes chrono. Saisissez votre nombre — le classement détermine les points.',
    details:
      'Tour du monde : jongle, et au moment où le ballon est en l\'air, fais tourner ton pied autour du ballon (de l\'extérieur vers l\'intérieur) avant de le retoucher. Ça compte si le ballon ne touche pas le sol.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-crossbar-5',
    name: 'Crossbar Challenge — 5 Tirs',
    description:
      'Chacun tire 5 fois depuis la ligne de la surface et vise la barre transversale. Saisissez votre nombre de barres touchées — le classement détermine les points.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-crossbar-reverse',
    name: 'Crossbar Reverse',
    description:
      'Depuis la ligne de la surface, touchez la barre transversale avec un tir en reverse. Tapez votre prénom dès que vous réussissez — premier arrivé, meilleurs points.',
    details:
      'Reverse (ou rabona) : tu fais passer ton pied frappeur derrière ta jambe d\'appui pour frapper le ballon avec l\'extérieur ou le cou-de-pied de l\'autre côté. Le ballon part en croisant tes jambes.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-bresilienne',
    name: 'Brésilienne',
    description:
      'Tous ensemble, gardez le ballon en l\'air avec 3 touches maximum par joueur. Tapez le joueur qui laisse tomber — le dernier encore dans le coup gagne.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-combat-de-coq',
    name: 'Combat de Coq',
    description:
      'Un pied en l\'air, bras croisés — le dernier encore debout gagne. Tapez le joueur éliminé dès qu\'il pose son deuxième pied ou perd l\'équilibre.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-ho',
    name: 'HO',
    description:
      'HORSE en version courte — deux lettres suffisent pour être éliminé. Un joueur tente un geste, les autres doivent le reproduire. Ratez et vous prenez une lettre. Tapez le joueur qui vient de prendre son dernier O.',
    details:
      'HORSE (HO ici) : à tour de rôle, un joueur propose un geste ou un tir. Tous les autres doivent le reproduire à l\'identique. Celui qui rate prend la lettre suivante (H puis O). Deux lettres et t\'es éliminé.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-corner-reverse',
    name: 'Corner Rentrant Reverse',
    description:
      'Depuis le drapeau de corner, envoyez un corner rentrant avec un tir en reverse. Tapez votre prénom dès que le ballon rentre — premier arrivé, meilleurs points.',
    details:
      'Corner rentrant : le ballon courbe vers l\'intérieur du but (comme un corner qui entre directement). Reverse : tu frappes en passant ton pied derrière ta jambe d\'appui. Les deux en même temps — bonne chance.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-1v1',
    name: '1v1 — Premier But',
    description:
      'Un contre un, premier but gagne. Tapez le vainqueur dès qu\'il marque.',
    minPlayers: 2,
    maxPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-lucarne',
    name: 'La Lucarne',
    description:
      'Placement libre. Le premier qui met une lucarne tape son prénom — premier arrivé, meilleurs points.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-plus-beau-coup-franc',
    name: 'Le Plus Beau Coup Franc',
    description:
      'Chacun choisit son placement et tente son plus beau coup franc. Mettez-vous d\'accord sur le classement, puis tapez les joueurs dans l\'ordre — du plus beau au moins beau.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-plus-beau-but',
    name: 'Le Plus Beau But',
    description:
      'Chacun tente son plus beau but. Mettez-vous d\'accord sur le classement, puis tapez les joueurs dans l\'ordre — du plus beau au moins beau.',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-penalties',
    name: 'Séance de Tirs au But',
    description:
      'À 2 : 5 tirs chacun, on tourne au but. À 3 : 2 tirs chacun, en rotation tireur → gardien → observateur. Saisissez votre nombre de buts — le classement détermine les points.',
    minPlayers: 2,
    mode: 'duel',
  },
];

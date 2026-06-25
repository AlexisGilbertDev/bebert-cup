import type { Challenge } from '../../domain/entities/challenge.entity.js';

export const DUEL_CHALLENGES: Challenge[] = [
  {
    id: 'duel-jongle',
    name: 'La Jongle',
    description:
      'Chacun jongle de son côté. Celui qui en fait le plus gagne !',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-jongle-distance',
    name: 'Jongle — Plus Longue Distance',
    description:
      'Vous devez faire la plus longue distance possible tout en jonglant. Celui qui fait la plus longue distance gagne !',
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
      'Chacun tire 5 fois depuis la ligne de la surface et vise la barre transversale. Celui qui touche le plus de fois la barre gagne !',
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
      'Brésilienne avec 3 touches maximum par joueur. Celui qui rate a perdu !',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-combat-de-coq',
    name: 'Combat de Coq',
    description:
      'Faites un combat de coq ! Non en vrai vous pouvez changer de défi.',
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
      'Un contre un, en un seul but ! Le premier qui marque gagne !',
    minPlayers: 2,
    maxPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-lucarne',
    name: 'La Lucarne',
    description:
      'Placement libre. Le premier qui met une lucarne a gagné !',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-plus-beau-coup-franc',
    name: 'Le Plus Beau Coup Franc',
    description:
      'Chacun choisit son placement et tente son plus beau coup franc en une seule tentative. Le plus beau gagne !',
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-penalties',
    name: 'Séance de Tirs au But',
    description:
      'Tirs au but en 6 tentatives chacun. Le plus grand nombre de buts marque la victoire !',
    minPlayers: 2,
    mode: 'duel',
  },
];

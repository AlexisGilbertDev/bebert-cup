import type { Challenge } from '../../domain/entities/challenge.entity.js';

export const DUEL_CHALLENGES: Challenge[] = [
  {
    id: 'duel-jongle',
    name: 'La Jongle',
    description:
      'Chacun votre tour, jonglez. Celui qui en fait le plus gagne !',
    minPlayers: 2,

  },
  {
    id: 'duel-jongle-distance',
    name: 'Jongle — Plus Longue Distance',
    description:
      'Vous devez faire la plus longue distance possible tout en jonglant. Celui qui fait la plus longue distance gagne !',
    minPlayers: 2,

  },
  {
    id: 'duel-tour-du-monde',
    name: 'Tour du Monde — 45 secondes',
    description:
      'Chacun son tour, réalisez le plus de tours du monde possible en 45 secondes chrono. Celui qui en fait le plus gagne !',
    duration: 45,
    details:
      'Tour du monde : jongle, et au moment où le ballon est en l\'air, fais tourner ton pied autour du ballon (de l\'extérieur vers l\'intérieur) avant de le retoucher. Ça compte si le ballon ne touche pas le sol.',
    minPlayers: 2,

  },
  {
    id: 'duel-crossbar-5',
    name: 'Crossbar Challenge — 5 Tirs',
    description:
      'Chacun tire 5 fois depuis la ligne de la surface et vise la barre transversale. Celui qui touche le plus de fois la barre gagne !',
    minPlayers: 2,

  },
  {
    id: 'duel-crossbar-reverse',
    name: 'Crossbar Reverse',
    description:
      'Tirez depuis la ligne de la surface pour toucher la barre transversale. Si vous réussissez, le joueur suivant a un tir pour annuler votre point — c\'est le Reverse. S\'il touche aussi la barre, c\'est lui qui marque. Sinon, le point est à vous.',
    minPlayers: 2,

  },
  {
    id: 'duel-bresilienne',
    name: 'Brésilienne',
    description:
      'Brésilienne avec 3 touches maximum par joueur. Celui qui fait tomber le ballon a perdu !',
    minPlayers: 2,

  },
  {
    id: 'duel-combat-de-coq',
    name: 'Combat de Coq',
    description:
      'Faites un combat de coq ! Non en vrai vous pouvez changer de défi.',
    minPlayers: 2,

  },
  {
    id: 'duel-ho',
    name: 'HO',
    description:
      'HORSE en version courte — deux lettres suffisent pour être éliminé. Un joueur tente un geste, les autres doivent le reproduire. Ratez et vous perdez une lettre.',
    details:
      'HORSE (HO ici) : à tour de rôle, un joueur propose un geste ou un tir. Tous les autres doivent le reproduire à l\'identique. Celui qui rate prend la lettre suivante (H puis O). Deux lettres et t\'es éliminé.',
    minPlayers: 2,

  },
  {
    id: 'duel-corner-reverse',
    name: 'Corner Rentrant Reverse',
    description:
      'Depuis le drapeau de corner, envoyez un corner rentrant directement dans le but. Si vous réussissez, le joueur suivant a un essai pour annuler votre point — c\'est le Reverse. S\'il entre aussi un corner rentrant, c\'est lui qui marque. Sinon, le point est à vous.',
    details:
      'Corner rentrant : le ballon courbe vers l\'intérieur du but (comme un corner qui entre directement sans être touché).',
    minPlayers: 2,

  },
  {
    id: 'duel-1v1',
    name: '1v1 — Premier But',
    description:
      'Un contre un, en un seul but ! Le premier qui marque gagne !',
    minPlayers: 2,
    maxPlayers: 2,

  },
  {
    id: 'duel-lucarne',
    name: 'La Lucarne',
    description:
      'Placement libre. Le premier qui met une lucarne a gagné !',
    minPlayers: 2,

  },
  {
    id: 'duel-plus-beau-coup-franc',
    name: 'Le Plus Beau Coup Franc',
    description:
      'Chacun choisit son placement et tente son plus beau coup franc en une seule tentative. Le plus beau gagne !',
    minPlayers: 2,

  },
  {
    id: 'duel-penalties',
    name: 'Séance de Tirs au But',
    description:
      'Tirs au but en 6 tentatives chacun. Le plus grand nombre de buts marque la victoire !',
    minPlayers: 2,

  },
];

import type { Challenge } from '../../domain/entities/challenge.entity.js';

export const SURVIVOR_CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      'Depuis la ligne de la surface, visez la barre transversale. Tirez dans l\'ordre affiché. Le dernier à ne pas avoir touché la barre est éliminé !',
    minPlayers: 2,

  },
  {
    id: 'goal-line-precision',
    name: 'Goal Line Precision',
    description:
      'Depuis la ligne médiane, envoyez votre ballon le plus près possible de la ligne de but. Le plus éloigné est éliminé !',
    minPlayers: 2,

  },
  {
    id: 'brasileira',
    name: 'Brasileira',
    description:
      "Brésilienne avec 3 touches maximum par joueur. Celui qui fait tomber la balle est éliminé !",
    minPlayers: 2,

  },
  {
    id: 'qualification',
    name: 'Qualification',
    description:
      '{{gardien}} va au but. Les autres tirent depuis la ligne de la surface — seuls les buteurs passent au tour suivant. Le grand gagnant choisit qui il veut éliminer !',
    minPlayers: 3,

    draw: [{ role: 'gardien' }],
  },
  {
    id: 'tour-du-monde',
    name: 'Tour du monde',
    description:
      'Dans l\'ordre affiché à l\'écran, chacun votre tour, réalisez un tour du monde. Le dernier à ne pas y être arrivé est éliminé.',
    duration: 45,
    details:
      'Tour du monde : jongle, et au moment où le ballon est en l\'air, fais tourner ton pied autour du ballon (de l\'extérieur vers l\'intérieur) avant de le retoucher. Ça compte si le ballon ne touche pas le sol.',
    minPlayers: 2,

  },
  {
    id: 'le-miroir',
    name: 'Le Miroir',
    description:
      "{{désignant}} effectue un geste technique et désigne un adversaire qui doit le reproduire. S'il rate, il est éliminé. S'il réussit, {{désignant}} tu prends la porte !",
    minPlayers: 2,

    draw: [{ role: 'désignant' }],
  },
  {
    id: 'la-quiche',
    name: 'La Quiche',
    description:
      "Tout le monde frappe en dehors de la surface. Les participants se mettent d'accord à l'unanimité pour désigner la quiche qui aura fait la pire frappe qui sera éliminée !",
    minPlayers: 2,

  },
  {
    id: 'chandelle',
    name: 'La Chandelle',
    description:
      "{{envoyeur}} envoie une chandelle. Les autres se battent pour la contrôler, elle doit coller au pied — si le contrôle ressemble à un contrôle sanitaire, on recommence. Celui qui parvient à la coller choisit qui il veut éliminer !",
    minPlayers: 3,

    draw: [{ role: 'envoyeur' }],
  },
  {
    id: 'face-au-gardien',
    name: 'Face au Gardien',
    description:
      "{{tireur}} doit tirer sur {{gardien}} mais c'est {{juge}} qui décide d'où le tir doit être effectué. Celui qui perd le duel est éliminé !",
    minPlayers: 3,

    draw: [{ role: 'gardien' }, { role: 'tireur' }, { role: 'juge' }],
    eliminableRoles: ['gardien', 'tireur'],
  },
  {
    id: 'petit-filet',
    name: 'Petit Filet',
    description:
      "Chacun tire un pénalty sans gardien et doit mettre dans le petit filet. Ceux qui ratent se réaffrontent, et ainsi de suite — jusqu'à ce qu'il ne reste qu'un seul joueur incapable de faire le petit filet !",
    details:
      'Petit filet : les deux coins du but où le filet du fond rejoint le filet latéral — les poches dans les angles. Le ballon doit rentrer dans l\'une de ces deux zones, pas juste dans le but.',
    minPlayers: 2,

  },
  {
    id: 'jongle',
    name: 'La Jongle',
    description:
      'Tout le monde jongle. Celui qui en fait le moins est éliminé !',
    minPlayers: 2,

  },
  {
    id: 'jongle-distance',
    name: 'Jongle & Marche',
    description:
      'Tout le monde jongle en avançant le plus loin possible. Celui qui parcourt la plus courte distance est éliminé !',
    minPlayers: 2,

  },
  {
    id: 'centre-fatal',
    name: 'Centre Fatal',
    description:
      "{{centreur}} envoie un centre, {{finisseur}} doit le reprendre de la tête. S'il rate, {{centreur}} tu es éliminé. S'il marque, élimine qui tu veux.",
    minPlayers: 2,

    draw: [{ role: 'centreur' }, { role: 'finisseur' }],
  },
  {
    id: 'belle-frappe',
    name: 'La Belle Frappe',
    description:
      'Tout le monde tire en dehors de la surface. Celui qui met le plus beau but choisit qui il veut éliminer !',
    minPlayers: 3,

  },
];

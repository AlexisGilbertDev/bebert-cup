import type { Challenge, ChallengeMode } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

const SURVIVOR_CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      'Depuis la ligne de la surface, visez la barre transversale. Tirez dans l\'ordre affiché. Le dernier à ne pas avoir touché la barre est éliminé.',
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'goal-line-precision',
    name: 'Goal Line Precision',
    description:
      'Depuis la ligne médiane, envoyez votre ballon le plus près possible de la ligne de but. Le plus éloigné est éliminé.',
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'brasileira',
    name: 'Brasileira',
    description:
      "Brésilienne avec 3 touches maximum par joueur. Celui qui fait toucher la balle au sol est éliminé.",
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'qualification',
    name: 'Qualification',
    description:
      '{{gardien}} va au but. Les autres tirent depuis la ligne de la surface — seuls les buteurs passent au tour suivant. Le dernier survivant choisit qui il veut éliminer.',
    minPlayers: 3,
    mode: 'survivor',
    draw: [{ role: 'gardien' }],
  },
  {
    id: 'tour-du-monde',
    name: 'Tour du monde',
    description:
      'Chacun votre tour, réalisez un tour du monde. Le dernier à ne pas y être arrivé est éliminé.',
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'le-miroir',
    name: 'Le Miroir',
    description:
      "{{désignant}} effectue un geste technique et désigne un adversaire qui doit le reproduire. S'il rate, le désigné est éliminé. S'il réussit, c'est {{désignant}} qui prend la porte.",
    minPlayers: 2,
    mode: 'survivor',
    draw: [{ role: 'désignant' }],
  },
  {
    id: 'pick-your-poison',
    name: 'Pick Your Poison',
    description:
      "{{désignant}} désigne un adversaire et lui impose le geste technique de son choix. Si le désigné réussit, {{désignant}} est éliminé. S'il échoue, c'est le désigné.",
    minPlayers: 2,
    mode: 'survivor',
    draw: [{ role: 'désignant' }],
  },
  {
    id: 'la-quiche',
    name: 'La Quiche',
    description:
      "Tout le monde frappe en dehors de la surface. Les participants se mettent d'accord à l'unanimité pour désigner la quiche de l'équipe — celui qui a shooté comme un pied.",
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'chandelle',
    name: 'La Chandelle',
    description:
      "{{envoyeur}} envoie une chandelle. Les autres se battent pour la contrôler proprement — si le contrôle ressemble à un contrôle sanitaire, on recommence. Celui qui la colle choisit qui il veut éliminer.",
    minPlayers: 3,
    mode: 'survivor',
    draw: [{ role: 'envoyeur' }],
  },
  {
    id: 'face-au-gardien',
    name: 'Face au Gardien',
    description:
      "{{juge}} choisit l'endroit du tir. {{tireur}} frappe, {{gardien}} doit arrêter. {{tireur}} marque — {{gardien}} est éliminé. {{tireur}} rate — c'est lui qui prend la porte.",
    minPlayers: 3,
    mode: 'survivor',
    draw: [{ role: 'gardien' }, { role: 'tireur' }, { role: 'juge' }],
  },
  {
    id: 'petit-filet',
    name: 'Petit Filet',
    description:
      "Chacun tire un pénalty sans gardien et doit mettre dans le petit filet. Ceux qui ratent se réaffrontent, et ainsi de suite — jusqu'à ce qu'il ne reste qu'un seul joueur incapable de faire le petit filet.",
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'jongle',
    name: 'La Jongle',
    description:
      'Tout le monde jongle en même temps. Chacun annonce son nombre de touches. Celui qui en a fait le moins est éliminé.',
    minPlayers: 2,
    mode: 'survivor',
  },
  {
    id: 'centre-fatal',
    name: 'Centre Fatal',
    description:
      "{{centreur}} envoie un centre, {{finisseur}} doit le reprendre de la tête. S'il rate, {{centreur}} est éliminé. S'il marque, c'est {{finisseur}}.",
    minPlayers: 2,
    mode: 'survivor',
    draw: [{ role: 'centreur' }, { role: 'finisseur' }],
  },
];

const DUEL_CHALLENGES: Challenge[] = [
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
    minPlayers: 2,
    mode: 'duel',
  },
  {
    id: 'duel-corner-reverse',
    name: 'Corner Rentrant Reverse',
    description:
      'Depuis le drapeau de corner, envoyez un corner rentrant avec un tir en reverse. Tapez votre prénom dès que le ballon rentre — premier arrivé, meilleurs points.',
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

const ALL_CHALLENGES = [...SURVIVOR_CHALLENGES, ...DUEL_CHALLENGES];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll(): Challenge[] {
    return ALL_CHALLENGES;
  }

  findByMode(mode: ChallengeMode): Challenge[] {
    return ALL_CHALLENGES.filter((challenge) => challenge.mode === mode);
  }
}

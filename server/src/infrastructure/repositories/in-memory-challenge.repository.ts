import type { Challenge } from '../../domain/entities/challenge.entity.js';
import type { ChallengeRepositoryPort } from '../../domain/ports/challenge-repository.port.js';

const CHALLENGES: Challenge[] = [
  {
    id: 'crossbar-challenge',
    name: 'Crossbar Challenge',
    description:
      'Depuis la ligne de la surface, visez la barre transversale. Les joueurs tirent dans un ordre aléatoire. Le dernier à ne pas avoir touché la barre est éliminé.',
    minPlayers: 2,
  },
  {
    id: 'goal-line-precision',
    name: 'Goal Line Precision',
    description:
      'Depuis la ligne médiane, envoyez votre ballon le plus près possible de la ligne de but. Chaque joueur annonce sa distance. Le plus éloigné est éliminé.',
    minPlayers: 2,
  },
  {
    id: 'brasileira',
    name: 'Brasileira',
    description:
      "Tous ensemble, gardez le ballon en l'air avec 3 touches maximum par joueur. Celui qui laisse tomber est éliminé.",
    minPlayers: 2,
  },
  {
    id: 'qualification',
    name: 'Qualification',
    description:
      '{{gardien}} va au but. Les autres tirent depuis la ligne de la surface — seuls les buteurs passent au tour suivant. Le dernier survivant choisit qui il veut éliminer.',
    minPlayers: 3,
    draw: [{ role: 'gardien' }],
  },
  {
    id: 'tour-du-monde',
    name: 'Tour du monde',
    description:
      'Chacun son tour, réalisez un tour du monde. Le dernier à ne pas y être arrivé est éliminé.',
    minPlayers: 2,
  },
  {
    id: 'le-miroir',
    name: 'Le Miroir',
    description:
      "{{désignant}} effectue un geste technique et désigne un adversaire qui doit le reproduire. S'il rate, le désigné est éliminé. S'il réussit, c'est {{désignant}} qui prend la porte.",
    minPlayers: 2,
    draw: [{ role: 'désignant' }],
  },
  {
    id: 'pick-your-poison',
    name: 'Pick Your Poison',
    description:
      "{{désignant}} désigne un adversaire et lui impose le geste technique de son choix. Si le désigné réussit, {{désignant}} est éliminé. S'il échoue, c'est le désigné.",
    minPlayers: 2,
    draw: [{ role: 'désignant' }],
  },
  {
    id: 'la-quiche',
    name: 'La Quiche',
    description:
      "Tout le monde frappe en dehors de la surface. Les participants se mettent d'accord à l'unanimité pour désigner la quiche de l'équipe — celui qui a shooté comme un pied.",
    minPlayers: 2,
  },
  {
    id: 'chandelle',
    name: 'La Chandelle',
    description:
      "{{envoyeur}} envoie une chandelle. Les autres se battent pour la contrôler proprement — si le contrôle ressemble à un contrôle sanitaire, on recommence. Celui qui la colle choisit qui il veut éliminer.",
    minPlayers: 3,
    draw: [{ role: 'envoyeur' }],
  },
  {
    id: 'face-au-gardien',
    name: 'Face au Gardien',
    description:
      "{{juge}} choisit l'endroit du tir. {{tireur}} frappe, {{gardien}} doit arrêter. {{tireur}} marque — {{gardien}} est éliminé. {{tireur}} rate — c'est lui qui prend la porte.",
    minPlayers: 3,
    draw: [{ role: 'gardien' }, { role: 'tireur' }, { role: 'juge' }],
  },
  {
    id: 'petit-filet',
    name: 'Petit Filet',
    description:
      "Chacun tire un pénalty sans gardien et doit mettre dans le petit filet. Ceux qui ratent se réaffrontent, et ainsi de suite — jusqu'à ce qu'il ne reste qu'un seul joueur incapable de faire le petit filet.",
    minPlayers: 2,
  },
  {
    id: 'jongle',
    name: 'La Jongle',
    description:
      'Tout le monde jongle en même temps. Chacun annonce son nombre de touches. Celui qui en a fait le moins est éliminé.',
    minPlayers: 2,
  },
  {
    id: 'centre-fatal',
    name: 'Centre Fatal',
    description:
      "{{centreur}} envoie un centre, {{finisseur}} doit le reprendre de la tête. S'il rate, {{centreur}} est éliminé. S'il marque, c'est {{finisseur}}.",
    minPlayers: 2,
    draw: [{ role: 'centreur' }, { role: 'finisseur' }],
  },
];

export class InMemoryChallengeRepository implements ChallengeRepositoryPort {
  findAll(): Challenge[] {
    return CHALLENGES;
  }
}

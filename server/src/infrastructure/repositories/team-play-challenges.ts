import type { Challenge } from '../../domain/entities/challenge.entity.js';

export const TEAM_PLAY_CHALLENGES: Challenge[] = [
  {
    id: 'team-penaltys',
    name: 'Séance de Penaltys',
    description:
      'Chaque équipe tire 5 penaltys et s\'organise comme elle le veut — qui tire, qui va au but. L\'équipe qui en marque le plus gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-brasileira',
    name: 'Brasileira en Équipe',
    description:
      'Chaque équipe joue sa brésilienne — 3 touches maximum par joueur, pas de touche au sol. L\'équipe qui tient le plus longtemps gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-coups-francs',
    name: 'Coups Francs',
    description:
      'Chaque joueur choisit son placement et tire un coup franc — sans mur. Les rôles (tireur, gardien) se répartissent équitablement entre les deux équipes. L\'équipe qui marque le plus gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-cul-rouge',
    name: 'Cul Rouge',
    description:
      'Chaque équipe désigne un tireur et un receveur. Le receveur se retourne, se penche, et le tireur adverse lui envoie le ballon. L\'équipe qui vise juste remporte la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-relais-jongle',
    name: 'Relais Jongle',
    description:
      'Chaque joueur jongle 10 fois puis passe à un coéquipier — sans laisser tomber le ballon. L\'équipe qui fait le plus de tours gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-pyramide',
    name: 'La Pyramide',
    description:
      'Chaque membre de l\'équipe doit réaliser une pyramide. La première équipe dont tous les joueurs y sont arrivés gagne la manche !',
    details:
      'La pyramide : jongle en enchaînant 1 touche pied droit, genou droit, épaule droite, tête puis épaule gauche, genou gauche et pied gauche. Tout ça sans laisser tomber la balle.',
    minPlayers: 4,

  },
  {
    id: 'team-gardien-rotatif',
    name: 'Gardien Rotatif',
    description:
      'Chaque joueur de l\'équipe qui défend passe 30 secondes au but pendant que l\'adversaire tire à volonté. L\'équipe qui encaisse le moins de buts gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-petit-pont',
    name: 'Petit Pont 1v1',
    description:
      'Les deux équipes s\'affrontent — la première équipe à mettre un petit pont à n\'importe quel adversaire gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-mini-match',
    name: 'Mini Match',
    description:
      'Match en un but. La première équipe à marquer gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-crossbar',
    name: 'Crossbar Challenge',
    description:
      'Chaque joueur essaie de tirer 2 fois sur la barre transversale depuis la ligne de la surface. L\'équipe qui cumule le plus de barres gagne la manche !',
    minPlayers: 4,

  },
  {
    id: 'team-attaque-defense',
    name: 'Attaque / Défense',
    description:
      '{{équipe attaque}} attaque, l\'autre défend. L\'équipe qui remporte le duel gagne la manche !',
    minPlayers: 4,

    teamDraw: [{ role: 'équipe attaque' }],
  },
  {
    id: 'team-corner-duel',
    name: 'Duel sur Corner',
    description:
      '{{équipe corner}} tire le corner. L\'autre équipe choisit un gardien pour défendre le centre. L\'équipe qui remporte le duel gagne la manche !',
    minPlayers: 4,

    teamDraw: [{ role: 'équipe corner' }],
  },
];

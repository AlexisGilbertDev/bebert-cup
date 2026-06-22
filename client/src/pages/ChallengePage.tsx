import { useSession } from '../context/session.context';

export default function ChallengePage() {
  const { players } = useSession();

  return (
    <main>
      <h1>Challenges</h1>
      <p>Joueurs : {players.join(', ')}</p>
    </main>
  );
}

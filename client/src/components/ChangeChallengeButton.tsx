import './comic.css';

interface ChangeChallengeButtonProps {
  onClick: () => void;
}

export default function ChangeChallengeButton({
  onClick,
}: ChangeChallengeButtonProps) {
  return (
    <button type="button" className="comic-change-btn" onClick={onClick}>
      ↻ Changer de défi
    </button>
  );
}

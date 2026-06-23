import './comic.css';

interface PowBadgeProps {
  children?: React.ReactNode;
}

export default function PowBadge({ children = 'POW!' }: PowBadgeProps) {
  return <div className="comic-pow">{children}</div>;
}

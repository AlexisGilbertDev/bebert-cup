import './comic.css';

interface CaptionProps {
  children: React.ReactNode;
}

export default function Caption({ children }: CaptionProps) {
  return <div className="comic-caption">{children}</div>;
}

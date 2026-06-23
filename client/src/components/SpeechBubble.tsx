import './comic.css';

interface SpeechBubbleProps {
  children: React.ReactNode;
}

export default function SpeechBubble({ children }: SpeechBubbleProps) {
  return <div className="comic-bubble">{children}</div>;
}

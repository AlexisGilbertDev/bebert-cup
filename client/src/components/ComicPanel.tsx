import './comic.css';

interface ComicPanelProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export default function ComicPanel({ children, className = '', style }: ComicPanelProps) {
  return (
    <div className={`comic-panel ${className}`} style={style}>
      {children}
    </div>
  );
}

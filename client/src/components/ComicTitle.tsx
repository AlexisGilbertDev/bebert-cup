import './comic.css';

interface ComicTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  as?: 'h1' | 'h2' | 'h3' | 'div';
  noStroke?: boolean;
}

export default function ComicTitle({
  children,
  size = 'md',
  as: Tag = 'h1',
  noStroke = false,
}: ComicTitleProps) {
  const className = [
    'comic-title',
    `comic-title--${size}`,
    noStroke ? 'comic-title--nostroke' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return <Tag className={className}>{children}</Tag>;
}

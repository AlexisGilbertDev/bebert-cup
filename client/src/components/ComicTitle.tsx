import './comic.css';

interface ComicTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  as?: 'h1' | 'h2' | 'h3' | 'div';
  variant?: 'short' | 'long';
}

export default function ComicTitle({
  children,
  size = 'md',
  as: Tag = 'h1',
  variant = 'short',
}: ComicTitleProps) {
  const className =
    variant === 'long'
      ? `titre-long titre-long--${size}`
      : `comic-title comic-title--${size}`;

  return <Tag className={className}>{children}</Tag>;
}

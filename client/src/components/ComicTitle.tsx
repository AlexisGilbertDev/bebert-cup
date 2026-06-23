import './comic.css';

interface ComicTitleProps {
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  as?: 'h1' | 'h2' | 'h3' | 'div';
}

export default function ComicTitle({ children, size = 'md', as: Tag = 'h1' }: ComicTitleProps) {
  return <Tag className={`comic-title comic-title--${size}`}>{children}</Tag>;
}

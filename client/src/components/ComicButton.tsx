import './comic.css';

interface ComicButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'yellow';
  type?: 'button' | 'submit';
}

export default function ComicButton({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  type = 'button',
}: ComicButtonProps) {
  const variantClass =
    variant === 'ghost'
      ? 'comic-btn comic-btn--ghost'
      : variant === 'yellow'
        ? 'comic-btn comic-btn--yellow'
        : 'comic-btn';

  return (
    <button
      type={type}
      className={variantClass}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

import { useNavigate } from 'react-router-dom';
import './comic.css';

interface PageHeaderProps {
  children: React.ReactNode;
  backTo?: string;
}

export default function PageHeader({
  children,
  backTo = '/',
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <div className="page-header">
      <button
        type="button"
        aria-label="Retour"
        onClick={() => navigate(backTo)}
        className="comic-btn-retour"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M14 5 L7 12 L14 19"
            fill="none"
            stroke="#fff"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      <h1 className="page-header-title">{children}</h1>
    </div>
  );
}

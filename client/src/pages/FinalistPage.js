import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useLocation, useNavigate } from 'react-router-dom';
import ComicButton from '../components/ComicButton';
import ComicPanel from '../components/ComicPanel';
import PageHeader from '../components/PageHeader';
import '../components/comic.css';
export default function FinalistPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const locationState = location.state;
    const finalists = locationState?.finalists;
    const eliminationOrder = locationState?.eliminationOrder;
    if (!finalists || finalists.length !== 2) {
        navigate('/');
        return null;
    }
    return (_jsx("div", { className: "comic-page", children: _jsxs("div", { className: "comic-content", children: [_jsx(PageHeader, { children: "GRANDE FINALE" }), _jsxs(ComicPanel, { style: { padding: 20, textAlign: 'center' }, children: [_jsx("p", { style: { font: '700 14px Nunito', color: 'var(--text-muted)', marginBottom: 12 }, children: "La Bebert Survivor Cup se joue maintenant." }), _jsxs("div", { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16 }, children: [_jsx("span", { style: { font: '900 22px Nunito', color: 'var(--ink)' }, children: finalists[0] }), _jsx("span", { style: { fontFamily: 'Bangers, cursive', color: 'var(--red)', fontSize: 28, letterSpacing: 2 }, children: "VS" }), _jsx("span", { style: { font: '900 22px Nunito', color: 'var(--ink)' }, children: finalists[1] })] })] }), _jsx(ComicButton, { onClick: () => navigate('/survivor/play', { state: { finalists, eliminationOrder } }), children: "LANCER LA FINALE !" })] }) }));
}

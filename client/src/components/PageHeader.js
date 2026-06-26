import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import './comic.css';
export default function PageHeader({ children, backTo = '/' }) {
    const navigate = useNavigate();
    return (_jsxs("div", { className: "page-header", children: [_jsx("button", { type: "button", "aria-label": "Retour", onClick: () => navigate(backTo), className: "comic-btn-retour", children: _jsx("svg", { width: "22", height: "22", viewBox: "0 0 24 24", "aria-hidden": "true", children: _jsx("path", { d: "M14 5 L7 12 L14 19", fill: "none", stroke: "#fff", strokeWidth: "4", strokeLinecap: "round", strokeLinejoin: "round" }) }) }), _jsx("h1", { className: "page-header-title", children: children })] }));
}

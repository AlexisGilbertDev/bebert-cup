import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function ComicPanel({ children, className = '', style }) {
    return (_jsx("div", { className: `comic-panel ${className}`, style: style, children: children }));
}

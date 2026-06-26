import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function PowBadge({ children = 'POW!' }) {
    return _jsx("div", { className: "comic-pow", children: children });
}

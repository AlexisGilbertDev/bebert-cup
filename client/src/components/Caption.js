import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function Caption({ children }) {
    return _jsx("div", { className: "comic-caption", children: children });
}

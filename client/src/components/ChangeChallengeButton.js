import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function ChangeChallengeButton({ onClick }) {
    return (_jsx("button", { type: "button", className: "comic-change-btn", onClick: onClick, children: "\u21BB Changer de d\u00E9fi" }));
}

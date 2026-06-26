import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function ComicButton({ children, onClick, disabled = false, variant = 'primary', type = 'button', }) {
    const variantClass = variant === 'ghost'
        ? 'comic-btn comic-btn--ghost'
        : variant === 'yellow'
            ? 'comic-btn comic-btn--yellow'
            : 'comic-btn';
    return (_jsx("button", { type: type, className: variantClass, onClick: onClick, disabled: disabled, children: children }));
}

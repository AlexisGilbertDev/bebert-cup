import { jsx as _jsx } from "react/jsx-runtime";
import './comic.css';
export default function ComicTitle({ children, size = 'md', as: Tag = 'h1', noStroke = false, }) {
    const className = [
        'comic-title',
        `comic-title--${size}`,
        noStroke ? 'comic-title--nostroke' : '',
    ]
        .filter(Boolean)
        .join(' ');
    return _jsx(Tag, { className: className, children: children });
}

// components/CompanyLogos.js
import React from 'react';

export function RltyLogo() {
    return (
        <svg className="company-logo" viewBox="0 0 594 855" fill="currentColor" aria-hidden="true">
            <path d="M6 302 L402 7 L402 478 L588 624 L588 848 L390 848 L390 480 L201 624 L201 848 L6 848 Z" />
        </svg>
    );
}

export function HausLogo() {
    const body = 'M140.0 37.6 A42 42 0 0 1 189.0 37.6 L286.3 107.5 A45 45 0 0 1 305.0 144.1 L305.0 290.0 A62 62 0 0 1 243.0 352.0 L86.0 352.0 A62 62 0 0 1 24.0 290.0 L24.0 144.1 A45 45 0 0 1 42.7 107.5 Z';
    return (
        <svg className="company-logo" viewBox="20 22 290 334" aria-hidden="true">
            <defs>
                <mask id="haus-logo-mask">
                    <path d={body} fill="#fff" />
                    <rect x="147" y="171" width="37" height="93" rx="18.5" fill="#000" />
                    <rect x="225" y="171" width="37" height="93" rx="18.5" fill="#000" />
                </mask>
            </defs>
            <path d={body} fill="currentColor" mask="url(#haus-logo-mask)" />
        </svg>
    );
}

export function NuraLogo() {
    const half = 'M70 63 L198 63 L235 130 L272 63 L429 63 L429 85 Q429 233 280 233 L70 233 Z';
    return (
        <svg className="company-logo" viewBox="66 59 368 382" fill="currentColor" aria-hidden="true">
            <path d={half} />
            <path d={half} transform="rotate(180 250 250)" />
        </svg>
    );
}

export function VolundLogo() {
    return (
        <svg className="company-logo" viewBox="100 90 520 630" fill="none" stroke="currentColor" strokeWidth="48" aria-hidden="true">
            <circle cx="372" cy="403" r="230" />
            <path d="M155 700 L591 105" strokeLinecap="square" />
        </svg>
    );
}

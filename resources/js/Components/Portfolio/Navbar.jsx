
import { useState } from 'react';

const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Journey', href: '#journey' },
];

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[.08] bg-ink/85 backdrop-blur-xl">
            <nav
                className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8"
                aria-label="Main navigation"
            >
                <a
                    href="#home"
                    onClick={closeMenu}
                    aria-label="Lance Deyto home"
                    className="group flex items-center gap-3"
                >
                    <span className="relative grid h-9 w-9 place-items-center rounded-xl border border-violet-400/40 bg-violet-400/10 text-ice">
                        <svg
                            viewBox="0 0 32 32"
                            fill="none"
                            className="h-6 w-6"
                            aria-hidden="true"
                        >
                            <path
                                d="M16 3v26M4 10l24 12M4 22l24-12M9 5l7 11 7-11M9 27l7-11 7 11M3 16h26"
                                stroke="currentColor"
                                strokeWidth="1.1"
                            />
                            <circle cx="16" cy="16" r="3" fill="currentColor" />
                        </svg>
                    </span>
                    <span className="text-sm font-bold tracking-[.12em]">
                        LANCE<span className="text-violet-300">.DEV</span>
                    </span>
                </a>

                <div className="hidden items-center gap-7 md:flex">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            className="nav-link text-xs text-slate-400 transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                        >
                            {item.name}
                        </a>
                    ))}
                </div>

                <a
                    href="#contact"
                    className="hidden items-center gap-2 border border-violet-300/35 px-4 py-2 text-xs font-semibold transition hover:border-ice hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice sm:inline-flex"
                >
                    LET&apos;S CONNECT <span aria-hidden="true">↗</span>
                </a>

                <button
                    type="button"
                    onClick={() => setMenuOpen((isOpen) => !isOpen)}
                    className="grid h-10 w-10 place-items-center border border-white/10 text-lg transition hover:border-ice hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice md:hidden"
                    aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    <span aria-hidden="true">{menuOpen ? '×' : '☰'}</span>
                </button>
            </nav>

            <div
                id="mobile-menu"
                className={`border-t border-white/10 bg-ink px-5 py-4 transition-[opacity,transform] duration-200 md:hidden ${
                    menuOpen
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none absolute -translate-y-2 opacity-0'
                }`}
                aria-hidden={!menuOpen}
            >
                <div className="mx-auto grid max-w-7xl gap-1">
                    {navigation.map((item) => (
                        <a
                            key={item.name}
                            href={item.href}
                            onClick={closeMenu}
                            tabIndex={menuOpen ? 0 : -1}
                            className="mobile-link rounded-lg px-3 py-3 text-sm text-slate-300 transition hover:bg-white/5 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-ice"
                        >
                            {item.name}
                        </a>
                    ))}
                    <a
                        href="#contact"
                        onClick={closeMenu}
                        tabIndex={menuOpen ? 0 : -1}
                        className="mobile-link rounded-lg px-3 py-3 text-sm text-ice transition hover:bg-white/5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ice"
                    >
                        Let&apos;s connect ↗
                    </a>
                </div>
            </div>
        </header>
    );
}

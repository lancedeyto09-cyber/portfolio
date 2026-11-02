
export default function Footer() {
    return (
        <footer className="relative z-10 border-t border-white/10 bg-ink/80">
            <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
                <a
                    href="#home"
                    className="text-xs font-bold tracking-[.12em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                >
                    LANCE<span className="text-violet-300">.DEV</span>
                </a>
                <p className="mono text-[10px] text-slate-600">
                    DESIGNED &amp; BUILT WITH CURIOSITY{' '}
                    <span className="text-violet-300">✳</span> ©{' '}
                    {new Date().getFullYear()} LANCE DEYTO
                </p>

                <a
                    href="#home"
                    className="text-xs text-slate-500 transition hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                >
                    Back to top ↑
                </a>
            </div>
        </footer>
    );
}

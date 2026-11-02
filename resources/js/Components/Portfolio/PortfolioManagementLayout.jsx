import { Link } from '@inertiajs/react';

export default function PortfolioManagementLayout({
    title,
    description,
    children,
}) {
    return (
        <div className="portfolio-shell relative min-h-screen overflow-hidden text-slate-100 antialiased">
            <div className="site-grid pointer-events-none fixed inset-0 z-0" />
            <div className="edge-web edge-web--top-left" aria-hidden="true" />
            <div className="edge-web edge-web--top-right" aria-hidden="true" />
            <div className="edge-web edge-web--bottom-left" aria-hidden="true" />
            <div className="edge-web edge-web--bottom-right" aria-hidden="true" />

            <header className="relative z-10 border-b border-white/[.08] bg-ink/85 backdrop-blur-xl">
                <nav
                    className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-5 sm:px-8"
                    aria-label="Project management navigation"
                >
                    <Link
                        href="/"
                        className="group flex items-center gap-3"
                        aria-label="Return to Lance Deyto portfolio"
                    >
                        <span className="grid h-9 w-9 place-items-center rounded-xl border border-violet-400/40 bg-violet-400/10 text-ice">
                            <span aria-hidden="true">◇</span>
                        </span>
                        <span className="text-sm font-bold tracking-[.12em]">
                            LANCE<span className="text-violet-300">.DEV</span>
                        </span>
                    </Link>

                    <div className="flex items-center gap-3">
                        <Link
                            href={route('admin.projects.index')}
                            className="hidden text-xs text-slate-300 transition hover:text-ice sm:inline"
                        >
                            Manage projects
                        </Link>
                        <Link
                            href="/"
                            className="border border-violet-300/35 px-3 py-2 text-xs font-semibold text-slate-200 transition hover:border-ice hover:text-ice sm:px-4"
                        >
                            View portfolio <span aria-hidden="true">↗</span>
                        </Link>
                    </div>
                </nav>
            </header>

            <main className="relative z-10">
                <div className="comic-backdrop pointer-events-none absolute inset-0 opacity-15" />
                <div className="web-lines pointer-events-none absolute -right-52 top-24 h-[600px] w-[600px] opacity-30" />

                <div className="relative mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-16">
                    <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
                        <div>
                            <p className="mono mb-3 flex items-center gap-3 text-xs uppercase tracking-[.22em] text-ice">
                                <span className="h-px w-8 bg-ice" />
                                Portfolio / Projects
                            </p>
                            <h1 className="display-title text-4xl font-bold sm:text-5xl">
                                {title}
                            </h1>
                            {description && (
                                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {children}
                </div>
            </main>
        </div>
    );
}

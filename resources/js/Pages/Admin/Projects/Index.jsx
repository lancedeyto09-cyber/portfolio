import PortfolioManagementLayout from '@/Components/Portfolio/PortfolioManagementLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

function Pagination({ links }) {
    if (links.length < 2) {
        return null;
    }

    return (
        <nav
            aria-label="Project pagination"
            className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-4"
        >
            {links.map((link, index) =>
                link.url ? (
                    <Link
                        key={`${link.label}-${index}`}
                        href={link.url}
                        preserveScroll
                        className={`border px-3 py-2 text-sm ${
                            link.active
                                ? 'border-[#78e5ff] bg-[#78e5ff]/10 text-[#78e5ff]'
                                : 'border-white/10 text-slate-300 hover:border-white/30'
                        }`}
                    >
                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </Link>
                ) : (
                    <span
                        key={`${link.label}-${index}`}
                        className="border border-white/10 px-3 py-2 text-sm text-slate-500"
                    >
                        {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                    </span>
                )
            )}
        </nav>
    );
}

export default function Index({ projects, filters }) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const deleteDialog = useRef(null);
    const { flash } = usePage().props;

    useEffect(() => {
        const dialog = deleteDialog.current;

        if (deleteTarget && dialog && !dialog.open) {
            dialog.showModal();
        } else if (!deleteTarget && dialog?.open) {
            dialog.close();
        }
    }, [deleteTarget]);

    const submitSearch = (event) => {
        event.preventDefault();
        router.get(
            route('admin.projects.index'),
            { search },
            { preserveState: true, preserveScroll: true, replace: true }
        );
    };

    const confirmDelete = () => {
        if (!deleteTarget || deleting) {
            return;
        }

        setDeleting(true);
        router.delete(
            route('admin.projects.destroy', deleteTarget.id),
            {
                preserveScroll: true,
                onSuccess: () => setDeleteTarget(null),
                onFinish: () => setDeleting(false),
            }
        );
    };

    return (
        <PortfolioManagementLayout
            title="Project management."
            description="Add, update, and remove the projects shown on your public portfolio."
        >
            <Head title="Project Management" />

            <div>
                <div className="mx-auto max-w-7xl">
                    {flash?.success && (
                        <div
                            className="mb-6 border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-emerald-200"
                            role="status"
                            aria-live="polite"
                        >
                            {flash.success}
                        </div>
                    )}

                    <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex flex-wrap items-center gap-4">
                            <p className="text-sm text-slate-300">
                                {projects.total}{' '}
                                {projects.total === 1
                                    ? 'project'
                                    : 'projects'}
                            </p>
                            <Link
                                href={route('admin.projects.create')}
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#78e5ff] px-4 py-2.5 text-sm font-semibold text-[#090914] transition hover:opacity-90"
                            >
                                <span aria-hidden="true">+</span> Add a project
                            </Link>
                        </div>
                        <form
                            onSubmit={submitSearch}
                            className="flex w-full max-w-md gap-2"
                            role="search"
                        >
                            <label htmlFor="project-search" className="sr-only">
                                Search projects by title
                            </label>
                            <input
                                id="project-search"
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search project titles"
                                className="min-w-0 flex-1 border border-white/15 bg-[#111126] px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#78e5ff] focus:outline-none focus:ring-1 focus:ring-[#78e5ff]"
                            />
                            <button
                                type="submit"
                                className="border border-[#78e5ff]/50 px-4 py-2 text-sm font-medium text-[#78e5ff] hover:bg-[#78e5ff]/10"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    <div className="overflow-hidden border border-white/10 bg-[#111126]">
                        {projects.data.length > 0 ? (
                            <>
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[700px] divide-y divide-white/10 text-left text-sm">
                                        <thead className="bg-white/[.03] text-xs uppercase tracking-wide text-slate-400">
                                            <tr>
                                                <th scope="col" className="px-4 py-3">
                                                    Project
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Technologies
                                                </th>
                                                <th scope="col" className="px-4 py-3">
                                                    Completed
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-4 py-3 text-right"
                                                >
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/10">
                                            {projects.data.map((project) => (
                                                <tr key={project.id}>
                                                    <td className="px-4 py-4">
                                                        <div className="flex items-center gap-3">
                                                            {project.image_url ? (
                                                                <img
                                                                    src={project.image_url}
                                                                    alt=""
                                                                    className="h-12 w-16 shrink-0 border border-white/10 object-cover"
                                                                    loading="lazy"
                                                                />
                                                            ) : (
                                                                <div
                                                                    className="grid h-12 w-16 shrink-0 place-items-center border border-violet-300/20 bg-violet-500/10 text-violet-200"
                                                                    aria-hidden="true"
                                                                >
                                                                    ◇
                                                                </div>
                                                            )}
                                                            <span className="font-semibold text-white">
                                                                {project.title}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-300">
                                                        <div className="flex max-w-sm flex-wrap gap-1.5">
                                                            {project.tech_stack.map(
                                                                (technology) => (
                                                                    <span
                                                                        key={technology}
                                                                        className="border border-violet-300/20 bg-violet-400/10 px-2 py-1 text-xs"
                                                                    >
                                                                        {technology}
                                                                    </span>
                                                                )
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-4 text-slate-300">
                                                        {project.date_completed ??
                                                            '—'}
                                                    </td>
                                                    <td className="px-4 py-4">
                                                        <div className="flex justify-end gap-3">
                                                            <Link
                                                                href={route(
                                                                    'admin.projects.edit',
                                                                    project.id
                                                                )}
                                                                className="font-medium text-[#78e5ff] hover:text-white"
                                                            >
                                                                Edit
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    setDeleteTarget(
                                                                        project
                                                                    )
                                                                }
                                                                className="font-medium text-rose-300 hover:text-rose-100"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                <Pagination links={projects.links} />
                            </>
                        ) : (
                            <div className="px-6 py-16 text-center">
                                <h2 className="text-lg font-semibold">
                                    {filters.search
                                        ? 'No matching projects'
                                        : 'No projects yet'}
                                </h2>
                                <p className="mt-2 text-sm text-slate-400">
                                    {filters.search
                                        ? 'Try another title or clear your search.'
                                        : 'Add your first project to show it on your public portfolio.'}
                                </p>
                                {!filters.search && (
                                    <Link
                                        href={route('admin.projects.create')}
                                        className="mt-5 inline-flex bg-violet-600 px-4 py-2 text-sm font-semibold hover:bg-violet-500"
                                    >
                                        Add Project
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <dialog
                ref={deleteDialog}
                onClose={() => setDeleteTarget(null)}
                onCancel={(event) => {
                    event.preventDefault();
                    setDeleteTarget(null);
                }}
                onKeyDown={(event) => {
                    if (event.key === 'Escape') {
                        event.preventDefault();
                        setDeleteTarget(null);
                    }
                }}
                aria-labelledby="delete-project-title"
                aria-describedby="delete-project-description"
                className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-lg border border-violet-300/30 bg-[#111126] p-0 text-white shadow-[0_24px_100px_rgba(0,0,0,.7)] backdrop:bg-[#050510]/80 backdrop:backdrop-blur-sm"
            >
                {deleteTarget && (
                    <div className="relative overflow-hidden p-6 sm:p-8">
                        <div
                            className="web-lines pointer-events-none absolute -right-20 -top-20 h-56 w-56 opacity-60"
                            aria-hidden="true"
                        />
                        <div className="relative">
                            <p className="mono text-[10px] uppercase tracking-[.2em] text-rose-300">
                                Confirm / Delete
                            </p>
                            <h2
                                id="delete-project-title"
                                className="mt-3 text-2xl font-semibold"
                            >
                                Delete this project?
                            </h2>
                            <p
                                id="delete-project-description"
                                className="mt-3 text-sm leading-6 text-slate-300"
                            >
                                <span className="font-semibold text-white">
                                    {deleteTarget.title}
                                </span>{' '}
                                will be permanently removed from your portfolio.
                                This action cannot be undone.
                            </p>
                            <div className="mt-7 flex flex-wrap justify-end gap-3 border-t border-white/10 pt-5">
                                <button
                                    type="button"
                                    autoFocus
                                    onClick={() => deleteDialog.current?.close()}
                                    disabled={deleting}
                                    className="border border-white/20 px-5 py-3 text-sm font-medium text-slate-200 transition hover:border-[#78e5ff] hover:text-[#78e5ff] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice disabled:opacity-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={confirmDelete}
                                    disabled={deleting}
                                    className="border border-rose-300/40 bg-rose-400/10 px-5 py-3 text-sm font-semibold text-rose-200 transition hover:border-rose-200 hover:bg-rose-400/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-200 disabled:cursor-wait disabled:opacity-50"
                                >
                                    {deleting ? 'Deleting…' : 'Delete project'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </dialog>
        </PortfolioManagementLayout>
    );
}

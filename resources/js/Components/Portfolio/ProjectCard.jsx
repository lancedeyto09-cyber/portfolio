export default function ProjectCard({
    number,
    total,
    title,
    description,
    technologies = [],
    project_url,
    repository_url,
    image_url,
}) {
    return (
        <article className="project-card reveal group overflow-hidden border transition hover:-translate-y-1 hover:border-violet-300/60">
            <div className="project-art relative flex h-52 flex-col overflow-hidden p-4 sm:p-5">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={`${title} project`}
                        className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                ) : (
                    <>
                        <span className="project-label mono">
                            {number} <span className="text-violet-200">/</span>{' '}
                            PROJECT
                        </span>
                        <div className="project-preview project-preview-window rotate-[-2deg] border border-white/20 p-3 shadow-2xl transition duration-500 group-hover:rotate-0">
                            <div className="project-mockup-copy mono flex items-center justify-between gap-2 border-b border-white/10 pb-2">
                                <span className="truncate font-bold tracking-wide text-white">
                                    {title.toUpperCase()}
                                </span>
                                <span className="shrink-0 text-ice">
                                    {number} / {total}
                                </span>
                            </div>
                            <div className="mt-3 grid grid-cols-[1fr_1.4fr] gap-2">
                                <div className="space-y-1.5">
                                    <div className="h-3 rounded-sm bg-violet-400/30" />
                                    <div className="h-3 rounded-sm bg-white/5" />
                                    <div className="h-3 rounded-sm bg-white/5" />
                                </div>
                                <div className="flex h-[60px] items-end gap-1 border border-white/10 p-2">
                                    <i className="h-1/3 flex-1 bg-violet-400" />
                                    <i className="h-2/3 flex-1 bg-ice/70" />
                                    <i className="h-1/2 flex-1 bg-violet-400/70" />
                                    <i className="h-full flex-1 bg-ice" />
                                    <i className="h-3/4 flex-1 bg-violet-400" />
                                </div>
                            </div>
                        </div>
                        <span className="project-label mono">
                            PROJECT {number}
                        </span>
                    </>
                )}
            </div>

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{title}</h3>
                    <span className="mono mt-1 text-sm text-ice">{number}</span>
                </div>
                <p className="project-description mt-3">{description}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                    {technologies.map((technology) => (
                        <span
                            key={technology}
                            className="project-tech border px-3 py-1.5"
                        >
                            {technology}
                        </span>
                    ))}
                </div>
                {(project_url || repository_url) && (
                    <div className="project-meta mono mt-5 flex flex-wrap gap-5 border-t border-white/10 pt-4">
                        {project_url && (
                            <a
                                href={project_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-ice transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
                            >
                                Live project ↗
                            </a>
                        )}
                        {repository_url && (
                            <a
                                href={repository_url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-ice transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
                            >
                                Repository ↗
                            </a>
                        )}
                    </div>
                )}
            </div>
        </article>
    );
}

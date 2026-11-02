
export default function SectionTitle({
    eyebrow,
    title,
    accent,
    description,
    stacked = false,
    large = false,
}) {
    return (
        <div
            className={
                stacked
                    ? ''
                    : 'reveal flex flex-col justify-between gap-5 sm:flex-row sm:items-end'
            }
        >
            <div>
                {eyebrow && (
                    <p className="section-kicker mono mb-4 uppercase tracking-[.2em] text-violet-300">
                        {eyebrow}
                    </p>
                )}
                <h2
                    className={`text-4xl font-semibold sm:text-5xl ${
                        stacked ? 'leading-tight' : ''
                    } ${
                        large ? 'text-5xl sm:text-6xl' : ''
                    }`}
                >
                    {title}
                    {stacked && <br />}
                    {accent && (
                        <span className="text-ice">
                            {stacked ? accent : ` ${accent}`}
                        </span>
                    )}
                </h2>
            </div>
            {description && (
                <p className="max-w-sm text-sm leading-6 text-slate-400">
                    {description}
                </p>
            )}
        </div>
    );
}


export default function SkillCard({ name, description, icon }) {
    return (
        <article className="skill-card group border border-white/10 p-4 transition hover:-translate-y-1 hover:border-violet-300/50">
            <span className="text-xl text-ice" aria-hidden="true">
                {icon}
            </span>
            <h3 className="mt-4 text-base font-semibold">{name}</h3>
            <p className="mt-1 text-sm text-slate-400">{description}</p>
        </article>
    );
}

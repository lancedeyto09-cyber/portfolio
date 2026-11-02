import { Head, Link } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

import Footer from '../../Components/Portfolio/Footer';
import Navbar from '../../Components/Portfolio/Navbar';
import ProjectCard from '../../Components/Portfolio/ProjectCard';
import SectionTitle from '../../Components/Portfolio/SectionTitle';
import SkillCard from '../../Components/Portfolio/SkillCard';

const skillCategories = {
    Programming: [
        { name: 'Java', description: 'Programming language', icon: 'J' },
        { name: 'C++', description: 'Programming language', icon: 'C+' },
        { name: 'HTML', description: 'Web page structure', icon: '</>' },
        { name: 'CSS', description: 'Web page styling', icon: '{ }' },
    ],
    Tools: [
        { name: 'Blender', description: '3D modeling', icon: '◇' },
        { name: 'Photoshop', description: 'Image editing', icon: 'Ps' },
        { name: 'VS Code', description: 'Code editor', icon: '</>' },
    ],
    Interests: [
        { name: 'Gaming', description: 'Games and interactive worlds', icon: '⌘' },
        { name: 'Anime & movies', description: 'Stories on screen', icon: '▶' },
        { name: 'Drawing', description: 'Sketching and illustration', icon: '✳' },
        { name: '3D modeling', description: 'Creating in three dimensions', icon: '◇' },
        { name: 'Coding', description: 'Building with technology', icon: '</>' },
        { name: 'Musical instruments', description: 'Music and playing instruments', icon: '♫' },
        { name: 'Manga', description: 'Stories in illustrated form', icon: '▤' },
    ],
};

const emailAddress = 'lancedeyto09@gmail.com';

export default function Index({ projects = [] }) {
    const [activeSkill, setActiveSkill] = useState('Programming');
    const [form, setForm] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [submittedName, setSubmittedName] = useState('');
    const firstInvalidField = useRef(null);

    useEffect(() => {
        const elements = document.querySelectorAll('.reveal');

        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !('IntersectionObserver' in window)
        ) {
            elements.forEach((element) => element.classList.add('is-visible'));
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.12 }
        );

        elements.forEach((element) => observer.observe(element));

        return () => observer.disconnect();
    }, []);

    const handleSkillKeyDown = (event, currentIndex) => {
        if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') {
            return;
        }

        event.preventDefault();
        const categories = Object.keys(skillCategories);
        const direction = event.key === 'ArrowRight' ? 1 : -1;
        const nextIndex =
            (currentIndex + direction + categories.length) % categories.length;
        const nextCategory = categories[nextIndex];

        setActiveSkill(nextCategory);
        document.getElementById(`skill-tab-${nextCategory}`)?.focus();
    };

    const validateForm = () => {
        const nextErrors = {};

        if (form.name.trim().length < 2) {
            nextErrors.name = 'Please enter at least 2 characters.';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            nextErrors.email = 'Please enter a valid email address.';
        }

        if (form.message.trim().length < 10) {
            nextErrors.message = 'Please enter at least 10 characters.';
        }

        setErrors(nextErrors);
        firstInvalidField.current = Object.keys(nextErrors)[0] ?? null;

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmittedName('');

        if (!validateForm()) {
            document
                .getElementById(`contact-${firstInvalidField.current}`)
                ?.focus();
            return;
        }

        setSubmittedName(form.name.trim());
        setForm({ name: '', email: '', message: '' });
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setForm((previous) => ({ ...previous, [name]: value }));
        setErrors((previous) => ({ ...previous, [name]: '' }));
        setSubmittedName('');
    };

    return (
        <>
            <Head title="Lance Andrei Deyto — IT Student" />

            <div className="portfolio-shell relative min-h-screen overflow-x-hidden text-slate-100 antialiased">
                <div className="site-grid pointer-events-none fixed inset-0 z-0" />
                <div className="edge-web edge-web--top-left" aria-hidden="true" />
                <div className="edge-web edge-web--top-right" aria-hidden="true" />
                <div className="edge-web edge-web--bottom-left" aria-hidden="true" />
                <div className="edge-web edge-web--bottom-right" aria-hidden="true" />

                <Navbar />

                <main className="relative z-10">
                    <section
                        id="home"
                        className="relative flex min-h-[760px] items-center overflow-hidden border-b border-white/10 pt-20 sm:min-h-[820px]"
                    >
                        <div className="hero-backdrop pointer-events-none absolute inset-0" />
                        <div className="hero-glow pointer-events-none absolute inset-0" />
                        <div className="web-lines pointer-events-none absolute -right-20 -top-8 h-[680px] w-[700px] opacity-80" />

                        <div className="mx-auto grid w-full max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:gap-8 lg:py-20">
                            <div className="reveal relative z-10">
                                <p className="section-kicker mono mb-7 flex items-center gap-3 uppercase tracking-[.22em] text-ice">
                                    <span className="h-px w-8 bg-ice" />
                                    IT student
                                    <span className="text-slate-600">
                                        // Pangasinan, PH
                                    </span>
                                </p>

                                <h1 className="display-title max-w-3xl text-6xl font-bold sm:text-7xl lg:text-[6.5rem]">
                                    LANCE ANDREI
                                    <span className="mt-2 block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-ice bg-clip-text text-transparent">
                                        DEYTO<span className="text-ice">.</span>
                                    </span>
                                </h1>

                                <p className="mt-7 max-w-xl text-base leading-7 text-slate-300 sm:text-lg">
                                    I’m an Information Technology student
                                    learning to turn curious ideas into useful
                                    mobile apps, responsive websites, and
                                    creative digital experiences.
                                </p>
                                <p className="mono mt-3 max-w-lg text-sm leading-6 text-slate-400">
                                    // Studying at Urdaneta City University ·
                                    building as I learn
                                </p>

                                <div className="mt-9 flex flex-wrap gap-3">
                                    <a
                                        href="#projects"
                                        className="group inline-flex items-center gap-3 bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_0_32px_rgba(168,85,247,.24)] transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                    >
                                        Explore my work
                                        <span className="transition group-hover:translate-x-1">
                                            ↗
                                        </span>
                                    </a>
                                    <a
                                        href="#contact"
                                        className="inline-flex items-center gap-3 border border-white/20 px-5 py-3.5 text-sm font-semibold text-slate-200 transition hover:border-ice/60 hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                    >
                                        Say hello
                                        <span aria-hidden="true">↗</span>
                                    </a>
                                </div>

                                <div className="mt-12 flex items-center gap-4">
                                    <span className="mono text-xs uppercase tracking-[.1em] text-slate-400">
                                        Find me
                                    </span>
                                    <span className="h-px w-8 bg-white/15" />
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        aria-label={`Email Lance at ${emailAddress}`}
                                        className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-slate-300 transition hover:border-ice hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            className="h-4 w-4"
                                            aria-hidden="true"
                                        >
                                            <path
                                                d="M3 6.5h18v11H3zM3 7l9 7 9-7"
                                                stroke="currentColor"
                                                strokeWidth="1.5"
                                            />
                                        </svg>
                                    </a>
                                    <span className="mono ml-1 text-xs text-slate-400">
                                        Currently growing, always learning.
                                    </span>
                                </div>
                            </div>

                            <div className="reveal relative mx-auto w-full max-w-[460px] lg:ml-auto">
                                <div className="photo-frame mx-3">
                                    <div className="absolute -inset-5 bg-gradient-to-br from-violet-500/20 via-transparent to-ice/15 blur-2xl" />
                                    <div className="relative aspect-[4/5] overflow-hidden border border-white/15 bg-gradient-to-br from-slate-100 via-slate-200 to-violet-200 shadow-[0_28px_100px_rgba(0,0,0,.5)]">
                                        <img
                                            src="/images/6c0ab011-68f0-4481-80ee-1480288aab07.png"
                                            alt="Portrait of Lance Andrei Deyto"
                                            className="h-full w-full object-cover object-[center_20%]"
                                            fetchpriority="high"
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-7 -left-3 z-20 border border-ice/35 bg-ink/90 px-4 py-3 backdrop-blur">
                                    <span className="mono block text-xs uppercase tracking-[.1em] text-slate-400">
                                        Based in
                                    </span>
                                    <span className="text-base font-medium">
                                        Pangasinan, Philippines
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="mono absolute bottom-5 right-8 hidden text-[10px] tracking-[.15em] text-slate-600 sm:block">
                            SCROLL TO EXPLORE ↓
                        </div>
                    </section>

                    <section
                        id="about"
                        className="relative scroll-mt-20 overflow-hidden border-b border-white/10 py-24 sm:py-28"
                    >
                        <div className="city-backdrop pointer-events-none absolute inset-0 opacity-25" />
                        <div className="web-lines pointer-events-none absolute -bottom-44 -left-44 h-[520px] w-[600px] rotate-180 opacity-40" />

                        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[.72fr_1.28fr] lg:gap-20">
                            <div className="reveal">
                                <SectionTitle
                                    eyebrow="01 / About me"
                                    title="A little logic."
                                    accent="A lot of imagination."
                                    stacked
                                />
                                <div className="mt-8 h-px w-20 bg-gradient-to-r from-violet-400 to-ice" />
                                <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                                    I’m a creative, detail-oriented Information
                                    Technology student at Urdaneta City
                                    University. Through academic and personal
                                    projects, I’m learning to build mobile apps
                                    and websites while bringing programming and
                                    design together.
                                </p>
                                <p className="mt-4 max-w-md text-sm leading-7 text-slate-400">
                                    Outside of technology, I enjoy gaming,
                                    anime and movies, drawing, 3D modeling,
                                    musical instruments, and manga.
                                </p>
                                <a
                                    href="#journey"
                                    className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-ice transition hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                >
                                    More about my journey <span>↗</span>
                                </a>
                            </div>

                            <div className="reveal grid gap-4 sm:grid-cols-[.78fr_1.22fr]">
                                <div className="relative min-h-[300px] overflow-hidden border border-white/10 bg-panel">
                                    <img
                                        src="/images/d59cd646-1747-471d-b0d4-ba261ee2b4dc.png"
                                        alt="Lance Andrei"
                                        className="absolute inset-0 h-full w-full object-cover object-[center_16%] opacity-80"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/5 to-transparent" />
                                </div>

                                <div className="grid gap-4">
                                    <div className="card-cut gradient-panel border p-6 sm:p-7">
                                        <span className="mono text-[10px] uppercase tracking-[.18em] text-violet-300">
                                            My north star
                                        </span>
                                        <p className="mt-3 text-2xl font-medium leading-snug">
                                            Build things that make someone’s
                                            day a little easier.
                                        </p>
                                        <p className="mt-3 text-sm leading-6 text-slate-400">
                                            Keep learning, stay curious, and
                                            create technology with people in
                                            mind.
                                        </p>
                                    </div>
                                    <div className="grid gap-3 sm:grid-cols-3">
                                        <div className="gradient-panel border p-4">
                                            <span className="text-xl text-ice">✳</span>
                                            <p className="mt-3 text-base font-semibold">
                                                Problem solver
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                I like untangling ideas into
                                                practical steps.
                                            </p>
                                        </div>
                                        <div className="gradient-panel border p-4">
                                            <span className="text-xl text-violet-300">◇</span>
                                            <p className="mt-3 text-base font-semibold">
                                                Creative thinker
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Design details matter as much
                                                as the code.
                                            </p>
                                        </div>
                                        <div className="gradient-panel border p-4">
                                            <span className="text-xl text-ice">↗</span>
                                            <p className="mt-3 text-base font-semibold">
                                                Quick learner
                                            </p>
                                            <p className="mt-1 text-sm leading-6 text-slate-400">
                                                Always ready to explore the
                                                next tool.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="skills"
                        className="relative scroll-mt-20 overflow-hidden border-b border-white/10 py-24 sm:py-28"
                    >
                        <div className="city-backdrop pointer-events-none absolute inset-0 opacity-20" />
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <SectionTitle
                                eyebrow="02 / Skills"
                                title="Tools in my"
                                accent="orbit."
                                description="Programming languages, tools, and interests I’m exploring as I continue learning."
                            />

                            <div className="reveal mt-10">
                                <div
                                    className="mb-6 flex flex-wrap gap-2"
                                    role="tablist"
                                    aria-label="Skill categories"
                                >
                                    {Object.keys(skillCategories).map(
                                        (category, index) => (
                                            <button
                                                key={category}
                                                id={`skill-tab-${category}`}
                                                type="button"
                                                role="tab"
                                                aria-selected={
                                                    activeSkill === category
                                                }
                                                aria-controls="skills-panel"
                                                tabIndex={
                                                    activeSkill === category
                                                        ? 0
                                                        : -1
                                                }
                                                onClick={() =>
                                                    setActiveSkill(category)
                                                }
                                                onKeyDown={(event) =>
                                                    handleSkillKeyDown(
                                                        event,
                                                        index
                                                    )
                                                }
                                                className="skill-tab border border-white/10 px-4 py-2 text-xs text-slate-400 transition hover:border-violet-300/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ice"
                                            >
                                                {category}
                                            </button>
                                        )
                                    )}
                                </div>

                                <div
                                    id="skills-panel"
                                    className="skill-panel grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6"
                                    role="tabpanel"
                                    aria-labelledby={`skill-tab-${activeSkill}`}
                                >
                                    {skillCategories[activeSkill].map(
                                        (skill) => (
                                            <SkillCard
                                                key={skill.name}
                                                {...skill}
                                            />
                                        )
                                    )}
                                </div>
                            </div>
                        </div>
                    </section>

                    <section
                        id="projects"
                        className="relative scroll-mt-20 overflow-hidden border-b border-white/10 py-24 sm:py-28"
                    >
                        <div className="comic-backdrop pointer-events-none absolute inset-0 opacity-30" />
                        <div className="web-lines pointer-events-none absolute -right-56 top-0 h-[650px] w-[650px] opacity-30" />
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <SectionTitle
                                eyebrow="03 / Selected projects"
                                title="Made with purpose"
                                accent="."
                                description="School and personal projects built while learning to bring ideas to life."
                            />

                            <div className="reveal mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={route('admin.projects.create')}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#a855f7] to-[#78e5ff] px-5 py-3 text-sm font-semibold text-[#090914] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                >
                                    <span aria-hidden="true">+</span> Add a
                                    project
                                </Link>
                                <Link
                                    href={route('admin.projects.index')}
                                    className="inline-flex items-center border border-violet-300/35 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:border-ice hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                >
                                    Manage projects
                                </Link>
                            </div>

                            {projects.length > 0 ? (
                                <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                                    {projects.map((project, index) => (
                                        <ProjectCard
                                            key={project.id}
                                            number={String(index + 1).padStart(
                                                2,
                                                '0'
                                            )}
                                            total={projects.length}
                                            title={project.title}
                                            description={project.description}
                                            technologies={project.tech_stack}
                                            project_url={project.project_url}
                                            repository_url={
                                                project.repository_url
                                            }
                                            image_url={project.image_url}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <p className="mt-10 border border-white/10 bg-[#111126]/70 px-6 py-10 text-center text-slate-300">
                                    My projects will be featured here soon.
                                </p>
                            )}
                        </div>
                    </section>

                    <section
                        id="journey"
                        className="relative scroll-mt-20 overflow-hidden border-b border-white/10 py-24 sm:py-28"
                    >
                        <div className="comic-backdrop pointer-events-none absolute inset-0 opacity-20" />
                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <SectionTitle
                                eyebrow="04 / Education"
                                title="The path so"
                                accent="far."
                                description="Learning by doing and bringing each experience into the next thing I build."
                            />

                            <div className="relative mt-12">
                                <div className="absolute bottom-0 left-[7px] top-2 w-px bg-gradient-to-b from-violet-400 via-ice/70 to-transparent md:left-1/2" />
                                <article className="experience-card reveal relative grid gap-4 p-5 pl-9 md:grid-cols-2 md:gap-10 md:p-6 md:pl-0">
                                    <span className="absolute left-0 top-1.5 z-10 h-4 w-4 rounded-full border-2 border-ice bg-ink shadow-[0_0_18px_rgba(120,229,255,.4)] md:left-[calc(50%-8px)]" />
                                    <div className="md:pr-10 md:text-right">
                                        <p className="mono text-sm tracking-wider text-ice">
                                            ACADEMIC BACKGROUND
                                        </p>
                                        <h3 className="mt-2 text-2xl font-semibold leading-tight">
                                            Bachelor of Science in Information
                                            Technology
                                        </h3>
                                        <p className="mt-2 text-base text-slate-400">
                                            Urdaneta City University
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4 text-base leading-7 text-slate-300">
                                        <span className="grid h-11 w-11 shrink-0 place-items-center border border-ice/30 bg-gradient-to-br from-violet-400/20 to-ice/10 text-lg text-ice">
                                            ⌘
                                        </span>
                                        <p>
                                            Studying information technology
                                            while developing skills through
                                            programming, creative interests,
                                            and school projects.
                                        </p>
                                    </div>
                                </article>
                            </div>
                        </div>
                    </section>

                    <section
                        id="contact"
                        className="relative scroll-mt-20 overflow-hidden py-24 sm:py-28"
                    >
                        <div className="comic-backdrop pointer-events-none absolute inset-0 opacity-35" />
                        <div className="web-lines pointer-events-none absolute -bottom-40 -right-40 h-[600px] w-[600px] opacity-50" />

                        <div className="mx-auto max-w-7xl px-5 sm:px-8">
                            <div className="reveal grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
                                <div>
                                    <SectionTitle
                                        eyebrow="05 / Contact"
                                        title="Got an idea?"
                                        accent="Let’s make it real."
                                        stacked
                                        large
                                    />
                                    <p className="mt-6 max-w-md text-sm leading-7 text-slate-400">
                                        I’m happy to connect with people who
                                        share an interest in technology and
                                        creative projects.
                                    </p>
                                    <a
                                        href={`mailto:${emailAddress}`}
                                        className="mt-8 inline-flex items-center gap-3 border-b border-ice/40 pb-2 text-sm text-white transition hover:border-ice hover:text-ice focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                    >
                                        <span className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-ice">
                                            ✉
                                        </span>
                                        {emailAddress}
                                        <span>↗</span>
                                    </a>
                                    <div className="mono mt-8 text-[10px] uppercase tracking-[.15em] text-slate-600">
                                        PANGASINAN, PHILIPPINES
                                        <span className="mx-2 text-violet-300">
                                            /
                                        </span>
                                        OPEN TO CONNECT
                                    </div>
                                </div>

                                <form
                                    onSubmit={handleSubmit}
                                    className="contact-form-panel border border-violet-200/20 p-5 shadow-[0_18px_55px_rgba(0,0,0,.22)] sm:p-8"
                                    noValidate
                                >
                                    <div className="mb-7 flex items-start justify-between gap-4">
                                        <div>
                                            <p className="mono text-[10px] uppercase tracking-[.18em] text-ice">
                                                Send a message
                                            </p>
                                            <h3 className="mt-2 text-2xl font-semibold">
                                                Start a conversation.
                                            </h3>
                                        </div>
                                        <span className="mono text-[10px] text-slate-600">
                                            FORM / 001
                                        </span>
                                    </div>

                                    <div className="grid gap-5 sm:grid-cols-2">
                                        <div>
                                            <label
                                                htmlFor="contact-name"
                                                className="mb-2 block text-xs text-slate-300"
                                            >
                                                Your name
                                            </label>
                                            <input
                                                id="contact-name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleInputChange}
                                                autoComplete="name"
                                                required
                                                minLength={2}
                                                aria-invalid={Boolean(
                                                    errors.name
                                                )}
                                                aria-describedby="contact-name-error"
                                                className="w-full border border-white/10 bg-ink/80 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400"
                                                placeholder="Your name"
                                            />
                                            <p
                                                id="contact-name-error"
                                                className="mt-1 min-h-5 text-xs text-rose-300"
                                                aria-live="polite"
                                            >
                                                {errors.name}
                                            </p>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="contact-email"
                                                className="mb-2 block text-xs text-slate-300"
                                            >
                                                Email address
                                            </label>
                                            <input
                                                id="contact-email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                onChange={handleInputChange}
                                                autoComplete="email"
                                                required
                                                aria-invalid={Boolean(
                                                    errors.email
                                                )}
                                                aria-describedby="contact-email-error"
                                                className="w-full border border-white/10 bg-ink/80 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400"
                                                placeholder="you@example.com"
                                            />
                                            <p
                                                id="contact-email-error"
                                                className="mt-1 min-h-5 text-xs text-rose-300"
                                                aria-live="polite"
                                            >
                                                {errors.email}
                                            </p>
                                        </div>

                                        <div className="sm:col-span-2">
                                            <label
                                                htmlFor="contact-message"
                                                className="mb-2 block text-xs text-slate-300"
                                            >
                                                Your message
                                            </label>
                                            <textarea
                                                id="contact-message"
                                                name="message"
                                                rows="5"
                                                value={form.message}
                                                onChange={handleInputChange}
                                                required
                                                minLength={10}
                                                aria-invalid={Boolean(
                                                    errors.message
                                                )}
                                                aria-describedby="contact-message-error"
                                                className="w-full resize-y border border-white/10 bg-ink/80 px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-violet-400 focus-visible:ring-2 focus-visible:ring-violet-400"
                                                placeholder="Tell me a little about your message..."
                                            />
                                            <p
                                                id="contact-message-error"
                                                className="mt-1 min-h-5 text-xs text-rose-300"
                                                aria-live="polite"
                                            >
                                                {errors.message}
                                            </p>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="group mt-5 flex w-full items-center justify-center gap-3 bg-violet-500 px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-violet-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ice"
                                    >
                                        Send message
                                        <span className="transition group-hover:translate-x-1">
                                            ↗
                                        </span>
                                    </button>

                                    <p
                                        className="mt-4 min-h-6 border border-ice/30 bg-ice/5 p-3 text-sm text-ice empty:hidden"
                                        role="status"
                                        aria-live="polite"
                                    >
                                        {submittedName &&
                                            `Thanks, ${submittedName}! This demo form does not send or store messages. Please email me directly at ${emailAddress}.`}
                                    </p>
                                    <p className="mono mt-4 text-center text-[9px] text-slate-600">
                                        FRONT-END DEMO — YOUR MESSAGE IS NOT
                                        SENT OR STORED
                                    </p>
                                </form>
                            </div>
                        </div>
                    </section>
                </main>

                <Footer />
            </div>
        </>
    );
}

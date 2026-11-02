import { Link, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';

const fieldClass =
    'mt-1 block w-full border border-white/15 bg-[#090914] px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#78e5ff] focus:outline-none focus:ring-1 focus:ring-[#78e5ff]';

function FieldError({ message }) {
    return message ? (
        <p className="mt-1 text-sm text-rose-300" role="alert">
            {message}
        </p>
    ) : null;
}

export default function ProjectForm({
    project = null,
    submitLabel = 'Save Project',
}) {
    const form = useForm({
        title: project?.title ?? '',
        description: project?.description ?? '',
        tech_stack: project?.tech_stack?.length
            ? [...project.tech_stack]
            : [''],
        project_url: project?.project_url ?? '',
        repository_url: project?.repository_url ?? '',
        image: null,
        date_completed: project?.date_completed ?? '',
    });
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        if (!(form.data.image instanceof File)) {
            setImagePreview(null);
            return undefined;
        }

        const previewUrl = URL.createObjectURL(form.data.image);
        setImagePreview(previewUrl);

        return () => URL.revokeObjectURL(previewUrl);
    }, [form.data.image]);

    const updateTechnology = (index, value) => {
        form.setData(
            'tech_stack',
            form.data.tech_stack.map((technology, itemIndex) =>
                itemIndex === index ? value : technology
            )
        );
    };

    const submit = (event) => {
        event.preventDefault();

        if (project) {
            form.transform((data) => ({ ...data, _method: 'put' }));
            form.post(route('admin.projects.update', project.id), {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }

        form.post(route('admin.projects.store'), {
            forceFormData: true,
            preserveScroll: true,
        });
    };

    return (
        <form
            onSubmit={submit}
            className="space-y-6 rounded-xl border border-white/10 bg-[#111126] p-5 sm:p-8"
            encType="multipart/form-data"
            noValidate
        >
            <div>
                <label htmlFor="project-title" className="text-sm font-medium">
                    Project title
                </label>
                <input
                    id="project-title"
                    name="title"
                    value={form.data.title}
                    onChange={(event) =>
                        form.setData('title', event.target.value)
                    }
                    className={fieldClass}
                    autoComplete="off"
                    aria-invalid={Boolean(form.errors.title)}
                    aria-describedby="project-title-error"
                />
                <div id="project-title-error">
                    <FieldError message={form.errors.title} />
                </div>
            </div>

            <div>
                <label
                    htmlFor="project-description"
                    className="text-sm font-medium"
                >
                    Description
                </label>
                <textarea
                    id="project-description"
                    name="description"
                    value={form.data.description}
                    onChange={(event) =>
                        form.setData('description', event.target.value)
                    }
                    className={fieldClass}
                    rows={5}
                    aria-invalid={Boolean(form.errors.description)}
                    aria-describedby="project-description-error"
                />
                <div id="project-description-error">
                    <FieldError message={form.errors.description} />
                </div>
            </div>

            <fieldset>
                <legend className="text-sm font-medium">Technologies</legend>
                <div className="mt-2 space-y-3">
                    {form.data.tech_stack.map((technology, index) => (
                        <div key={index} className="flex items-start gap-2">
                            <div className="min-w-0 flex-1">
                                <label
                                    htmlFor={`project-technology-${index}`}
                                    className="sr-only"
                                >
                                    Technology {index + 1}
                                </label>
                                <input
                                    id={`project-technology-${index}`}
                                    name={`tech_stack[${index}]`}
                                    value={technology}
                                    onChange={(event) =>
                                        updateTechnology(
                                            index,
                                            event.target.value
                                        )
                                    }
                                    className={fieldClass}
                                    placeholder="e.g. Laravel"
                                    aria-invalid={Boolean(
                                        form.errors.tech_stack ||
                                            form.errors[`tech_stack.${index}`]
                                    )}
                                    aria-describedby={`project-technologies-error project-technology-${index}-error`}
                                />
                                <div
                                    id={`project-technology-${index}-error`}
                                >
                                    <FieldError
                                        message={
                                            form.errors[`tech_stack.${index}`]
                                        }
                                    />
                                </div>
                            </div>
                            {form.data.tech_stack.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() =>
                                        form.setData(
                                            'tech_stack',
                                            form.data.tech_stack.filter(
                                                (_, itemIndex) =>
                                                    itemIndex !== index
                                            )
                                        )
                                    }
                                    className="mt-1 border border-white/15 px-3 py-2.5 text-sm text-slate-300 hover:border-rose-300 hover:text-rose-200"
                                    aria-label={`Remove technology ${index + 1}`}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                <div id="project-technologies-error">
                    <FieldError message={form.errors.tech_stack} />
                </div>
                <button
                    type="button"
                    onClick={() =>
                        form.setData('tech_stack', [
                            ...form.data.tech_stack,
                            '',
                        ])
                    }
                    className="mt-3 text-sm font-medium text-[#78e5ff] hover:text-white"
                >
                    + Add a technology
                </button>
            </fieldset>

            <div className="grid gap-6 sm:grid-cols-2">
                <div>
                    <label htmlFor="project-url" className="text-sm font-medium">
                        Project URL{' '}
                        <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                        id="project-url"
                        name="project_url"
                        type="url"
                        value={form.data.project_url}
                        onChange={(event) =>
                            form.setData('project_url', event.target.value)
                        }
                        className={fieldClass}
                        placeholder="https://example.com"
                        aria-invalid={Boolean(form.errors.project_url)}
                        aria-describedby="project-url-error"
                    />
                    <div id="project-url-error">
                        <FieldError message={form.errors.project_url} />
                    </div>
                </div>

                <div>
                    <label
                        htmlFor="repository-url"
                        className="text-sm font-medium"
                    >
                        Repository URL{' '}
                        <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                        id="repository-url"
                        name="repository_url"
                        type="url"
                        value={form.data.repository_url}
                        onChange={(event) =>
                            form.setData('repository_url', event.target.value)
                        }
                        className={fieldClass}
                        placeholder="https://github.com/..."
                        aria-invalid={Boolean(form.errors.repository_url)}
                        aria-describedby="repository-url-error"
                    />
                    <div id="repository-url-error">
                        <FieldError message={form.errors.repository_url} />
                    </div>
                </div>

                <div>
                    <label htmlFor="project-image" className="text-sm font-medium">
                        Project image{' '}
                        <span className="text-slate-400">(optional, max 2 MB)</span>
                    </label>
                    <input
                        id="project-image"
                        name="image"
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                        onChange={(event) =>
                            form.setData(
                                'image',
                                event.target.files?.[0] ?? null
                            )
                        }
                        className={`${fieldClass} file:mr-3 file:border-0 file:bg-violet-500 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-white`}
                        aria-invalid={Boolean(form.errors.image)}
                        aria-describedby="project-image-error"
                    />
                    <div id="project-image-error">
                        <FieldError message={form.errors.image} />
                    </div>

                    {(imagePreview || project?.image_url) && (
                        <img
                            src={imagePreview ?? project.image_url}
                            alt={
                                imagePreview
                                    ? 'Selected project image preview'
                                    : `${project.title} current image`
                            }
                            className="mt-3 h-32 w-48 border border-white/10 object-cover"
                        />
                    )}
                    {project?.image_url && !form.data.image && (
                        <p className="mt-2 text-xs text-slate-400">
                            Leave this field empty to keep the current image.
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="date-completed"
                        className="text-sm font-medium"
                    >
                        Date completed{' '}
                        <span className="text-slate-400">(optional)</span>
                    </label>
                    <input
                        id="date-completed"
                        name="date_completed"
                        type="date"
                        value={form.data.date_completed}
                        onChange={(event) =>
                            form.setData('date_completed', event.target.value)
                        }
                        className={fieldClass}
                        aria-invalid={Boolean(form.errors.date_completed)}
                        aria-describedby="date-completed-error"
                    />
                    <div id="date-completed-error">
                        <FieldError message={form.errors.date_completed} />
                    </div>
                </div>
            </div>

            <div className="flex flex-wrap gap-3 border-t border-white/10 pt-5">
                <button
                    type="submit"
                    disabled={form.processing}
                    className="bg-gradient-to-r from-[#a855f7] to-[#78e5ff] px-5 py-3 font-semibold text-[#090914] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {form.processing ? 'Saving…' : submitLabel}
                </button>
                <Link
                    href={route('admin.projects.index')}
                    className="border border-white/20 px-5 py-3 font-medium text-slate-200 transition hover:border-[#78e5ff] hover:text-[#78e5ff]"
                >
                    Cancel
                </Link>
            </div>
        </form>
    );
}

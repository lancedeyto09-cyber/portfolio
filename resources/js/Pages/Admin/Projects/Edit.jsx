import ProjectForm from '@/Components/Portfolio/ProjectForm';
import PortfolioManagementLayout from '@/Components/Portfolio/PortfolioManagementLayout';
import { Head } from '@inertiajs/react';

export default function Edit({ project }) {
    return (
        <PortfolioManagementLayout
            title="Edit project."
            description="Update the project details shown on your portfolio."
        >
            <Head title={`Edit ${project.title}`} />
            <div className="max-w-3xl">
                <ProjectForm project={project} submitLabel="Update Project" />
            </div>
        </PortfolioManagementLayout>
    );
}

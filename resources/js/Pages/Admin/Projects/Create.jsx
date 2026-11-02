import ProjectForm from '@/Components/Portfolio/ProjectForm';
import PortfolioManagementLayout from '@/Components/Portfolio/PortfolioManagementLayout';
import { Head } from '@inertiajs/react';

export default function Create() {
    return (
        <PortfolioManagementLayout
            title="Add a project."
            description="Add a project to display it on your public portfolio."
        >
            <Head title="Add Project" />
            <div className="max-w-3xl">
                <ProjectForm submitLabel="Save Project" />
            </div>
        </PortfolioManagementLayout>
    );
}

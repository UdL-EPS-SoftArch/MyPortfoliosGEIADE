import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsService } from "@/api/projectApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { Project } from "@/types/project";
import ProjectForm from "./project-form";

export default async function AdminProjectsPage() {
    const service = new ProjectsService(serverAuthProvider);
    let projects: Project[] = [];

    try {
        projects = await service.getProjects();
    } catch (error) {
        console.log(error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col gap-8 py-20 px-16 bg-white dark:bg-black">
                <div className="flex flex-col w-full gap-2">
                    <h1 className="text-2xl font-semibold">Projects Admin</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Temporary admin view to create projects directly and list all existing projects.
                    </p>
                </div>

                <ProjectForm />

                <section className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Existing Projects</h2>
                        <span className="text-sm text-gray-500">{projects.length} projects</span>
                    </div>

                    {projects.length === 0 ? (
                        <Card className="w-full">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No projects found yet. Create the first one from the form above.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3 w-full">
                            {projects.map((project, index) => (
                                <Card key={project.uri ?? index} className="w-full">
                                    <CardHeader>
                                        <CardTitle>{project.name}</CardTitle>
                                        {project.description && (
                                            <CardDescription>{project.description}</CardDescription>
                                        )}
                                    </CardHeader>
                                    <CardContent className="space-y-1 text-sm text-gray-500">
                                        <p>Visibility: {project.visibility ?? "PUBLIC"}</p>
                                        {project.created && (
                                            <p>Created: {new Date(project.created).toLocaleString()}</p>
                                        )}
                                        {project.modified && (
                                            <p>Last Modified: {new Date(project.modified).toLocaleString()}</p>
                                        )}
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

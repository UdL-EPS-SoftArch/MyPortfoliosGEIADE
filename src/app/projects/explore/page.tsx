import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProjectsService } from "@/api/projectApi";
import { PortfolioService } from "@/api/portfolioApi";
import { anonymousAuthProvider } from "@/lib/authProvider";
import { Project, ProjectEntity } from "@/types/project";
import { Portfolio, PortfolioEntity } from "@/types/portfolio";

export default async function ExploreProjectsPage() {
    const projectsService = new ProjectsService(anonymousAuthProvider);
    const portfolioService = new PortfolioService(anonymousAuthProvider);
    let portfolios: Portfolio[] = [];
    let projectGroups: Array<{ portfolio: Portfolio; projects: Project[] }> = [];

    try {
        portfolios = await portfolioService.getPublicPortfolios();
        projectGroups = await Promise.all(
            portfolios.map(async (portfolio) => ({
                portfolio,
                projects: await projectsService.getPublicProjectsByPortfolio(portfolio),
            })),
        );
    } catch (error) {
        console.log(error);
    }

    const plainProjectGroups: Array<{ portfolio: PortfolioEntity; projects: ProjectEntity[] }> = projectGroups.map(
        ({ portfolio, projects }) => ({
            portfolio: toPlainPortfolio(portfolio),
            projects: projects.map(toPlainProject),
        }),
    );
    const totalProjects = plainProjectGroups.reduce((count, group) => count + group.projects.length, 0);

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col gap-8 py-20 px-16 bg-white dark:bg-black">
                <div className="flex flex-col w-full gap-2">
                    <h1 className="text-2xl font-semibold">Explore Projects</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Browse public portfolios and the public projects shared inside them.
                    </p>
                </div>

                <section className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Public Portfolio Projects</h2>
                        <span className="text-sm text-gray-500">{totalProjects} public projects</span>
                    </div>

                    {plainProjectGroups.length === 0 ? (
                        <Card className="w-full">
                            <CardContent className="pt-6 space-y-4">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No public portfolio projects are available right now.
                                </p>
                                <Link href="/projects" className="text-sm text-blue-600 hover:underline">
                                    Open your projects
                                </Link>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-3 w-full">
                            {plainProjectGroups.map(({ portfolio, projects }) => (
                                <Card key={portfolio.uri} className="w-full">
                                    <CardHeader>
                                        <CardTitle>{portfolio.name}</CardTitle>
                                        <CardDescription>
                                            Portfolio visibility: {portfolio.visibility ?? "PUBLIC"}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        {projects.length === 0 ? (
                                            <p className="text-sm text-gray-500">
                                                This public portfolio does not have public projects yet.
                                            </p>
                                        ) : (
                                            projects.map((project, index) => (
                                                <div
                                                    key={project.uri ?? `${portfolio.uri}-${index}`}
                                                    className="rounded-lg border p-4"
                                                >
                                                    <div className="space-y-1">
                                                        <p className="font-medium text-zinc-900 dark:text-zinc-100">
                                                            {project.name}
                                                        </p>
                                                        {project.description && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                {project.description}
                                                            </p>
                                                        )}
                                                        <p className="text-sm text-gray-500">
                                                            Visibility: {project.visibility ?? "PUBLIC"}
                                                        </p>
                                                        {project.created && (
                                                            <p className="text-sm text-gray-500">
                                                                Created: {new Date(project.created).toLocaleString()}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
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

function toPlainPortfolio(portfolio: Portfolio): PortfolioEntity {
    return {
        uri: portfolio.uri,
        name: portfolio.name,
        description: portfolio.description,
        visibility: portfolio.visibility,
        created: portfolio.created,
        modified: portfolio.modified,
    };
}

function toPlainProject(project: Project): ProjectEntity {
    return {
        uri: project.uri,
        name: project.name,
        description: project.description,
        visibility: project.visibility,
        created: project.created,
        modified: project.modified,
        portfolio: project.portfolio,
    };
}

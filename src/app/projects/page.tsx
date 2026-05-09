import Link from "next/link";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { ProjectsService } from "@/api/projectApi";
import { PortfolioService } from "@/api/portfolioApi";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { Project, ProjectEntity } from "@/types/project";
import { Portfolio, PortfolioEntity } from "@/types/portfolio";
import ProjectForm from "../admin/projects/project-form";
import ProjectGroupsManager from "./project-groups-manager";

export default async function ProjectsPage() {
    const projectsService = new ProjectsService(serverAuthProvider);
    const portfolioService = new PortfolioService(serverAuthProvider);
    const usersService = new UsersService(serverAuthProvider);
    const currentUser = await usersService.getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    let portfolios: Portfolio[] = [];
    let projectGroups: Array<{ portfolio: Portfolio; projects: Project[] }> = [];

    try {
        portfolios = await portfolioService.getPortfoliosByOwner(currentUser);
        projectGroups = await Promise.all(
            portfolios.map(async (portfolio) => ({
                portfolio,
                projects: await projectsService.getProjectsByPortfolio(portfolio),
            })),
        );
    } catch (error) {
        console.log(error);
    }

    const plainPortfolios: PortfolioEntity[] = portfolios.map(toPlainPortfolio);
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
                    <h1 className="text-2xl font-semibold">Projects</h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Create projects inside your portfolios and review the projects currently linked to each portfolio.
                    </p>
                    <Link href="/projects/explore" className="text-sm text-blue-600 hover:underline">
                        Explore public projects
                    </Link>
                </div>

                <ProjectForm isAuthenticated={true} portfolios={plainPortfolios} />

                <section className="space-y-4 w-full">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Your Portfolio Projects</h2>
                        <span className="text-sm text-gray-500">{totalProjects} projects</span>
                    </div>

                    {plainPortfolios.length === 0 ? (
                        <Card className="w-full">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    No portfolios found for your account yet, so projects cannot be created here.
                                </p>
                            </CardContent>
                        </Card>
                    ) : totalProjects === 0 ? (
                        <Card className="w-full">
                            <CardContent className="pt-6">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Your portfolios are ready, but none of them has projects yet.
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <ProjectGroupsManager projectGroups={plainProjectGroups} />
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

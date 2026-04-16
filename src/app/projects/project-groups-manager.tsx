"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ProjectsService } from "@/api/projectApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { ProjectEntity, Visibility } from "@/types/project";
import { PortfolioEntity } from "@/types/portfolio";

type ProjectGroup = {
    portfolio: PortfolioEntity;
    projects: ProjectEntity[];
};

type EditState = {
    id: string;
    name: string;
    description: string;
    visibility: Visibility;
};

type ProjectGroupsManagerProps = {
    projectGroups: ProjectGroup[];
};

const visibilityOptions: Visibility[] = ["PUBLIC", "PRIVATE", "RESTRICTED"];

export default function ProjectGroupsManager({ projectGroups }: ProjectGroupsManagerProps) {
    const router = useRouter();
    const projectsService = new ProjectsService(clientAuthProvider());
    const [editing, setEditing] = useState<EditState | null>(null);
    const [pendingId, setPendingId] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    async function handleDelete(project: ProjectEntity) {
        if (!project.uri) {
            setErrorMessage("Project URI is missing.");
            return;
        }

        const id = project.uri.split("/").filter(Boolean).pop();
        if (!id) {
            setErrorMessage("Project id is missing.");
            return;
        }

        setErrorMessage(null);
        setPendingId(id);
        try {
            await projectsService.deleteProject(id);
            router.refresh();
        } catch {
            setErrorMessage("Project could not be deleted.");
        } finally {
            setPendingId(null);
        }
    }

    async function handleSave() {
        if (!editing) return;

        setErrorMessage(null);
        setPendingId(editing.id);
        try {
            await projectsService.updateProject(editing.id, {
                name: editing.name,
                description: editing.description,
                visibility: editing.visibility,
            });
            setEditing(null);
            router.refresh();
        } catch {
            setErrorMessage("Project could not be updated.");
        } finally {
            setPendingId(null);
        }
    }

    return (
        <div className="space-y-3 w-full">
            {errorMessage && (
                <p className="text-sm text-red-600">{errorMessage}</p>
            )}
            {projectGroups.map(({ portfolio, projects }) => (
                <Card key={portfolio.uri} className="w-full">
                    <CardHeader>
                        <CardTitle>{portfolio.name}</CardTitle>
                        <CardDescription>
                            Portfolio visibility: {portfolio.visibility ?? "PRIVATE"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {projects.length === 0 ? (
                            <p className="text-sm text-gray-500">
                                No projects inside this portfolio yet.
                            </p>
                        ) : (
                            projects.map((project, index) => {
                                const projectId = project.uri?.split("/").filter(Boolean).pop() ?? `${index}`;
                                const isEditing = editing?.id === projectId;
                                const isPending = pendingId === projectId;

                                return (
                                    <div
                                        key={project.uri ?? `${portfolio.uri}-${index}`}
                                        className="rounded-lg border p-4"
                                    >
                                        {isEditing && editing ? (
                                            <div className="grid gap-3">
                                                <div>
                                                    <Label htmlFor={`name-${projectId}`}>Name</Label>
                                                    <Input
                                                        id={`name-${projectId}`}
                                                        value={editing.name}
                                                        onChange={(event) => setEditing({ ...editing, name: event.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`description-${projectId}`}>Description</Label>
                                                    <Input
                                                        id={`description-${projectId}`}
                                                        value={editing.description}
                                                        onChange={(event) => setEditing({ ...editing, description: event.target.value })}
                                                    />
                                                </div>
                                                <div>
                                                    <Label htmlFor={`visibility-${projectId}`}>Visibility</Label>
                                                    <select
                                                        id={`visibility-${projectId}`}
                                                        value={editing.visibility}
                                                        onChange={(event) => setEditing({ ...editing, visibility: event.target.value as Visibility })}
                                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                                                    >
                                                        {visibilityOptions.map((visibility) => (
                                                            <option key={visibility} value={visibility}>
                                                                {visibility}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button type="button" onClick={handleSave} disabled={isPending}>
                                                        {isPending ? "Saving..." : "Save"}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setEditing(null)}
                                                        disabled={isPending}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="space-y-3">
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
                                                <div className="flex gap-2">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => setEditing({
                                                            id: projectId,
                                                            name: project.name,
                                                            description: project.description ?? "",
                                                            visibility: project.visibility ?? "PUBLIC",
                                                        })}
                                                        disabled={isPending}
                                                    >
                                                        Edit
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="destructive"
                                                        onClick={() => handleDelete(project)}
                                                        disabled={isPending}
                                                    >
                                                        {isPending ? "Deleting..." : "Delete"}
                                                    </Button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

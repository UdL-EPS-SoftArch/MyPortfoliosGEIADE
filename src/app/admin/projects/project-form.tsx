"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { clientAuthProvider } from "@/lib/authProvider";
import { ProjectsService } from "@/api/projectApi";
import { Project, Visibility } from "@/types/project";
import { PortfolioEntity } from "@/types/portfolio";

type FormValues = {
    name: string;
    description: string;
    visibility: Visibility;
    portfolio: string;
};

const visibilityOptions: Visibility[] = ["PUBLIC", "PRIVATE", "RESTRICTED"];

type ProjectFormProps = {
    isAuthenticated: boolean;
    portfolios: PortfolioEntity[];
};

export default function ProjectForm({ isAuthenticated, portfolios }: ProjectFormProps) {
    const router = useRouter();
    const service = new ProjectsService(clientAuthProvider());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const hasPortfolios = portfolios.length > 0;
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            visibility: "PUBLIC",
            portfolio: portfolios[0]?.uri ?? "",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await service.createProject(data as Project);
            reset({
                name: "",
                description: "",
                visibility: "PUBLIC",
                portfolio: portfolios[0]?.uri ?? "",
            });
            setSuccessMessage("Project created successfully.");
            router.refresh();
        } catch {
            setErrorMessage("Project could not be created. Check the selected portfolio and your session.");
        }
    };

    if (!isAuthenticated) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        You need to log in before creating a project.
                    </p>
                    <Button asChild>
                        <Link href="/login">Go to login</Link>
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!hasPortfolios) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Create Project</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        You need at least one portfolio before creating a project.
                    </p>
                    <p className="text-sm text-gray-500">
                        The portfolio frontend is still pending, so create the portfolio from the backend/API first and then come back here.
                    </p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Create Project</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                    {errorMessage && (
                        <p className="text-sm text-red-600">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="text-sm text-green-600">{successMessage}</p>
                    )}

                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Project name is required" })}
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                        )}
                    </div>

                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            {...register("description")}
                        />
                    </div>

                    <div>
                        <Label htmlFor="visibility">Visibility</Label>
                        <select
                            id="visibility"
                            {...register("visibility", { required: true })}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            {visibilityOptions.map((visibility) => (
                                <option key={visibility} value={visibility}>
                                    {visibility}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="portfolio">Portfolio</Label>
                        <select
                            id="portfolio"
                            {...register("portfolio", { required: "Portfolio is required" })}
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        >
                            {portfolios.map((portfolio) => (
                                <option key={portfolio.uri} value={portfolio.uri}>
                                    {portfolio.name}
                                </option>
                            ))}
                        </select>
                        {errors.portfolio && (
                            <p className="mt-1 text-sm text-red-600">{errors.portfolio.message}</p>
                        )}
                    </div>

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Project"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

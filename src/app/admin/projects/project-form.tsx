"use client";

import React, { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { clientAuthProvider } from "@/lib/authProvider";
import { ProjectsService } from "@/api/projectApi";
import { Project, Visibility } from "@/types/project";

type FormValues = {
    name: string;
    description: string;
    visibility: Visibility;
};

const visibilityOptions: Visibility[] = ["PUBLIC", "PRIVATE", "RESTRICTED"];

export default function ProjectForm() {
    const router = useRouter();
    const service = new ProjectsService(clientAuthProvider());
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: {
            visibility: "PUBLIC",
        },
    });

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setErrorMessage(null);
        setSuccessMessage(null);

        try {
            await service.createProject(data as Project);
            reset({ name: "", description: "", visibility: "PUBLIC" });
            setSuccessMessage("Project created successfully.");
            router.refresh();
        } catch {
            setErrorMessage("Project could not be created. Make sure you are logged in.");
        }
    };

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

                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create Project"}
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}

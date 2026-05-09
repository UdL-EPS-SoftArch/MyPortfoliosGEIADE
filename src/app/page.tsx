"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/app/components/authentication";

function Page({ children }: { children: ReactNode }) {
    return (
        <div className="w-full max-w-5xl mx-auto px-6 py-10">
            {children}
        </div>
    );
}

function DashboardCard({ children, href }: { children: ReactNode; href: string }) {
    return (
        <Link
            href={href}
            className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
        >
            {children}
        </Link>
    );
}

function Badge({ children }: { children: ReactNode }) {
    return (
        <span className="rounded-full bg-zinc-100 px-2 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
            {children}
        </span>
    );
}

export default function Home() {
    const { user } = useAuth();
    const roles = user?.authorities?.map(a => a.authority) ?? [];
    const isAdmin = roles.includes("ROLE_ADMIN");
    const isCreator = roles.includes("ROLE_CREATOR");

    if (!user) {
        return (
            <Page>
                <div className="flex flex-col items-center py-20 text-center">
                    <h1 className="text-4xl font-bold">Welcome</h1>
                    <p className="mt-2 text-zinc-500">
                        Sign in to access your dashboard
                    </p>

                    <div className="mt-8 flex gap-3">
                        <Link
                            className="rounded-lg bg-blue-600 px-5 py-2.5 text-white transition hover:bg-blue-700"
                            href="/login"
                        >
                            Login
                        </Link>

                        <Link
                            className="rounded-lg border border-zinc-300 px-5 py-2.5 dark:border-zinc-700"
                            href="/users/register"
                        >
                            Register
                        </Link>
                    </div>
                </div>
            </Page>
        );
    }

    if (isAdmin) {
        return (
            <Page>
                <div className="flex flex-col gap-10">
                    <div>
                        <h1 className="text-4xl font-bold">Admin Dashboard</h1>
                        <p className="mt-2 text-zinc-500">
                            System administration panel
                        </p>
                        <div className="mt-3">
                            <Badge>ADMIN</Badge>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <DashboardCard href="/creators">
                            <h2 className="font-semibold">Manage Creators</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Suspend or manage creators
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/admins">
                            <h2 className="font-semibold">Admins</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Admin management panel
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/tags">
                            <h2 className="font-semibold">Tags</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Manage content tags
                            </p>
                        </DashboardCard>
                    </div>
                </div>
            </Page>
        );
    }

    if (isCreator) {
        return (
            <Page>
                <div className="flex flex-col gap-10">
                    <div>
                        <h1 className="text-4xl font-bold">Creator Dashboard</h1>
                        <p className="mt-2 text-zinc-500">
                            Manage your content, portfolios, and projects
                        </p>
                        <div className="mt-3">
                            <Badge>CREATOR</Badge>
                        </div>
                    </div>

                    <div className="grid gap-6 sm:grid-cols-2">
                        <DashboardCard href="/creators/content">
                            <h2 className="font-semibold">My Content</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Manage posts
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/projects">
                            <h2 className="font-semibold">Projects</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Create and manage projects inside portfolios
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/portfolios">
                            <h2 className="font-semibold">My Portfolios</h2>
                            <p className="mt-1 text-sm text-zinc-500">
                                Organize your public and private portfolios
                            </p>
                        </DashboardCard>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="flex flex-col gap-10">
                <div>
                    <h1 className="text-4xl font-bold">MyPortfolios Frontend</h1>
                    <p className="mt-2 max-w-2xl text-zinc-500">
                        Manage projects inside portfolios and explore public work.
                    </p>
                </div>

                <div className="grid gap-6 sm:grid-cols-2">
                    <DashboardCard href="/projects">
                        <h2 className="font-semibold">Projects</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Create projects and assign them to portfolios
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/projects/explore">
                        <h2 className="font-semibold">Explore Projects</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Browse public projects grouped by portfolio
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/portfolios">
                        <h2 className="font-semibold">My Portfolios</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Manage your portfolios
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/publicportfolios">
                        <h2 className="font-semibold">Public Portfolios</h2>
                        <p className="mt-1 text-sm text-zinc-500">
                            Discover public portfolios shared by users
                        </p>
                    </DashboardCard>
                </div>
            </div>
        </Page>
    );
}

"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/app/components/authentication";
import {
    ArrowRight,
    BadgeCheck,
    Compass,
    FolderKanban,
    Globe2,
    LayoutDashboard,
    ShieldCheck,
    Sparkles,
    Tags,
    Users,
} from "lucide-react";

function Page({ children }: { children: ReactNode }) {
    return (
        <div className="relative min-h-[calc(100vh-73px)] overflow-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
            <div className="absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_25%_15%,rgba(16,185,129,0.20),transparent_32%),radial-gradient(circle_at_80%_0%,rgba(14,165,233,0.16),transparent_30%)]" />
            <div className="relative mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:py-12">
            {children}
            </div>
        </div>
    );
}

function DashboardCard({
    children,
    href,
    icon: Icon,
}: {
    children: ReactNode;
    href: string;
    icon: typeof FolderKanban;
}) {
    return (
        <Link
            href={href}
            className="group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-200/70 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-emerald-500/40 dark:hover:shadow-black/20"
        >
            <div className="mb-4 flex items-center justify-between gap-3">
                <span className="flex size-11 items-center justify-center rounded-lg bg-slate-100 text-slate-800 transition group-hover:bg-emerald-600 group-hover:text-white dark:bg-slate-800 dark:text-slate-100">
                    <Icon className="size-5" />
                </span>
                <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-300" />
            </div>
            {children}
        </Link>
    );
}

function Badge({ children, tone = "slate" }: { children: ReactNode; tone?: "slate" | "emerald" | "sky" }) {
    const tones = {
        slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
        emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300",
        sky: "bg-sky-100 text-sky-800 dark:bg-sky-500/15 dark:text-sky-300",
    };

    return (
        <span className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>
            {children}
        </span>
    );
}

function Hero({
    eyebrow,
    title,
    description,
    badge,
    badgeTone,
    children,
}: {
    eyebrow: string;
    title: string;
    description: string;
    badge?: string;
    badgeTone?: "slate" | "emerald" | "sky";
    children?: ReactNode;
}) {
    return (
        <section className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-stretch">
            <div className="flex min-h-[320px] flex-col justify-center rounded-lg border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8 dark:border-slate-800 dark:bg-slate-900/80">
                <div className="mb-5 flex flex-wrap items-center gap-3">
                    <Badge tone="emerald">{eyebrow}</Badge>
                    {badge && <Badge tone={badgeTone}>{badge}</Badge>}
                </div>
                <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl dark:text-white">
                    {title}
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
                    {description}
                </p>
                {children}
            </div>

            <aside className="rounded-lg border border-slate-200 bg-slate-950 p-6 text-white shadow-sm dark:border-slate-800">
                <div className="flex items-center gap-3">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-300">
                        <Sparkles className="size-5" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold">Workspace overview</p>
                    </div>
                </div>
                <div className="mt-8 grid gap-3">
                    {["Portfolios", "Projects", "Public discovery"].map((item, index) => (
                        <div key={item} className="flex items-center justify-between rounded-lg bg-white/8 px-4 py-3">
                            <span className="text-sm text-slate-200">{item}</span>
                            <span className="text-sm font-semibold text-emerald-300">0{index + 1}</span>
                        </div>
                    ))}
                </div>
            </aside>
        </section>
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
                <Hero
                    eyebrow="Portfolio platform"
                    title="Build a sharper home for your projects."
                    description="Create portfolios, group projects, and explore public work from a focused workspace designed for students, creators, and reviewers."
                >
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            href="/login"
                        >
                            Login <ArrowRight className="size-4" />
                        </Link>

                        <Link
                            className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            href="/users/register"
                        >
                            Register
                        </Link>
                    </div>
                </Hero>
            </Page>
        );
    }

    if (isAdmin) {
        return (
            <Page>
                <div className="flex flex-col gap-8">
                    <Hero
                        eyebrow="Administration"
                        title="Control panel for the whole platform."
                        description="Review creators, organize taxonomy, and keep the portfolio ecosystem clean from one composed dashboard."
                        badge="ADMIN"
                        badgeTone="sky"
                    />

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <DashboardCard href="/creators" icon={Users}>
                            <h2 className="text-lg font-semibold">Manage Creators</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Suspend, review, or manage creator accounts.
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/admins" icon={ShieldCheck}>
                            <h2 className="text-lg font-semibold">Admins</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Access the admin management panel.
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/tags" icon={Tags}>
                            <h2 className="text-lg font-semibold">Tags</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Maintain categories used across content.
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
                <div className="flex flex-col gap-8">
                    <Hero
                        eyebrow="Creator workspace"
                        title="Shape your content into portfolios."
                        description="Manage your portfolios and projects easily."
                        badge="CREATOR"
                        badgeTone="emerald"
                    />

                    <div className="grid gap-4 sm:grid-cols-2">
                        <DashboardCard href="/projects" icon={FolderKanban}>
                            <h2 className="text-lg font-semibold">Projects</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Create and manage projects inside portfolios.
                            </p>
                        </DashboardCard>

                        <DashboardCard href="/portfolios" icon={LayoutDashboard}>
                            <h2 className="text-lg font-semibold">My Portfolios</h2>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                                Organize your public and private portfolio spaces.
                            </p>
                        </DashboardCard>
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="flex flex-col gap-8">
                <Hero
                    eyebrow="Dashboard"
                    title="A cleaner launchpad for portfolios and project discovery."
                    description="Move between your projects, portfolio collections, and public exploration without digging through menus."
                    badge={user.username ?? "Signed in"}
                    badgeTone="slate"
                >
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            className="inline-flex h-11 items-center gap-2 rounded-md bg-emerald-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                            href="/projects"
                        >
                            Open projects <ArrowRight className="size-4" />
                        </Link>
                        <Link
                            className="inline-flex h-11 items-center rounded-md border border-slate-300 bg-white px-5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                            href="/projects/explore"
                        >
                            Explore work
                        </Link>
                    </div>
                </Hero>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <DashboardCard href="/projects" icon={FolderKanban}>
                        <h2 className="text-lg font-semibold">Projects</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Create projects and assign them to portfolios.
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/projects/explore" icon={Compass}>
                        <h2 className="text-lg font-semibold">Explore Projects</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Browse public projects grouped by portfolio.
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/portfolios" icon={LayoutDashboard}>
                        <h2 className="text-lg font-semibold">My Portfolios</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Manage your portfolio structure.
                        </p>
                    </DashboardCard>

                    <DashboardCard href="/publicportfolios" icon={Globe2}>
                        <h2 className="text-lg font-semibold">Public Portfolios</h2>
                        <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">
                            Discover portfolios shared by users.
                        </p>
                    </DashboardCard>
                </div>

                <section className="grid gap-4 lg:grid-cols-3">
                    {[
                        ["Focused", "Primary actions are visible immediately."],
                        ["Role-aware", "The dashboard adapts for admins, creators, and users."],
                        ["Discoverable", "Public exploration has equal visual weight."],
                    ].map(([title, text]) => (
                        <div key={title} className="rounded-lg border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-slate-900">
                            <BadgeCheck className="mb-3 size-5 text-emerald-600 dark:text-emerald-300" />
                            <h3 className="font-semibold">{title}</h3>
                            <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">{text}</p>
                        </div>
                    ))}
                </section>
            </div>
        </Page>
    );
}

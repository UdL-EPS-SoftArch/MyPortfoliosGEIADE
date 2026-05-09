"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";
import { BriefcaseBusiness } from "lucide-react";

export default function Navbar() {
    const pathname = usePathname();
    const { user } = useAuth();

    const navLinks = [
        { href: "/", label: "Home" },
        { href: "/projects", label: "Projects", roles: ["ROLE_USER", "ROLE_CREATOR"] },
        { href: "/projects/explore", label: "Explore Projects" },
        { href: "/publicportfolios", label: "Public Portfolios" },
        { href: "/portfolios", label: "My Portfolios", roles: ["ROLE_USER", "ROLE_CREATOR"] },
        { href: "/users", label: "Users", roles: ["ROLE_USER", "ROLE_ADMIN"] },
        { href: "/tags", label: "Tags", roles: ["ROLE_USER", "ROLE_ADMIN"] },
        { href: "/admins", label: "Admins", roles: ["ROLE_ADMIN"] },
        { href: "/creators", label: "Manage creators", roles: ["ROLE_ADMIN"] },
    ];

    return (
        <nav className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 shadow-sm backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-3 sm:px-6 lg:flex-row lg:items-center">
                <Link href="/" className="flex w-fit items-center gap-3 font-bold text-slate-950 dark:text-white">
                    <span className="flex size-10 items-center justify-center rounded-lg bg-emerald-600 text-white shadow-sm shadow-emerald-900/20">
                        <BriefcaseBusiness className="size-5" />
                    </span>
                    <span className="text-base leading-tight">MyPortfolios</span>
                </Link>

                <div className="flex flex-1 gap-2 overflow-x-auto pb-1 lg:justify-center lg:pb-0">
                    {navLinks
                        .filter(({ roles }) =>
                            !roles || user?.authorities?.some(
                                userAuth => roles.includes(userAuth.authority)))
                        .map(({ href, label }) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={
                                        active
                                            ? "rounded-md bg-slate-950 px-3 py-2 text-sm font-semibold text-white shadow-sm dark:bg-white dark:text-slate-950"
                                            : "rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 dark:hover:text-white"
                                    }
                                >
                                    {label}
                                </Link>
                            );
                        })}
                </div>

                <div className="lg:ml-auto">
                    <Loginbar />
                </div>
            </div>
        </nav>
    );
}

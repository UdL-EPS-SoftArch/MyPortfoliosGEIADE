"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clientAuthProvider } from "@/lib/authProvider";
import { UsersService } from "@/api/userApi";
import { deleteCookie } from "cookies-next";
import { useAuth } from "@/app/components/authentication";
import { Avatar } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { LogOut } from "lucide-react";

export default function Loginbar() {
    const router = useRouter();
    const { user, setUser } = useAuth();

    function logout() {
        deleteCookie("MYCOFFEE_AUTH");
        localStorage.removeItem("MYCOFFEE_AUTH");
        setUser(null);
        router.push("/");
    }

    useEffect(() => {
        let mounted = true;

        async function load() {
            try {
                const service = new UsersService(clientAuthProvider());
                const currentUser = await service.getCurrentUser();

                if (mounted) {
                    setUser(currentUser ?? null);
                }
            } catch {
                if (mounted) setUser(null);
            }
        }

        void load();

        return () => {
            mounted = false;
        };
    }, [setUser]);

    const roles = user?.authorities?.map(a => a.authority) ?? [];
    const isCreator = roles.includes("ROLE_CREATOR");
    const isAdmin = roles.includes("ROLE_ADMIN");

    if (!user) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    href="/login"
                    className="inline-flex h-9 items-center rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
                >
                    Login
                </Link>

                <Link
                    href="/users/register"
                    className="inline-flex h-9 items-center rounded-md border border-slate-300 px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"
                >
                    Register
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
                <Avatar className="flex items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
                    <FontAwesomeIcon icon={faUser} className="h-4 w-4" />
                </Avatar>

                {isAdmin ? (
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {user.username ?? "Admin"}
                    </span>
                ) : (
                    <Link
                        href={`/profile`}
                        className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800 dark:text-emerald-300"
                    >
                        {user.username ?? "User"}
                    </Link>
                )}

                {isCreator && (
                    <span className="ml-1 rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
                        CREATOR
                    </span>
                )}
            </div>

            <button
                onClick={logout}
                className="inline-flex h-9 items-center gap-2 rounded-md bg-slate-950 px-4 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
                <LogOut className="size-4" />
                Logout
            </button>
        </div>
    );
}

"use client";

import { Admin } from "@/types/admin";
import { ShieldCheck, UserRound } from "lucide-react";

interface Props {
    admin: Admin;
}

// AdminCard és més simple que CreatorCard perquè els admins
// no tenen acció de suspendre des d'aquesta pantalla.
export default function AdminCard({ admin }: Props) {
    return (
        <li
            className="
                w-full rounded-xl border bg-white dark:bg-black
                shadow-sm hover:shadow-md transition
                p-5 flex items-center gap-4
            "
        >
            {/* Avatar */}
            <div className="h-10 w-10 rounded-full flex items-center justify-center bg-blue-100 text-blue-600">
                <UserRound size={18} />
            </div>

            {/* Info */}
            <div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900 dark:text-white">
                        {admin.username}
                    </span>
                    {/* Badge que indica que és admin */}
                    <span className="flex items-center gap-1 text-blue-600 text-xs font-medium">
                        <ShieldCheck size={14} />
                        Admin
                    </span>
                </div>
                <div className="text-sm text-gray-500">
                    {admin.email ?? "—"}
                </div>
            </div>
        </li>
    );
}
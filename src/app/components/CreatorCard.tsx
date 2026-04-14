"use client";

import { Creator } from "@/types/creator";
import { BadgeCheck, Ban, UserRound, ShieldOff } from "lucide-react";

interface Props {
    creator: Creator;
    onSuspend?: (username: string) => void;
    isLoading?: boolean;
}

export default function CreatorCard({
    creator,
    onSuspend,
    isLoading = false,
}: Props) {
    const isActive = creator.enabled;

    return (
        <li
            className="
                w-full rounded-xl border bg-white dark:bg-black
                shadow-sm hover:shadow-md transition
                p-5 flex items-center justify-between
            "
        >
            <div className="flex items-center gap-4">
                <div
                    className={`
                        h-10 w-10 rounded-full flex items-center justify-center
                        ${isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
                    `}
                >
                    <UserRound size={18} />
                </div>

                {/* INFO */}
                <div>
                    <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 dark:text-white">
                            {creator.username}
                        </span>

                        {isActive ? (
                            <span className="flex items-center gap-1 text-green-600 text-xs font-medium">
                                <BadgeCheck size={14} />
                                Active
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-red-500 text-xs font-medium">
                                <ShieldOff size={14} />
                                Suspended
                            </span>
                        )}
                    </div>

                    <div className="text-sm text-gray-500">
                        {creator.email}
                    </div>
                </div>
            </div>

            {isActive ? (
                <button
                    disabled={isLoading}
                    onClick={() => onSuspend?.(creator.username)}
                    className="
                        flex items-center gap-2
                        bg-red-500 hover:bg-red-600
                        text-white px-4 py-2 rounded-lg
                        text-sm font-medium
                        transition disabled:opacity-50
                    "
                >
                    <Ban size={16} />
                    Suspend
                </button>
            ) : (
                <div
                    className="
                        flex items-center gap-2
                        px-3 py-2 rounded-lg
                        bg-gray-100 dark:bg-gray-900
                        text-gray-500 text-sm
                        border
                    "
                >
                    <ShieldOff size={16} />
                    Suspended
                </div>
            )}
        </li>
    );
}
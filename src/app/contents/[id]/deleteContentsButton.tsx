"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentService } from "@/api/contentApi";
import { clientAuthProvider } from "@/lib/authProvider";

export default function DeleteContentButton({ id }: { id: string }) {
    const router = useRouter();
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleDelete() {
    setLoading(true);
    try {
        const contentService = new ContentService(clientAuthProvider());
        await contentService.deleteContent(id);
        router.push("/contents");
    } catch (err) {
        console.error(err);
        setLoading(false);
        setConfirming(false);
    }
}

    if (confirming) {
        return (
            <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Are you sure?</span>
                <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="rounded-full bg-red-600 px-4 py-1.5 text-sm text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
                >
                    {loading ? "Deleting..." : "Yes, delete"}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={loading}
                    className="rounded-full bg-zinc-200 dark:bg-zinc-700 px-4 py-1.5 text-sm text-zinc-700 dark:text-zinc-200 font-medium hover:bg-zinc-300 transition"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            className="rounded-full border border-red-300 dark:border-red-800 px-5 py-2 text-sm text-red-600 dark:text-red-400 font-medium hover:bg-red-50 dark:hover:bg-red-950 transition"
        >
            🗑 Delete content
        </button>
    );
}

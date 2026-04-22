"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ContentService } from "@/api/contentApi";
import { clientAuthProvider } from "@/lib/authProvider";

export default function CreateContentPage() {
    const router = useRouter();
    const contentService = new ContentService(clientAuthProvider());

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [body, setBody] = useState("");
    const [visibility, setVisibility] = useState<"PUBLIC" | "PRIVATE">("PUBLIC");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const payload: any = {
                name,
                description,
                body,
                visibility,
            };

            await contentService.createContent(payload as any).catch(() => {});

            router.push("/contents");
        } catch (err: any) {
            console.error("ERROR REAL:", err);

            if (err?.message?.includes("409")) {
                setError("A content with this name already exists.");
            } else {
                setError("Error creating content.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">
                    Create Content
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Description
                        </label>
                        <input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Body
                        </label>
                        <textarea
                            value={body}
                            onChange={(e) => setBody(e.target.value)}
                            required
                            rows={6}
                            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Visibility
                        </label>
                        <select
                            value={visibility}
                            onChange={(e) =>
                                setVisibility(e.target.value as "PUBLIC" | "PRIVATE")
                            }
                            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                        >
                            <option value="PUBLIC">PUBLIC</option>
                            <option value="PRIVATE">PRIVATE</option>
                        </select>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-blue-600 py-3 text-white font-medium hover:bg-blue-700 transition disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Content"}
                    </button>
                </form>
            </main>
        </div>
    );
}

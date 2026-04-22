"use client";

import { useState } from "react";
import Link from "next/link";
import { FlatContent } from "@/types/content";

export default function ContentsList({ contents }: { contents: FlatContent[] }) {
    const [query, setQuery] = useState("");

    const filtered = contents.filter((c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.description?.toLowerCase().includes(query.toLowerCase()) ||
        c.body?.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="w-full">

            {/* SEARCH BAR */}
            <input
                type="text"
                placeholder="Search contents..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 dark:border-zinc-700 px-4 py-3 mb-8 bg-zinc-100 dark:bg-zinc-900 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            {/* LISTADO */}
            <div className="space-y-4">
                {filtered.map((content) => {
                    const id = content.uri.split("/").pop();

                    return (
                        <Link
                            key={content.uri}
                            href={`/contents/${id}`}
                            className="block rounded-xl border border-zinc-200 dark:border-zinc-800 p-5 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition"
                        >
                            <h2 className="text-xl font-semibold text-black dark:text-zinc-50">
                                {content.name}
                            </h2>

                            {content.description && (
                                <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                                    {content.description}
                                </p>
                            )}

                            <p className="text-blue-600 dark:text-blue-400 mt-3 font-medium">
                                View details →
                            </p>
                        </Link>
                    );
                })}

                {filtered.length === 0 && (
                    <p className="text-zinc-500 dark:text-zinc-400 text-center mt-10">
                        No contents found.
                    </p>
                )}
            </div>
        </div>
    );
}


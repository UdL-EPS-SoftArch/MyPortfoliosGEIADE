"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReportService } from "@/api/reportApi";
import { clientAuthProvider } from "@/lib/authProvider";

export default function ReportForm({ id }: { id: string }) {
    const router = useRouter();
    const reportService = new ReportService(clientAuthProvider());

    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!id) {
            setError("Content ID is missing.");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const payload = {
                reason,
                createdAt: new Date().toISOString(),
                content: `/contents/${id}`,
            };

            await reportService.createReport(payload as any);

            router.push(`/contents/${id}`);
        } catch (err: any) {
            console.error(err);

            if (err?.message?.includes("400")) {
                setError("Reason cannot be empty.");
            } else if (err?.message?.includes("409")) {
                setError("You already reported this content.");
            } else {
                setError("Error creating report.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
            <main className="w-full max-w-2xl bg-white dark:bg-zinc-900 p-10 rounded-xl shadow-lg">
                <h1 className="text-3xl font-bold mb-8 text-black dark:text-zinc-50">
                    Report Content
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Reason
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            required
                            rows={4}
                            className="mt-1 w-full rounded-lg border border-zinc-300 dark:border-zinc-700 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 text-black dark:text-zinc-50"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-full bg-red-600 py-3 text-white font-medium hover:bg-red-700 transition disabled:opacity-50"
                    >
                        {loading ? "Reporting..." : "Submit Report"}
                    </button>
                </form>
            </main>
        </div>
    );
}
"use client";

import { useState } from "react";
import type { FlatReport } from "@/types/report";

export default function ReportList({ reports }: { reports: FlatReport[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-3">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400 hover:text-red-600 dark:hover:text-red-400 transition"
            >
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 font-bold text-xs">
                    {reports.length}
                </span>
                <span>
                    report{reports.length !== 1 ? "s" : ""} {open ? "▲" : "▼"}
                </span>
            </button>

            {open && (
                <div className="rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    {reports.length === 0 ? (
                        <p className="p-4 text-sm text-zinc-400">No reports yet.</p>
                    ) : (
                        reports.map((report, i) => (
                            <div
                                key={report.reportId ?? i}
                                className="flex flex-col gap-1 px-5 py-4 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900"
                            >
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                    {report.reason}
                                </p>
                                <p className="text-xs text-zinc-400">
                                    {new Date(report.createdAt).toLocaleString()}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
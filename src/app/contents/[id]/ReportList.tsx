"use client";

import { useState } from "react";
import type { FlatReport } from "@/types/report";

export default function ReportList({ reports }: { reports: FlatReport[] }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-2">
            <p className="text-sm text-gray-500">
                Este content tiene{" "}
                <button
                    onClick={() => setOpen(!open)}
                    className="text-red-600 font-semibold hover:underline"
                >
                    {reports.length} report{reports.length !== 1 ? "s" : ""}
                </button>
            </p>

            {open && (
                <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg divide-y divide-zinc-100 dark:divide-zinc-800">
                    {reports.length === 0 ? (
                        <p className="p-4 text-sm text-gray-400">No reports yet.</p>
                    ) : (
                        reports.map((report, i) => (
                            <div key={report.reportId ?? i} className="p-4 space-y-1">
                                <p className="text-sm font-medium text-zinc-800 dark:text-zinc-100">
                                    {report.reason}
                                </p>
                                <p className="text-xs text-gray-400">
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
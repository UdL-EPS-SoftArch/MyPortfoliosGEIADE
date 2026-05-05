import Link from "next/link";
import { serverAuthProvider } from "@/lib/authProvider";
import { ContentService } from "@/api/contentApi";
import { ReportService } from "@/api/reportApi";
import ReportList from "./ReportList";
import type { FlatReport } from "@/types/report";

export default async function ContentPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;

    const contentService = new ContentService(serverAuthProvider);
    const reportService = new ReportService(serverAuthProvider);

    const content = await contentService.getContentById(id);
    const reports = await reportService.getReportsByContent(id);

    const flatReports: FlatReport[] = reports.map((r) => ({
        uri: r.uri ?? "",
        reportId: r.reportId ?? "",
        reason: r.reason,
        createdAt: r.createdAt,
        contentId: id,
    }));

    return (
        <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
            <article className="max-w-3xl mx-auto space-y-8">

                {/* HEADER */}
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        {content.visibility && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                                content.visibility === "PUBLIC"
                                    ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                                    : "bg-zinc-200 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-300"
                            }`}>
                                {content.visibility}
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 leading-tight">
                        {content.name}
                    </h1>
                    {content.description && (
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">
                            {content.description}
                        </p>
                    )}
                </div>

                {/* DIVIDER */}
                <hr className="border-zinc-200 dark:border-zinc-800" />

                {/* BODY */}
                <div className="prose prose-zinc dark:prose-invert max-w-none">
                    <p className="text-zinc-700 dark:text-zinc-300 whitespace-pre-line leading-relaxed text-base">
                        {content.body}
                    </p>
                </div>

                {/* DIVIDER */}
                <hr className="border-zinc-200 dark:border-zinc-800" />

                {/* FOOTER: reports + botón */}
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <ReportList reports={flatReports} />
                    <Link
                        href={`/contents/${id}/report`}
                        className="rounded-full bg-red-600 px-5 py-2 text-sm text-white font-medium hover:bg-red-700 transition"
                    >
                        ⚑ Report this content
                    </Link>
                </div>

            </article>
        </div>
    );
}
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
        <div className="p-10 space-y-6">
            <h1 className="text-3xl font-bold">{content.name}</h1>
            <h2 className="text-xl text-gray-600">{content.description}</h2>
            <p className="text-gray-800 whitespace-pre-line leading-relaxed">
                {content.body}
            </p>

            <ReportList reports={flatReports} />

            <Link
                href={`/contents/${id}/report`}
                className="inline-block mt-6 rounded-full bg-red-600 px-5 py-2 text-white font-medium hover:bg-red-700 transition"
            >
                Report this content
            </Link>
        </div>
    );
}
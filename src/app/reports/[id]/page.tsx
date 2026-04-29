import { serverAuthProvider } from "@/lib/authProvider";
import { ReportService } from "@/api/reportApi";
import Link from "next/link";

export default async function ReportDetailPage({ params }: { params: { id: string } }) {
    const reportService = new ReportService(serverAuthProvider);
    const report = await reportService.getReportById(params.id);

    const contentId = report.content.split("/").pop();

    return (
        <div className="p-10 space-y-6">
            <h1 className="text-3xl font-bold">Report #{params.id}</h1>

            <p><strong>Reason:</strong> {report.reason}</p>
            <p><strong>Created at:</strong> {report.createdAt}</p>

            <Link
                href={`/contents/${contentId}`}
                className="text-blue-600 hover:underline"
            >
                View reported content
            </Link>
        </div>
    );
}

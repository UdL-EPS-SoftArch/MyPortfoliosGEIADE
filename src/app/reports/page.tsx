import { serverAuthProvider } from "@/lib/authProvider";
import { ReportService } from "@/api/reportApi";
import Link from "next/link";

export default async function ReportsPage() {
    const reportService = new ReportService(serverAuthProvider);
    const reports = await reportService.getReports();

    return (
        <div className="p-10 space-y-6">
            <h1 className="text-3xl font-bold">Reports</h1>

            <ul className="space-y-4">
                {reports.map((r) => {
                    const selfHref = r.link("self")?.href ?? "";
                    const id = selfHref.split("/").pop() ?? "";

                    return (
                        <li key={id} className="border p-4 rounded-lg">
                            <p className="font-medium">{r.reason}</p>
                            <p className="text-sm text-gray-500">{r.createdAt}</p>

                            <Link
                                href={`/reports/${id}`}
                                className="text-blue-600 hover:underline"
                            >
                                View details
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

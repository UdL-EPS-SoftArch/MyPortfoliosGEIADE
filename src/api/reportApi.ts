import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Report } from "@/types/report";

export class ReportService {
    constructor(private authProvider: AuthProvider) {}

    async getReports(): Promise<Report[]> {
        const resource = await getHal("/reports", this.authProvider);
        const embedded = resource.embeddedArray("reports") || [];
        return mergeHalArray<Report>(embedded);
    }

    async getReportById(id: string): Promise<Report> {
        const resource = await getHal(`/reports/${id}`, this.authProvider);
        return mergeHal<Report>(resource);
    }

    async createReport(report: Report): Promise<Report> {
        const resource = await postHal("/reports", report, this.authProvider);
        return mergeHal<Report>(resource);
    }

    async getReportsByContent(contentId: string): Promise<Report[]> {
        const resource = await getHal(
            `/reports/search/findByContent_ContentId?contentId=${contentId}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("reports") || [];
        return mergeHalArray<Report>(embedded);
    }
}

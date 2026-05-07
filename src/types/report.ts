import { Resource } from "halfred";

export interface ReportEntity {
    uri?: string;
    reportId?: string;
    reason: string;
    createdAt: string;
    content: string; // URI of the content being reported
}

export type Report = ReportEntity & Resource;

export interface FlatReport {
    uri: string;
    reportId: string;
    reason: string;
    createdAt: string;
    contentId: string;
}

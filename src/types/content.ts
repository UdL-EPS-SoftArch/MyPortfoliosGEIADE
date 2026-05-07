import { Resource } from "halfred";

export interface ContentEntity {
    uri: string;
    contentId: string;
    name: string;
    description?: string;
    body: string;
    visibility?: "PUBLIC" | "PRIVATE";
}

export type Content = ContentEntity & Resource;

export interface FlatContent {
    uri: string;
    contentId: string;
    name: string;
    description?: string;
    body: string;
    visibility?: "PUBLIC" | "PRIVATE";
}
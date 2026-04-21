import { Resource } from "halfred";

export interface ContentEntity {
    uri: string;
    contentId: string;
    name: string;
    description?: string;
}

export type Content = ContentEntity & Resource;

import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "RESTRICTED";

export interface ProjectEntity {
    uri?: string;
    name: string;
    description?: string;
    created?: Date;
    modified?: Date;
    visibility?: Visibility;
}

export type Project = ProjectEntity & Resource;

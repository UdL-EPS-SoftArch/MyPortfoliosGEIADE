import { Resource } from "halfred";

export interface TagEntity {
    id?: number;
    uri?: string;
    name: string;
    description?: string;
    created?: Date;
    modified?: Date;
}

export type Tag = TagEntity & Resource;

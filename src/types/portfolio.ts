import { Resource } from "halfred";

export enum PortfolioVisibility {
    PUBLIC = "PUBLIC",
    PRIVATE = "PRIVATE",
    // añade más si existen en tu backend
}

export interface PortfolioEntity {
    uri: string;
    name: string;
    description?: string;
    created?: Date;
    modified?: Date;
    visibility?: PortfolioVisibility;
}

export type Portfolio = PortfolioEntity & Resource;
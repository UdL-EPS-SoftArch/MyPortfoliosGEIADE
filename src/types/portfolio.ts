import { Resource } from "halfred";

export type PortfolioVisibility = "PUBLIC" | "PRIVATE" | "RESTRICTED";

export interface PortfolioEntity {
    uri?: string;
    name: string;
    description?: string;
    visibility?: PortfolioVisibility;
    ownerName?: string;
    created?: Date;
    modified?: Date;
}

export type Portfolio = PortfolioEntity & Resource;

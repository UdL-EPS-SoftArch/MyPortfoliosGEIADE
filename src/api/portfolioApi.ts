import { deleteHal, getHal, mergeHal, mergeHalArray, putHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { User } from "@/types/user";
import type { Portfolio, PortfolioVisibility } from "@/types/portfolio";
import type { Resource } from "halfred";

export class PortfolioService {
    constructor(private authProvider: AuthProvider) {
    }

    async getPortfolios(): Promise<Portfolio[]> {
        const resource = await getHal("/portfolios", this.authProvider);
        const embedded = resource.embeddedArray("portfolios") || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async getPortfoliosByOwner(owner: User): Promise<Portfolio[]> {
        const resource = await getHal(
            `/portfolios/search/findByOwner?owner=${encodeURIComponent(owner.uri ?? "")}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("portfolios") || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async getPublicPortfolios(): Promise<Portfolio[]> {
        const resource = await getHal("/portfolios/search/findByVisibility?visibility=PUBLIC", this.authProvider);
        const embedded = resource.embeddedArray("portfolios") || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async getPortfolioOwner(portfolio: Portfolio): Promise<User> {
        const ownerLink = portfolio.link("owner")?.href;
        if (!ownerLink) {
            throw new Error("Portfolio owner link is missing.");
        }
        const resource = await getHal(ownerLink, this.authProvider);
        return mergeHal<User>(resource);
    }

    async deletePortfolio(portfolio: Portfolio): Promise<void> {
        const href =
            (typeof portfolio.link === "function" ? portfolio.link("self")?.href : undefined)
            || portfolio.uri;

        if (!href) {
            throw new Error("Portfolio without delete link");
        }

        await deleteHal(href, this.authProvider);
    }

    async updatePortfolio(
        portfolio: Portfolio,
        updates: {
            name: string;
            description?: string;
            visibility?: PortfolioVisibility;
            restrictedUsernames?: string[];
            allowedUsers: string[];
        }
    ): Promise<void> {
        const href =
            (typeof portfolio.link === "function" ? portfolio.link("self")?.href : undefined)
            || portfolio.uri;

        if (!href) {
            throw new Error("Portfolio without update link");
        }

        await putHal(href, updates as unknown as Resource, this.authProvider);
    }
}

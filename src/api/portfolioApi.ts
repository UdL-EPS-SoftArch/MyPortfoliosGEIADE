import { getHal, mergeHal, mergeHalArray } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { User } from "@/types/user";
import type { Portfolio } from "@/types/portfolio";

export class PortfolioService {
    constructor(private authProvider: AuthProvider) {
    }

    async getPortfoliosByOwner(owner: User): Promise<Portfolio[]> {
        const resource = await getHal(`/portfolios/search/findByOwner?owner=${encodeURIComponent(owner.uri ?? "")}`, this.authProvider);
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
}

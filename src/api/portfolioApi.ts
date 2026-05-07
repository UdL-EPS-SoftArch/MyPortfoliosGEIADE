import { deleteHal, getHal, mergeHalArray, putHal } from "./halClient";
import { type AuthProvider } from '@/lib/authProvider';
import { Portfolio, PortfolioVisibility } from '@/types/portfolio';
import { User } from '@/types/user';
import { Resource } from "halfred";

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
        `/portfolios/search/findByOwner?owner=${owner.uri}`,
        this.authProvider
    );
    const embedded = resource.embeddedArray("portfolios") || [];
    return mergeHalArray<Portfolio>(embedded);
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

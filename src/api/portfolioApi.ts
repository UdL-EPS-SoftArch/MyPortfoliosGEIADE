import { getHal, mergeHalArray } from "./halClient";
import { type AuthProvider } from '@/lib/authProvider';
import { Portfolio } from '@/types/portfolio';
import { User } from '@/types/user';

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
}

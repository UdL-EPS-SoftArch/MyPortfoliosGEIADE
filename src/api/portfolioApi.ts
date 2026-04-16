import { getHal, mergeHalArray } from "./halClient";
import { type AuthProvider } from '@/lib/authProvider';
import { Portfolio } from '@/types/portfolio';

export class PortfolioService {
  constructor(private authProvider: AuthProvider) {
  }

  async getPortfolios(): Promise<Portfolio[]> {
    const resource = await getHal("/portfolios", this.authProvider);
    const embedded = resource.embeddedArray("portfolios") || [];
    return mergeHalArray<Portfolio>(embedded);
  }
}

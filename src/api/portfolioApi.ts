import { getHal, mergeHalArray } from "./halClient";
import { AuthProvider, clientAuthProvider } from "@/lib/authProvider";

export class PortfolioService {
  private auth = clientAuthProvider;

  async getPortfolios() {
    const resource = await getHal("/portfolios", this.auth);
    const embedded = resource.embeddedArray("portfolios") || [];
    return mergeHalArray<any>(embedded);
  }
}
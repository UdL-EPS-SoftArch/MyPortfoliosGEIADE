import { getHal, mergeHalArray } from "./halClient";
import { clientAuthProvider } from "@/lib/authProvider";

export class PortfolioService {
  private auth = clientAuthProvider();

  async getPortfolios() {
    const resource = await getHal("/portfolios", clientAuthProvider());
    const embedded = resource.embeddedArray("portfolios") || [];
    return mergeHalArray<any>(embedded);
  }
}
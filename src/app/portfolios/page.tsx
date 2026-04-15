"use client";

import { useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";

export default function PortfoliosPage() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const service = new PortfolioService();

    service.getPortfolios()
      .then(setData)
      .catch(console.error);
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Portfolios</h1>

      {data.length === 0 ? (
        <p>No hay portfolios</p>
      ) : (
        data.map((p: any) => (
          <div key={p.id}>
            {p.name}
          </div>
        ))
      )}
    </div>
  );
}
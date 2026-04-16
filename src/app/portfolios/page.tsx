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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Portfolios</h1>

            {data.length === 0 ? (
                <p>No hay portfolios</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((p: any, index: number) => (
                        <div
                            key={p._links?.self?.href || index}
                            className="border rounded-xl p-4 shadow hover:shadow-lg transition"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h2 className="font-bold text-lg">{p.name}</h2>

                                <span
                                    className={`text-xs px-2 py-1 rounded ${p.visibility === "PUBLIC"
                                        ? "bg-green-100 text-green-700"
                                        : "bg-gray-200"
                                        }`}
                                >
                                    {p.visibility}
                                </span>
                            </div>

                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {p.description}
                            </p>

                            <div className="text-xs text-gray-400 flex justify-between">
                                <span>
                                    {p.created && new Date(p.created).toLocaleDateString()}
                                </span>
                                <span>
                                    {p.modified && new Date(p.modified).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio } from "@/types/portfolio";
import { clientAuthProvider } from "@/lib/authProvider";

export default function RestrictedPortfoliosPage() {

    const [data, setData] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [owners, setOwners] = useState<Record<string, string>>({});

    useEffect(() => {

        const service = new PortfolioService(clientAuthProvider());

        const getPortfolioKey = (portfolio: Portfolio) =>
            (typeof portfolio.link === "function" ? portfolio.link("self")?.href : undefined)
            || portfolio.uri
            || portfolio.name;

        const getCurrentUsername = async () => {
            const auth = await clientAuthProvider().getAuth();
            return auth ? atob(auth.replace("Basic ", "")).split(":")[0] : null;
        };

        Promise.all([service.getPortfolios(), clientAuthProvider().getAuth()])
            .then(async ([portfolios, auth]) => {
                const currentUsername = auth ? atob(auth.replace("Basic ", "")).split(":")[0] : null;
                console.log("CURRENT USERNAME:", currentUsername);

                const restrictedPortfolios: Portfolio[] = [];

                for (const p of portfolios) {
                    if (p.visibility !== "RESTRICTED") continue;

                    try {
                        const allowedUsersLink =
                            (typeof p.link === 'function' ? p.link('allowedUsers')?.href : undefined)
                            || (p as any)._links?.allowedUsers?.[0]?.href;
                        if (!allowedUsersLink) continue;

                        const response = await fetch(allowedUsersLink, {
                            headers: {
                                ...(auth ? { Authorization: auth } : {})
                            }
                        });
                        if (!response.ok) {
                            console.warn(`allowedUsers fetch failed for ${p.name}:`, response.status, response.statusText);
                            // skip this portfolio if allowedUsers endpoint fails
                            continue;
                        }

                        const json = await response.json();
                        const creators = json?._embedded?.creators ?? [];
                        const usernames = creators.map((u: any) => u.username).filter(Boolean);
                        console.log({
                            portfolio: p.name,
                            usernames,
                            currentUsername
                        });

                        if (currentUsername && usernames.includes(currentUsername)) {
                            restrictedPortfolios.push(p);
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
                console.log("RESTRICTED PORTFOLIOS:", restrictedPortfolios);

                setData(restrictedPortfolios);

                const ownerEntries = await Promise.all(
                    restrictedPortfolios.map(async (portfolio) => {
                        try {
                            const owner = await service.getPortfolioOwner(portfolio);
                            return [getPortfolioKey(portfolio), owner.username] as const;
                        } catch (err) {
                            console.error("Failed to fetch owner for", portfolio.uri, err);
                            return null;
                        }
                    })
                );

                setOwners(
                    Object.fromEntries(
                        ownerEntries.filter((entry): entry is readonly [string, string] => Boolean(entry))
                    )
                );

            })
            .catch(console.error)
            .finally(() => setLoading(false));

    }, []);

    return (
        <div className="min-h-screen bg-gray-50 p-8">

            <div className="max-w-7xl mx-auto">

                <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            Restricted Portfolios
                        </h1>

                        <p className="text-gray-500 mt-2">
                            Portfolios shared privately with you.
                        </p>
                    </div>

                    <div className="bg-white shadow-sm border rounded-xl px-5 py-3">
                        <span className="text-sm text-gray-500">
                            Total portfolios
                        </span>

                        <p className="text-2xl font-bold text-blue-600">
                            {data.length}
                        </p>
                    </div>

                </div>

                {loading ? (

                    <div className="flex justify-center items-center py-20">
                        <p className="text-lg text-gray-500">
                            Loading portfolios...
                        </p>
                    </div>

                ) : data.length === 0 ? (

                    <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                            No restricted portfolios
                        </h2>

                        <p className="text-gray-500">
                            No restricted portfolios have been shared with you.
                        </p>
                    </div>

                ) : (

                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

                        {data.map((p: Portfolio, index: number) => (

                            <div
                                key={(typeof p.link === "function" ? p.link("self")?.href : undefined) || p.uri || index}
                                className="bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                            >

                                <div className="h-2 bg-gradient-to-r from-amber-500 to-orange-500" />

                                <div className="p-6">

                                    <div className="flex justify-between items-start mb-4">

                                        <div>
                                            <h2 className="text-2xl font-bold text-gray-900 break-words break-all whitespace-normal w-full">
                                                {p.name}
                                            </h2>

                                            <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                                                RESTRICTED
                                            </span>

                                            <p className="text-sm text-gray-500 mt-2">
                                                By {owners[(typeof p.link === "function" ? p.link("self")?.href : undefined) || p.uri || p.name] || "Unknown"}
                                            </p>
                                        </div>

                                    </div>

                                    <p className="text-gray-600 leading-relaxed whitespace-normal break-words min-h-[80px]">
                                        {p.description || "No description available."}
                                    </p>

                                    <div className="mt-6 border-t pt-4 flex justify-between text-sm text-gray-400">

                                        <div>
                                            <p className="font-medium text-gray-500">
                                                Created
                                            </p>

                                            <p>
                                                {p.created
                                                    ? new Date(p.created).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="font-medium text-gray-500">
                                                Updated
                                            </p>

                                            <p>
                                                {p.modified
                                                    ? new Date(p.modified).toLocaleDateString()
                                                    : "-"}
                                            </p>
                                        </div>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </div>
    );
}
"use client";

import { useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio } from '@/types/portfolio';
import { clientAuthProvider } from '@/lib/authProvider';
import { User } from '@/types/user';

export default function PortfoliosPage() {
    const [data, setData] = useState<Portfolio[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [, setLoading] = useState(false);

    useEffect(() => {
        const service = new PortfolioService(clientAuthProvider());

        clientAuthProvider().getAuth().then(auth => {
            if (!auth) return;

            const username = atob(auth.replace("Basic ", "")).split(":")[0];

            service.getPortfoliosByOwner({ uri: `/users/${username}` } as User)
                .then(setData)
                .catch(console.error);
        });

    }, []);

    const handleCreate = async () => {
        try {
            setLoading(true);

            const auth = await clientAuthProvider().getAuth();

            const res = await fetch("http://localhost:8080/portfolios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(auth ? { Authorization: auth } : {})
                },
                body: JSON.stringify({
                    name,
                    description,
                    visibility: "PUBLIC"
                })
            });

            console.log("STATUS:", res.status);

            const text = await res.text();
            console.log("RESPONSE:", text);

                const service = new PortfolioService(clientAuthProvider());
                const auth2 = await clientAuthProvider().getAuth();
                if (auth2) {
                    const username = atob(auth2.replace("Basic ", "")).split(":")[0];
                    const portfolios = await service.getPortfoliosByOwner({ uri: `/users/${username}` } as User);
                    setData(portfolios);
                } else {
                    const portfolios = await service.getPortfolios();
                    setData(portfolios);
                }

            setName("");
            setDescription("");
            setShowForm(false);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    return (
    <div className="min-h-screen bg-gray-50 p-8">

        <div className="max-w-7xl mx-auto">

            <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                <div>
                    <h1 className="text-4xl font-bold text-gray-900">
                        My Portfolios
                    </h1>

                    <p className="text-gray-500 mt-2">
                        Manage your personal portfolios.
                    </p>
                </div>

                <div className="flex gap-4 items-center">

                    <div className="bg-white shadow-sm border rounded-xl px-5 py-3">
                        <span className="text-sm text-gray-500">
                            Total portfolios
                        </span>

                        <p className="text-2xl font-bold text-blue-600">
                            {data.length}
                        </p>
                    </div>

                    <button
                        onClick={() => setShowForm(!showForm)}
                        type="button"
                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-xl font-medium shadow-sm transition cursor-pointer"
                    >
                        Nuevo Portfolio
                    </button>

                </div>

            </div>

            {showForm && (

                <div className="mb-8 bg-white border rounded-2xl p-6 shadow-sm flex flex-col md:flex-row gap-4">

                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border rounded-xl p-3 flex-1"
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border rounded-xl p-3 flex-1"
                    />

                    <button
                        type="button"
                        onClick={handleCreate}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition"
                    >
                        Crear
                    </button>

                </div>

            )}

            {data.length === 0 ? (

                <div className="bg-white border rounded-2xl p-12 text-center shadow-sm">

                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                        No portfolios
                    </h2>

                    <p className="text-gray-500">
                        You have not created any portfolios yet.
                    </p>

                </div>

            ) : (

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">

                    {data.map((p: Portfolio, index: number) => (

                        <div
                            key={index}
                            className="bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
                        >

                            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <div className="p-6">

                                <div className="flex justify-between items-start mb-4">

                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            {p.name}
                                        </h2>

                                        <span
                                            className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                                                p.visibility === "PUBLIC"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-200 text-gray-700"
                                            }`}
                                        >
                                            {p.visibility}
                                        </span>
                                    </div>

                                </div>

                                <p className="text-gray-600 leading-relaxed min-h-[80px]">
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
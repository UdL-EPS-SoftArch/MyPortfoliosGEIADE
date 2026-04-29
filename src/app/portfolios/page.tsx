"use client";

import { useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio } from '@/types/portfolio';
import { clientAuthProvider } from "@/lib/authProvider"; 

export default function PortfoliosPage() {
    const [data, setData] = useState<Portfolio[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const service = new PortfolioService(clientAuthProvider());

        service.getPortfolios()
            .then(setData)
            .catch(console.error);
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
                    visibility: "PUBLIC",
                    owner: "http://localhost:8080/users/demo"
                })
            });

            console.log("STATUS:", res.status);

            const text = await res.text();
            console.log("RESPONSE:", text);

            // 🔥 RECARGAR DATOS
            const service = new PortfolioService(clientAuthProvider());
            const portfolios = await service.getPortfolios();
            setData(portfolios);

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
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Portfolios</h1>
            <button
                onClick={() => setShowForm(!showForm)}
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer"
            >
                Nuevo Portfolio
            </button>
            {showForm && (
                <div className="mt-4 mb-6 p-4 border rounded bg-white relative z-50 flex gap-2">
                    <input
                        type="text"
                        placeholder="Nombre"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border p-2"
                    />

                    <input
                        type="text"
                        placeholder="Descripción"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="border p-2"
                    />

                    <button
                        type="button" // 👈 MUY IMPORTANTE
                        onClick={handleCreate}
                        className="bg-green-500 text-white px-4 py-2 rounded"
                    >
                        Crear
                    </button>
                </div>
            )}
            <div className="mt-6">
                {data.length === 0 ? (
                    <p>No hay portfolios</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.map((p: Portfolio, index: number) => (
                        <div
                            key={index}
                            className="border rounded-xl p-4 shadow hover:shadow-lg transition cursor-pointer"
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
        </div>
    );
}


"use client";

import { useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio } from '@/types/portfolio';
import { clientAuthProvider } from '@/lib/authProvider';
import { User } from '@/types/user';
import { EllipsisVertical, Pencil, Trash2 } from "lucide-react";

export default function PortfoliosPage() {
    const [data, setData] = useState<Portfolio[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [, setLoading] = useState(false);
    const [activeMenuHref, setActiveMenuHref] = useState<string | null>(null);
    const [deletingPortfolioHref, setDeletingPortfolioHref] = useState<string | null>(null);
    const [editingPortfolioHref, setEditingPortfolioHref] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [updatingPortfolioHref, setUpdatingPortfolioHref] = useState<string | null>(null);

    const getPortfolioHref = (portfolio: Portfolio) =>
        (typeof portfolio.link === "function" ? portfolio.link("self")?.href : undefined)
        || portfolio.uri
        || portfolio.name;

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

    const handleDelete = async (portfolio: Portfolio) => {
        const href = getPortfolioHref(portfolio);
        const confirmed = window.confirm(`¿Eliminar el portfolio "${portfolio.name}"?`);

        if (!confirmed) return;

        try {
            setDeletingPortfolioHref(href);
            setActiveMenuHref(null);

            const service = new PortfolioService(clientAuthProvider());
            await service.deletePortfolio(portfolio);

            setData((currentData) =>
                currentData.filter((item) => getPortfolioHref(item) !== href)
            );
        } catch (err) {
            console.error(err);
            window.alert("No se ha podido eliminar el portfolio.");
        } finally {
            setDeletingPortfolioHref(null);
        }
    };

    const handleStartEdit = (portfolio: Portfolio) => {
        setEditingPortfolioHref(getPortfolioHref(portfolio));
        setEditName(portfolio.name);
        setEditDescription(portfolio.description || "");
        setActiveMenuHref(null);
    };

    const handleCancelEdit = () => {
        setEditingPortfolioHref(null);
        setEditName("");
        setEditDescription("");
    };

    const handleUpdate = async (portfolio: Portfolio) => {
        const href = getPortfolioHref(portfolio);

        try {
            setUpdatingPortfolioHref(href);

            const service = new PortfolioService(clientAuthProvider());
            await service.updatePortfolio(portfolio, {
                name: editName,
                description: editDescription,
                visibility: portfolio.visibility,
            });

            setData((currentData) =>
                currentData.map((item) =>
                    getPortfolioHref(item) === href
                        ? Object.assign(item, {
                            name: editName,
                            description: editDescription,
                            modified: new Date(),
                        })
                        : item
                )
            );
            handleCancelEdit();
        } catch (err) {
            console.error(err);
            window.alert("No se ha podido editar el portfolio.");
        } finally {
            setUpdatingPortfolioHref(null);
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

                    {data.map((p: Portfolio, index: number) => {
                        const portfolioHref = getPortfolioHref(p);
                        const isDeleting = deletingPortfolioHref === portfolioHref;
                        const isEditing = editingPortfolioHref === portfolioHref;
                        const isUpdating = updatingPortfolioHref === portfolioHref;

                        return (

                        <div
                            key={portfolioHref || index}
                            className="relative bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >

                            <div className="h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500" />

                            <div className="absolute right-4 top-4 z-10">
                                <button
                                    type="button"
                                    aria-label="Abrir opciones del portfolio"
                                    onClick={() =>
                                        setActiveMenuHref(
                                            activeMenuHref === portfolioHref ? null : portfolioHref
                                        )
                                    }
                                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-gray-200 transition hover:bg-gray-50 hover:text-gray-900"
                                >
                                    <EllipsisVertical size={18} />
                                </button>

                                {activeMenuHref === portfolioHref && (
                                    <div className="absolute right-0 mt-2 w-40 overflow-hidden rounded-xl border bg-white py-1 shadow-lg">
                                        <button
                                            type="button"
                                            onClick={() => handleStartEdit(p)}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-50"
                                        >
                                            <Pencil size={16} />
                                            Editar
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => handleDelete(p)}
                                            disabled={isDeleting}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Trash2 size={16} />
                                            {isDeleting ? "Eliminando..." : "Eliminar"}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="p-6">

                                <div className="flex justify-between items-start mb-4">

                                    <div className="w-full pr-12">
                                        {isEditing ? (
                                            <div className="space-y-3">
                                                <input
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full rounded-xl border p-3 text-gray-900"
                                                />

                                                <input
                                                    type="text"
                                                    value={editDescription}
                                                    onChange={(e) => setEditDescription(e.target.value)}
                                                    className="w-full rounded-xl border p-3 text-gray-900"
                                                />
                                            </div>
                                        ) : (
                                            <>
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
                                            </>
                                        )}
                                    </div>

                                </div>

                                {isEditing ? (
                                    <div className="flex gap-3">
                                        <button
                                            type="button"
                                            onClick={() => handleUpdate(p)}
                                            disabled={isUpdating}
                                            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isUpdating ? "Guardando..." : "Guardar"}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancelEdit}
                                            className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                ) : (
                                    <p className="text-gray-600 leading-relaxed min-h-[80px]">
                                        {p.description || "No description available."}
                                    </p>
                                )}

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

                    );
                    })}

                </div>

            )}

        </div>

    </div>
);
}

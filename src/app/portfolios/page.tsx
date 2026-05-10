"use client";

import { KeyboardEvent, useCallback, useEffect, useState } from "react";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio, PortfolioVisibility } from '@/types/portfolio';
import { clientAuthProvider } from '@/lib/authProvider';
import { User } from '@/types/user';
import { EllipsisVertical, Pencil, Trash2, X } from "lucide-react";

const parseUsernames = (value: string) =>
    value
        .split(/[\s,;]+/)
        .map((username) => username.trim())
        .filter((username, index, usernames) => username && usernames.indexOf(username) === index);

const mergeUsernames = (currentUsernames: string[], newUsernames: string[]) => [
    ...currentUsernames,
    ...newUsernames.filter((username) => !currentUsernames.includes(username)),
];

function RestrictedUsernamesInput({
    usernames,
    onChange,
}: {
    usernames: string[];
    onChange: (usernames: string[]) => void;
}) {
    const [draftUsername, setDraftUsername] = useState("");

    const addDraftUsernames = () => {
        const parsedUsernames = parseUsernames(draftUsername);
        if (parsedUsernames.length === 0) return;

        onChange(mergeUsernames(usernames, parsedUsernames));
        setDraftUsername("");
    };

    const removeUsername = (usernameToRemove: string) => {
        onChange(usernames.filter((username) => username !== usernameToRemove));
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter" || event.key === "," || event.key === ";") {
            event.preventDefault();
            addDraftUsernames();
            return;
        }

        if (event.key === "Backspace" && !draftUsername && usernames.length > 0) {
            onChange(usernames.slice(0, -1));
        }
    };

    return (
        <div className="flex min-h-12 flex-1 flex-wrap items-center gap-2 rounded-xl border bg-white p-2">
            {usernames.map((username) => (
                <span
                    key={username}
                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1 text-sm font-medium text-amber-800"
                >
                    {username}
                    <button
                        type="button"
                        aria-label={`Remove ${username}`}
                        onClick={() => removeUsername(username)}
                        className="rounded-full p-0.5 text-amber-700 transition hover:bg-amber-200"
                    >
                        <X size={14} />
                    </button>
                </span>
            ))}

            <input
                type="text"
                placeholder={usernames.length ? "Add another username" : "user1, user2, user3"}
                value={draftUsername}
                onBlur={addDraftUsernames}
                onChange={(event) => setDraftUsername(event.target.value)}
                onKeyDown={handleKeyDown}
                className="min-w-40 flex-1 border-0 bg-transparent p-1 text-sm text-gray-900 outline-none"
            />
        </div>
    );
}

export default function PortfoliosPage() {
    const [data, setData] = useState<Portfolio[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [visibility, setVisibility] = useState<PortfolioVisibility>("PUBLIC");
    const [restrictedUsernames, setRestrictedUsernames] = useState<string[]>([]);
    const [createError, setCreateError] = useState("");
    const [, setLoading] = useState(false);
    const [sharedPortfolioHrefs, setSharedPortfolioHrefs] = useState<Set<string>>(new Set());
    const [activeMenuHref, setActiveMenuHref] = useState<string | null>(null);
    const [portfolioToDelete, setPortfolioToDelete] = useState<Portfolio | null>(null);
    const [deleteError, setDeleteError] = useState("");
    const [deletingPortfolioHref, setDeletingPortfolioHref] = useState<string | null>(null);
    const [editingPortfolioHref, setEditingPortfolioHref] = useState<string | null>(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editVisibility, setEditVisibility] = useState<PortfolioVisibility>("PUBLIC");
    const [editRestrictedUsernames, setEditRestrictedUsernames] = useState<string[]>([]);
    const [updatingPortfolioHref, setUpdatingPortfolioHref] = useState<string | null>(null);
    const visibilityOptions: PortfolioVisibility[] = ["PUBLIC", "PRIVATE", "RESTRICTED"];

    const getPortfolioHref = useCallback((portfolio: Portfolio) =>
        (typeof portfolio.link === "function" ? portfolio.link("self")?.href : undefined)
        || portfolio.uri
        || portfolio.name, []);

    const getUsernameFromAuth = (auth: string) => atob(auth.replace("Basic ", "")).split(":")[0];

    const loadPortfolios = useCallback(async () => {
        const service = new PortfolioService(clientAuthProvider());
        const auth = await clientAuthProvider().getAuth();
        if (!auth) return;

        const username = getUsernameFromAuth(auth);
        const [ownedPortfolios, allPortfolios] = await Promise.all([
            service.getPortfoliosByOwner({ uri: `/users/${username}` } as User),
            service.getPortfolios(),
        ]);
        const ownedPortfolioHrefs = new Set(ownedPortfolios.map(getPortfolioHref));
        const sharedRestrictedPortfolios = allPortfolios.filter((portfolio) => {
            const href = getPortfolioHref(portfolio);
            return (
                portfolio.visibility === "RESTRICTED"
                && portfolio.restrictedUsernames?.includes(username)
                && !ownedPortfolioHrefs.has(href)
            );
        });

        setSharedPortfolioHrefs(new Set(sharedRestrictedPortfolios.map(getPortfolioHref)));
        setData([...ownedPortfolios, ...sharedRestrictedPortfolios]);
    }, [getPortfolioHref]);

    useEffect(() => {
        loadPortfolios().catch(console.error);

    }, [loadPortfolios]);

    const handleCreate = async () => {
        if (!name.trim() || !description.trim()) {
            setCreateError("Name and description are required.");
            return;
        }

        if (visibility === "RESTRICTED" && restrictedUsernames.length === 0) {
            setCreateError("Add at least one username for a restricted portfolio.");
            return;
        }

        try {
            setLoading(true);
            setCreateError("");

            const auth = await clientAuthProvider().getAuth();

            const res = await fetch("http://localhost:8080/portfolios", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(auth ? { Authorization: auth } : {})
                },
                body: JSON.stringify({
                    name: name.trim(),
                    description: description.trim(),
                    visibility,
                    restrictedUsernames: visibility === "RESTRICTED" ? restrictedUsernames : []
                })
            });

            if (!res.ok) {
                setCreateError("Portfolio could not be created. Please try again.");
                return;
            }

            await loadPortfolios();

            setName("");
            setDescription("");
            setVisibility("PUBLIC");
            setRestrictedUsernames([]);
            setShowForm(false);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseCreateForm = () => {
        setShowForm(false);
        setCreateError("");
    };

    const handleOpenDeleteModal = (portfolio: Portfolio) => {
        setPortfolioToDelete(portfolio);
        setDeleteError("");
        setActiveMenuHref(null);
    };

    const handleCloseDeleteModal = () => {
        if (deletingPortfolioHref) return;
        setPortfolioToDelete(null);
        setDeleteError("");
    };

    const handleDelete = async () => {
        if (!portfolioToDelete) return;

        const href = getPortfolioHref(portfolioToDelete);
        try {
            setDeletingPortfolioHref(href);
            setDeleteError("");

            const service = new PortfolioService(clientAuthProvider());
            await service.deletePortfolio(portfolioToDelete);

            setData((currentData) =>
                currentData.filter((item) => getPortfolioHref(item) !== href)
            );
            setPortfolioToDelete(null);
        } catch (err) {
            console.error(err);
            setDeleteError("This portfolio could not be deleted. Please try again.");
        } finally {
            setDeletingPortfolioHref(null);
        }
    };

    const handleStartEdit = (portfolio: Portfolio) => {
        setEditingPortfolioHref(getPortfolioHref(portfolio));
        setEditName(portfolio.name);
        setEditDescription(portfolio.description || "");
        setEditVisibility(portfolio.visibility || "PRIVATE");
        setEditRestrictedUsernames(portfolio.restrictedUsernames ?? []);
        setActiveMenuHref(null);
    };

    const handleCancelEdit = () => {
        setEditingPortfolioHref(null);
        setEditName("");
        setEditDescription("");
        setEditVisibility("PUBLIC");
        setEditRestrictedUsernames([]);
    };

    const handleUpdate = async (portfolio: Portfolio) => {
        const href = getPortfolioHref(portfolio);

        if (editVisibility === "RESTRICTED" && editRestrictedUsernames.length === 0) {
            window.alert("Añade al menos un usuario para un portfolio restringido.");
            return;
        }

        try {
            setUpdatingPortfolioHref(href);

            const service = new PortfolioService(clientAuthProvider());
            await service.updatePortfolio(portfolio, {
                name: editName,
                description: editDescription,
                visibility: editVisibility,
                restrictedUsernames: editVisibility === "RESTRICTED" ? editRestrictedUsernames : [],
            });

            setData((currentData) =>
                currentData.map((item) =>
                    getPortfolioHref(item) === href
                        ? Object.assign(item, {
                            name: editName,
                            description: editDescription,
                            visibility: editVisibility,
                            restrictedUsernames: editVisibility === "RESTRICTED" ? editRestrictedUsernames : [],
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
                        New Portfolio
                    </button>

                </div>

            </div>

            {showForm && (

                <div className="mb-8 bg-white border rounded-2xl p-6 shadow-sm">
                    <div className="mb-5 flex items-center justify-between gap-4">
                        <h2 className="text-lg font-semibold text-gray-900">
                            Create portfolio
                        </h2>

                        <button
                            type="button"
                            aria-label="Close create portfolio form"
                            onClick={handleCloseCreateForm}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4">

                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value);
                                setCreateError("");
                            }}
                            className="border rounded-xl p-3 flex-1"
                        />

                        <input
                            type="text"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => {
                                setDescription(e.target.value);
                                setCreateError("");
                            }}
                            className="border rounded-xl p-3 flex-1"
                        />

                        <div className="flex items-center gap-3">
                            <div className="inline-flex rounded-xl bg-gray-100 p-1">
                                {visibilityOptions.map((option) => (
                                    <button
                                        key={option}
                                        type="button"
                                        onClick={() => {
                                            setVisibility(option);
                                            setCreateError("");
                                        }}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                                            visibility === option ? "bg-white shadow text-blue-700" : "text-gray-600"
                                        }`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {visibility === "RESTRICTED" && (
                            <RestrictedUsernamesInput
                                usernames={restrictedUsernames}
                                onChange={(usernames) => {
                                    setRestrictedUsernames(usernames);
                                    setCreateError("");
                                }}
                            />
                        )}

                        <button
                            type="button"
                            onClick={handleCreate}
                            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition"
                        >
                            Create
                        </button>
                    </div>

                    {createError && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {createError}
                        </p>
                    )}

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
                        const isSharedPortfolio = sharedPortfolioHrefs.has(portfolioHref);

                        return (

                        <div
                            key={portfolioHref || index}
                            className="relative bg-white rounded-2xl border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >

                            <div className="h-2 rounded-t-2xl bg-gradient-to-r from-blue-500 to-indigo-500" />

                            {!isSharedPortfolio && (
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
                                            onClick={() => handleOpenDeleteModal(p)}
                                            disabled={isDeleting}
                                            className="flex w-full items-center gap-2 px-4 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            <Trash2 size={16} />
                                            {isDeleting ? "Eliminando..." : "Eliminar"}
                                        </button>
                                    </div>
                                )}
                            </div>
                            )}

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

                                                <div className="inline-flex rounded-xl bg-gray-100 p-1">
                                                    {visibilityOptions.map((option) => (
                                                        <button
                                                            key={option}
                                                            type="button"
                                                            onClick={() => setEditVisibility(option)}
                                                            className={`px-3 py-2 rounded-lg text-xs font-semibold transition ${
                                                                editVisibility === option
                                                                    ? "bg-white shadow text-blue-700"
                                                                    : "text-gray-600"
                                                            }`}
                                                        >
                                                            {option}
                                                        </button>
                                                    ))}
                                                </div>

                                                {editVisibility === "RESTRICTED" && (
                                                    <RestrictedUsernamesInput
                                                        usernames={editRestrictedUsernames}
                                                        onChange={setEditRestrictedUsernames}
                                                    />
                                                )}
                                            </div>
                                        ) : (
                                            <>
                                                <h2 className="text-2xl font-bold text-gray-900 break-words whitespace-normal max-w-full">
                                                    {p.name}
                                                </h2>

                                                <span
                                                    className={`inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full ${
                                                        p.visibility === "PUBLIC"
                                                            ? "bg-green-100 text-green-700"
                                                            : p.visibility === "RESTRICTED"
                                                                ? "bg-amber-100 text-amber-700"
                                                            : "bg-blue-100 text-blue-700"
                                                    }`}
                                                >
                                                    {p.visibility}
                                                </span>

                                                {p.visibility === "RESTRICTED" && p.restrictedUsernames?.length ? (
                                                    <p className="mt-2 text-xs text-gray-500">
                                                        Visible for: {p.restrictedUsernames.join(", ")}
                                                    </p>
                                                ) : null}

                                                {isSharedPortfolio ? (
                                                    <p className="mt-2 text-xs font-semibold text-amber-700">
                                                        Shared with you
                                                    </p>
                                                ) : null}
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

        {portfolioToDelete && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="delete-portfolio-title"
                    className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 id="delete-portfolio-title" className="text-xl font-bold text-gray-900">
                                Delete portfolio
                            </h2>

                            <p className="mt-2 text-sm text-gray-600">
                                Are you sure you want to delete &quot;{portfolioToDelete.name}&quot;?
                            </p>
                        </div>

                        <button
                            type="button"
                            aria-label="Close delete confirmation"
                            onClick={handleCloseDeleteModal}
                            disabled={Boolean(deletingPortfolioHref)}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {deleteError && (
                        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                            {deleteError}
                        </p>
                    )}

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCloseDeleteModal}
                            disabled={Boolean(deletingPortfolioHref)}
                            className="rounded-xl border px-4 py-2 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={Boolean(deletingPortfolioHref)}
                            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {deletingPortfolioHref ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </div>
        )}

    </div>
);
}

"use client";
 
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminService } from "@/api/adminApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useAuth } from "@/app/components/authentication";
import { Admin } from "@/types/admin";
import AdminCard from "@/app/components/AdminCard";
import { error } from "console";
 
export default function AdminsPage() {
    const router = useRouter(); 
    const { user } = useAuth(); // mateix hook que fa servir la Navbar
 
    const service = new AdminService(clientAuthProvider());
 
    const [admins, setAdmins] = useState<Admin[]>([]); 
    const [loading, setLoading] = useState(true);  
 
    // Estat del formulari
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
 
    // --- Protecció de ruta ---
    useEffect(() => {
        if (user === null) {
            router.replace("/");
        }
        if (user && !user.authorities?.some(a => a.authority === "ROLE_ADMIN")) {
            router.replace("/");
        }
    }, [user, router]);
 
    // --- Carregar admins ---
    const load = async () => {
        setLoading(true);
        const data = await service.getAdmins();
        setAdmins(data);
        setLoading(false);
    };
 
    useEffect(() => {
        if (user?.authorities?.some(a => a.authority === "ROLE_ADMIN")) {
            load();
        }
    }, [user]);
 
    // --- Formulari ---
    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
 
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setFormError(null);
 
        if (!form.username || !form.email || !form.password) {
            setFormError("Tots els camps són obligatoris.");
            return;
        }
 
        setSubmitting(true);
        try {
            await service.createAdmin(form);
            setShowForm(false);
            setForm({ username: "", email: "", password: "" });
            await load();
        } catch {
           setFormError("Error en crear l'admin. Comprova les dades.");
        } finally {
            setSubmitting(false);
        }
    }
 
    if (!user) return null;
 
    return (
        <div className="p-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Admins</h1>
                <button
                    onClick={() => {
                        setShowForm(v => !v);
                        setFormError(null);
                    }}
                    className="
                        bg-blue-600 hover:bg-blue-700
                        text-white px-4 py-2 rounded-lg
                        text-sm font-medium transition
                    "
                >
                    {showForm ? "Cancel·lar" : "+ Add Admin"}
                </button>
            </div>
 
            {showForm && (
                <form
                    onSubmit={handleSubmit}
                    className="
                        mb-8 p-6 rounded-xl border bg-white dark:bg-black
                        shadow-sm space-y-4 max-w-md
                    "
                >
                    <h2 className="font-semibold text-lg">Nou administrador</h2>
 
                    {formError && (
                        <p className="text-red-500 text-sm">{formError}</p>
                    )}
 
                    <label className="block space-y-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Nom d'usuari
                        </span>
                        <input
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="usuari123"
                            autoComplete="off"
                            className="
                                w-full border rounded-lg px-3 py-2
                                text-sm outline-none
                                focus:ring-2 focus:ring-blue-500
                                dark:bg-gray-900 dark:text-white
                            "
                        />
                    </label>
 
                    <label className="block space-y-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Correu electrònic
                        </span>
                        <input
                            name="email"
                            type="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="admin@exemple.com"
                            className="
                                w-full border rounded-lg px-3 py-2
                                text-sm outline-none
                                focus:ring-2 focus:ring-blue-500
                                dark:bg-gray-900 dark:text-white
                            "
                        />
                    </label>
 
                    <label className="block space-y-1">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Contrasenya
                        </span>
                        <input
                            name="password"
                            type="password"
                            value={form.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            className="
                                w-full border rounded-lg px-3 py-2
                                text-sm outline-none
                                focus:ring-2 focus:ring-blue-500
                                dark:bg-gray-900 dark:text-white
                            "
                        />
                    </label>
 
                    <button
                        type="submit"
                        disabled={submitting}
                        className="
                            w-full bg-blue-600 hover:bg-blue-700
                            text-white py-2 rounded-lg
                            text-sm font-medium transition
                            disabled:opacity-50
                        "
                    >
                        {submitting ? "Afegint..." : "Afegir admin"}
                    </button>
                </form>
            )}
 
            {loading ? (
                <p className="text-gray-500">Carregant admins…</p>
            ) : admins.length === 0 ? (
                <p className="text-gray-500">No hi ha cap administrador registrat.</p>
            ) : (
                <ul className="space-y-4">
                    {admins.map(admin => (
                        <AdminCard key={admin.username} admin={admin} />
                    ))}
                </ul>
            )}
        </div>
    );
}
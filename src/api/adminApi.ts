
import { getHal, mergeHalArray } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Admin } from "@/types/admin";

export class AdminService {
    constructor(private authProvider: AuthProvider) {}

    // Obté la llista de tots els admins
    async getAdmins(): Promise<Admin[]> {
        const resource = await getHal('/admins', this.authProvider);
        const embedded = resource.embeddedArray('admins') || [];
        return mergeHalArray<Admin>(embedded);
    }

    // Crea un nou admin.
    // Fem el fetch manualment perquè el backend retorna 201 amb body buit,
    // i postHal peta intentant fer res.json() sobre una resposta buida.
    async createAdmin(admin: { username: string; email: string; password: string }): Promise<void> {
        const authorization = await this.authProvider.getAuth();
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080"}/admins`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/hal+json",
                ...(authorization ? { Authorization: authorization } : {}),
            },
            body: JSON.stringify(admin),
            cache: "no-store",
        });

        if (!res.ok) {
            throw new Error(`HTTP ${res.status}`);
        }
        // No llegim el body: recarregarem la llista després
    }
}
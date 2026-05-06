import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Admin } from "@/types/admin";

export class AdminService {
    constructor(private authProvider: AuthProvider) {}

    // Obté la llista de tots els admins
    async getAdmins(): Promise<Admin[]> {
        const resource = await getHal('/admins', this.authProvider);
        // El backend retorna els admins dins _embedded.admins (HAL)
        const embedded = resource.embeddedArray('admins') || [];
        return mergeHalArray<Admin>(embedded);
    }

    // Crea un nou admin
    async createAdmin(admin: { username: string; email: string; password: string }): Promise<Admin> {
        const resource = await postHal('/admins', admin as unknown as Admin, this.authProvider);
        return mergeHal<Admin>(resource);
    }
}
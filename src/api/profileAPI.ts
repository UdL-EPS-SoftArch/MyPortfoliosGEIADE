import { getHal, mergeHal, postHal, putHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Resource } from "halfred";

export interface ProfileType {
    id?: number;
    description?: string;
    visibility?: "PUBLIC" | "PRIVATE";
}

export type Profile = ProfileType & Resource

export class ProfileService {
    constructor(private authProvider: AuthProvider) {}

    async getMyProfile(): Promise<Profile> {
        const resource = await getHal("/me/profile", this.authProvider);
        return mergeHal<Profile>(resource);
    }

    async updateMyProfile(profile: any): Promise<any> {

        const payload = {
            description: profile.description,
            visibility: profile.visibility,
        };
    
        const resource = await putHal("/me/profile", payload, this.authProvider);
    
        return mergeHal(resource);
    }

    async getProfileById(id: number): Promise<Profile> {
        const resource = await getHal(`/profiles/${id}`, this.authProvider);
        return mergeHal<Profile>(resource);
    }
}
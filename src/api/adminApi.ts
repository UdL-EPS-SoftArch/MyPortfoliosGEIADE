import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";

export class CreatorService {
    constructor(private authProvider: AuthProvider) {
    }

    async getCreators(): Promise<User[]> {
        const resource = await getHal('/admins', this.authProvider);
        const embedded = resource.embeddedArray('users') || [];
        return mergeHalArray<User>(embedded);
    }

    async getCreatorById(id: string): Promise<User> {
        const resource = await getHal(`/admins/${id}`, this.authProvider);
        return mergeHal<User>(resource);
    }


    async createCreator(user: User): Promise<User> {
        const resource = await postHal('/admins', user, this.authProvider);
        return mergeHal<User>(resource);
    }
}

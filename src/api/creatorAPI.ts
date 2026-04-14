import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Creator } from "@/types/creator";
import { Resource } from "halfred";
import { postHalAction } from "./halClient";


export class CreatorService {
    constructor(private authProvider: AuthProvider) {}

    async getCreators(): Promise<Creator[]> {
        const resource = await getHal('/creators', this.authProvider);

        const embedded = resource.embeddedArray('creators') || [];

        return mergeHalArray<Creator>(embedded);
    }

    async getCreatorById(id: string): Promise<Creator> {
        const resource = await getHal(`/creators/${id}`, this.authProvider);
        return mergeHal<Creator>(resource);
    }

    async createCreator(creator: Creator): Promise<Creator> {
        const resource = await postHal('/creators', creator, this.authProvider);
        return mergeHal<Creator>(resource);
    }


    async suspendCreator(username: string): Promise<Creator> {
        const resource = await postHalAction(
            `/creators/${username}/suspend`,
            this.authProvider
        );

        return mergeHal<Creator>(resource);
    }
}

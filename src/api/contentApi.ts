import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Content } from "@/types/content";
import type { User } from "@/types/user";

export class ContentService {
    constructor(private authProvider: AuthProvider) {
    }

    async getContents(): Promise<Content[]> {
        const resource = await getHal('/contents', this.authProvider);
        const embedded = resource.embeddedArray('contents') || [];
        return mergeHalArray<Content>(embedded);
    }

    async getContentById(id: string): Promise<Content> {
        const resource = await getHal(`/contents/${id}`, this.authProvider);
        return mergeHal<Content>(resource);
    }

    async getContentsByOwnedBy(owner: User): Promise<Content[]> {
        const resource = await getHal(
            `/contents/search/findByOwnedBy?user=${owner.uri}`, this.authProvider);
        const embedded = resource.embeddedArray('contents') || [];
        return mergeHalArray<Content>(embedded);
    }

    async createContent(content: Content): Promise<Content> {
        const resource = await postHal('/contents', content, this.authProvider);
        return mergeHal<Content>(resource);
    }

    async getContentRelation<T>(content: Content, relation: string): Promise<T> {
        const resource = await getHal(content.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}

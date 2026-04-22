import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Tag } from "@/types/tag";

export class TagsService {
    constructor(private authProvider: AuthProvider) {}

    async getTags(): Promise<Tag[]> {
        const resource = await getHal('/tags', this.authProvider);
        const embedded = resource.embeddedArray('tags') || [];
        return mergeHalArray<Tag>(embedded);
    }

    async findByName(name: string): Promise<Tag> {
        const resource = await getHal(`/tags/${name}`, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async createTag(tag: Tag): Promise<Tag> {
        const resource = await postHal('/tags', tag, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async findById(id: number): Promise<Tag> {
      const resource = await getHal(`/tags/${id}`, this.authProvider);
      return mergeHal<Tag>(resource);
    }
}
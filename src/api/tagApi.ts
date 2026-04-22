import { getHal, mergeHal, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Tag } from "@/types/tag";

type HalTag = Tag & {
    uri?: string;
    _links?: {
        self?: {
            href?: string;
        };
        [key: string]: unknown;
    };
    id?: number;
};

export class TagsService {
    constructor(private authProvider: AuthProvider) {}

    async getTags(): Promise<HalTag[]> {
        const resource = await getHal("/tags", this.authProvider);
        const embedded = resource.embeddedArray("tags") || [];

        return embedded.map((item: any) => {
            const tag = mergeHal<Tag>(item) as HalTag;

            const href =
                item?._links?.self?.href ??
                tag?._links?.self?.href ??
                item?.link?.("self")?.href;

            const uri =
                item?.uri ??
                tag?.uri ??
                (href ? new URL(href).pathname : undefined);

            const idFromUri = uri?.split("/").pop();

            return {
                ...tag,
                uri,
                _links: item?._links ?? tag?._links,
                id: tag.id ?? (idFromUri ? Number(idFromUri) : undefined),
            };
        });
    }

    async findByName(name: string): Promise<Tag> {
        const resource = await getHal(`/tags/${name}`, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async createTag(tag: Tag): Promise<Tag> {
        const resource = await postHal("/tags", tag, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async findById(id: number | string): Promise<Tag> {
        const resource = await getHal(`/tags/${id}`, this.authProvider);
        return mergeHal<Tag>(resource);
    }
}
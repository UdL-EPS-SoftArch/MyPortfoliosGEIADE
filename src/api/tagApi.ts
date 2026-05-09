import { deleteHal, getHal, mergeHal, postHal, putUriList } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Tag } from "@/types/tag";
import type { Resource } from "halfred";

type HalLinks = {
    self?: {
        href?: string;
    };
    [key: string]: unknown;
};

type HalResource = Resource & {
    uri?: string;
    _links?: HalLinks;
    _original?: unknown;
    link?: (rel: string) => { href?: string } | undefined;
    [key: string]: unknown;
};

type HalTag = Tag & {
    uri?: string;
    _links?: HalLinks;
    id?: number;
};

export type HalContent = {
    contentId?: number;
    name?: string;
    body?: string;
    description?: string;
    visibility?: string;
    uri?: string;
    _links?: HalLinks;
};

export class TagsService {
    constructor(private authProvider: AuthProvider) {}

    async getTags(): Promise<HalTag[]> {
        const resource = await getHal("/tags", this.authProvider);
        const embedded = resource.embeddedArray("tags") || [];

        return embedded.map((item: Resource) => {
            const halItem = item as HalResource;
            const tag = mergeHal<Tag>(item) as HalTag;

            const href =
                halItem?._links?.self?.href ??
                tag?._links?.self?.href ??
                halItem?.link?.("self")?.href;

            const uri =
                halItem?.uri ??
                tag?.uri ??
                (href ? new URL(href).pathname : undefined);

            const idFromUri = uri?.split("/").pop();

            return {
                ...tag,
                uri,
                _links: halItem?._links ?? tag?._links,
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

    async findById(id: number | string): Promise<HalTag> {
        const resource = await getHal(`/tags/${id}`, this.authProvider);
        const halResource = resource as HalResource;
        const tag = mergeHal<Tag>(resource) as HalTag;

        const href =
            halResource?._links?.self?.href ??
            tag?._links?.self?.href ??
            halResource?.link?.("self")?.href;

        const uri =
            halResource?.uri ??
            tag?.uri ??
            (href ? new URL(href).pathname : undefined);

        const idFromUri = uri?.split("/").pop();

        return {
            ...tag,
            uri,
            _links: halResource?._links ?? tag?._links,
            id: tag.id ?? (idFromUri ? Number(idFromUri) : undefined),
        };
    }

    async findContentsByTagId(tagId: number): Promise<HalContent[]> {
        const resource = await getHal(
            `/contents/search/findByTags_Id?tagId=${tagId}`,
            this.authProvider
        );

        const embedded = resource.embeddedArray("contents") || [];

        return embedded.map((item: Resource) => {
            const halItem = item as HalResource;
            const content = mergeHal<HalContent>(item) as HalContent;

            const href =
                halItem?._links?.self?.href ??
                content?._links?.self?.href ??
                halItem?.link?.("self")?.href;

            const uri =
                halItem?.uri ??
                content?.uri ??
                (href ? new URL(href).pathname : undefined);

            const idFromUri = uri?.split("/").pop();

            return {
                ...content,
                uri,
                _links: halItem?._links ?? content?._links,
                contentId:
                    content.contentId ?? (idFromUri ? Number(idFromUri) : undefined),
            };
        });
    }

    async findAvailableContentsByTagId(tagId: number): Promise<HalContent[]> {
        const resource = await getHal(
            `/tags/${tagId}/available-contents`,
            this.authProvider
        );

        let embedded = resource.embeddedArray("contents") || [];

        const halResource = resource as HalResource;

        if ((!embedded || embedded.length === 0) && Array.isArray(halResource._original)) {
            embedded = halResource._original as Resource[];
        }

        if ((!embedded || embedded.length === 0)) {
            const numericItems = Object.keys(resource)
                .filter(k => /^[0-9]+$/.test(k))
                .map(k => halResource[k] as Resource);
            if (numericItems.length > 0) embedded = numericItems;
        }

        const mapped = embedded.map((item: Resource) => {
            const halItem = item as HalResource;
            const content = mergeHal<HalContent>(item) as HalContent;

            const href =
                halItem?._links?.self?.href ??
                content?._links?.self?.href ??
                halItem?.link?.("self")?.href;

            const uri =
                halItem?.uri ??
                content?.uri ??
                (href ? new URL(href).pathname : undefined);

            const idFromUri = uri?.split("/").pop();

            return {
                ...content,
                uri,
                _links: halItem?._links ?? content?._links,
                contentId:
                    content.contentId ?? (idFromUri ? Number(idFromUri) : undefined),
            };
        });

        return mapped;
    }

    async assignContentToTag(tagId: number, contentId: number): Promise<void> {
        await putUriList(`/contents/${contentId}/tags`, `/tags/${tagId}`, this.authProvider);
    }

    async removeContentFromTag(tagId: number, contentId: number): Promise<void> {
        await deleteHal(`/contents/${contentId}/tags/${tagId}`, this.authProvider);
    }

    async deleteTag(tagId: number): Promise<void> {
        await deleteHal(`/tags/${tagId}/delete`, this.authProvider);
    }
}

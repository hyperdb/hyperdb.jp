import { PAGE_TYPE, SITE_INFO } from "@/lib/constant";
import type { Content, ContentCategory, ContentTag } from "@/types/Content";

const API_BASE_URL = "https://writers.hyperdb.cloud/api/v1";
export const POSTS_PER_PAGE = 5;

interface ApiEnvelope<T> {
    message: string;
    data: T;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === "object" && value !== null;

const isContent = (value: unknown): value is Content => {
    if (!isRecord(value)) {
        return false;
    }

    return (
        typeof value.key === "string" &&
        typeof value.title === "string" &&
        (typeof value.body === "string" || value.body === null) &&
        (value.status === "draft" || value.status === "published") &&
        (typeof value.published_at === "string" || value.published_at === null) &&
        (typeof value.type_key === "string" || value.type_key === null) &&
        (typeof value.category_key === "string" || value.category_key === null) &&
        typeof value.site_key === "string" &&
        typeof value.writer_key === "string" &&
        Array.isArray(value.tags) &&
        value.tags.every(
            (tag) =>
                isRecord(tag) &&
                typeof tag.key === "string" &&
                typeof tag.tag === "string",
        ) &&
        typeof value.created_at === "string" &&
        typeof value.updated_at === "string"
    );
};

const isContentListEnvelope = (value: unknown): value is ApiEnvelope<Content[]> =>
    isRecord(value) &&
    typeof value.message === "string" &&
    Array.isArray(value.data) &&
    value.data.every(isContent);

const isContentCategory = (value: unknown): value is ContentCategory =>
    isRecord(value) &&
    typeof value.key === "string" &&
    typeof value.category === "string";

export const getContent = async (
    key: string,
    signal?: AbortSignal,
): Promise<Content> => {
    const response = await fetch(
        `${API_BASE_URL}/contents/${encodeURIComponent(key)}`,
        { signal },
    );
    if (!response.ok) {
        throw new Error(`Content request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !isContent(payload.data)) {
        throw new Error("Content response has an invalid format");
    }

    return payload.data;
};

export const getCategory = async (
    key: string,
    signal?: AbortSignal,
): Promise<ContentCategory> => {
    const response = await fetch(
        `${API_BASE_URL}/categories/${encodeURIComponent(key)}`,
        { signal },
    );
    if (!response.ok) {
        throw new Error(`Category request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || !isContentCategory(payload.data)) {
        throw new Error("Category response has an invalid format");
    }

    return payload.data;
};

export const getTag = async (
    key: string,
    signal?: AbortSignal,
): Promise<ContentTag> => {
    const response = await fetch(
        `${API_BASE_URL}/tags/${encodeURIComponent(key)}`,
        { signal },
    );
    if (!response.ok) {
        throw new Error(`Tag request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (
        !isRecord(payload) ||
        !isRecord(payload.data) ||
        typeof payload.data.key !== "string" ||
        typeof payload.data.tag !== "string"
    ) {
        throw new Error("Tag response has an invalid format");
    }

    return payload.data as ContentTag;
};

export const getLatestPosts = async (signal?: AbortSignal): Promise<Content[]> => {
    const url = new URL(
        `${API_BASE_URL}/sites/${SITE_INFO.key}/contents/${PAGE_TYPE.post}/latest`,
    );
    url.searchParams.set("limit", "3");

    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Latest posts request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isContentListEnvelope(payload)) {
        throw new Error("Latest posts response has an invalid format");
    }

    return payload.data;
};

export type PostFilter = { category?: string; tag?: string };

const applyPostFilter = (url: URL, filter?: PostFilter) => {
    if (filter?.category) {
        url.searchParams.set("category", filter.category);
    }
    if (filter?.tag) {
        url.searchParams.set("tag", filter.tag);
    }
};

export const getPostCount = async (
    signal?: AbortSignal,
    filter?: PostFilter,
): Promise<number> => {
    const url = new URL(
        `${API_BASE_URL}/sites/${SITE_INFO.key}/contents/${PAGE_TYPE.post}/count`,
    );
    applyPostFilter(url, filter);

    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Post count request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (
        !isRecord(payload) ||
        !isRecord(payload.data) ||
        typeof payload.data.count !== "number" ||
        !Number.isInteger(payload.data.count) ||
        payload.data.count < 0
    ) {
        throw new Error("Post count response has an invalid format");
    }

    return payload.data.count;
};

export const getPostList = async (
    page: number,
    signal?: AbortSignal,
    filter?: PostFilter,
): Promise<Content[]> => {
    const url = new URL(
        `${API_BASE_URL}/sites/${SITE_INFO.key}/contents/${PAGE_TYPE.post}`,
    );
    url.searchParams.set("page", String(page));
    url.searchParams.set("rows", String(POSTS_PER_PAGE));
    applyPostFilter(url, filter);

    const response = await fetch(url, { signal });
    if (!response.ok) {
        throw new Error(`Post list request failed: ${response.status}`);
    }

    const payload: unknown = await response.json();
    if (!isContentListEnvelope(payload)) {
        throw new Error("Post list response has an invalid format");
    }

    return payload.data;
};

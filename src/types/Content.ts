export type Content = {
    title: string;
    body: string | null;
    status: "draft" | "published";
    published_at: string | null;
    created_at: string;
    updated_at: string;
    key: string;
    type_key: string | null;
    category_key: string | null;
    site_key: string;
    writer_key: string;
    tags: TagInfo[];
};

export type TagInfo = {
    key: string;
    tag: string;
};

export type ContentTag = {
    key: string;
    tag: string;
    created_at: string;
    updated_at: string;
    site_key: string;
};

export type ContentCategory = {
    key: string;
    category: string;
    created_at: string;
    updated_at: string;
    parent_key: string | null;
    site_key: string;
};

export type ContentType = {
    key: string;
    name: string;
    created_at: string;
    updated_at: string;
};

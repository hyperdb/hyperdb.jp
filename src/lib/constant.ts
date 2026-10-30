import type { MenuItem } from "@/types/Menu";

export const SITE_INFO = {
    title: "hyperdb.jp",
    url: "https://hyperdb.jp",
    key: "7cyGJ2yi",
};

export const PAGE_TYPE = {
    page: "9yPvLZg1",
    post: "uy9iMBxO",
};

export const PAGE_KEYS = {
    profile: "ocUuXKZj",
    policy: "9RPvLZg1",
    home: "cjO5UjHR",
    contact: "wA3ruNA9",
};

export const MENU_ITEMS: MenuItem[] = [
    {
        title: "ホーム",
        path: "/",
    },
    {
        title: "ブログ投稿一覧",
        path: "/blog",
    },
    {
        title: "プロフィール",
        path: "/profile",
    },
    {
        title: "プライバシーポリシー",
        path: "/policy",
    },
    {
        title: "コンタクト",
        path: "/contact",
    },
];

import type { MenuItem } from "@/types/Menu";
import settings from "./settings.json";

export const SITE_INFO = {
    title: settings.site_info.title,
    url: settings.site_info.url,
    key: settings.site_info.key,
    remark42_key: settings.site_info.remark42_key,
    description: settings.site_info.description,
    image: settings.site_info.image,
    locale: settings.site_info.locale,
    twitterCard: settings.site_info.twitterCard,
};

export const PAGE_TYPE = {
    page: settings.page_type.page,
    post: settings.page_type.post,
};

export const PAGE_KEYS = {
    profile: settings.page_keys.profile,
    policy: settings.page_keys.policy,
    home: settings.page_keys.home,
    contact: settings.page_keys.contact,
};

export const MENU_ITEMS: MenuItem[] = [
    {
        title: "ホーム",
        path: "/",
    },
    {
        title: "ブログ投稿記事",
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
        title: "お問い合わせ",
        path: "/contact",
    },
];

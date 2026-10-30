import { getCategory, getTag } from "@/api/contents";
import { useEffect, useState } from "react";

/** カテゴリー/タグの名称を取得する。取得できない場合はnull（一覧自体は表示する） */
export const useFilterLabel = (kind: "category" | "tag", key: string) => {
    const [label, setLabel] = useState<string | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        setLabel(null);

        const request =
            kind === "category"
                ? getCategory(key, controller.signal).then((c) => c.category)
                : getTag(key, controller.signal).then((t) => t.tag);

        request.then(setLabel).catch((error: unknown) => {
            if (!controller.signal.aborted) {
                console.error("絞り込み名称を取得できませんでした。", error);
            }
        });

        return () => controller.abort();
    }, [kind, key]);

    return label;
};

import { getCategory, getContent } from "@/api/contents";
import ContentBody from "@/components/pages/contents/ContentBody";
import ContentFooter from "@/components/pages/contents/ContentFooter";
import ContentTitle from "@/components/pages/contents/ContentTitle";
import type { Content, ContentCategory } from "@/types/Content";
import { useEffect, useState } from "react";

interface Props {
    contentKey: string;
    showCategory?: boolean;
    showTags?: boolean;
}

/** 記事の表示部分（タイトル・本文・フッター）。固定ページ等でも利用する */
const ContentView = ({
    contentKey,
    showCategory = true,
    showTags = true,
}: Props) => {
    const [content, setContent] = useState<Content | null>(null);
    const [category, setCategory] = useState<ContentCategory | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        const load = async () => {
            setIsLoading(true);
            setHasError(false);
            setContent(null);
            setCategory(null);

            try {
                const loaded = await getContent(contentKey, controller.signal);
                // カテゴリー名の取得失敗では記事表示を止めない
                const loadedCategory =
                    showCategory && loaded.category_key
                        ? await getCategory(
                              loaded.category_key,
                              controller.signal,
                          ).catch((error: unknown) => {
                              if (!controller.signal.aborted) {
                                  console.error(
                                      "カテゴリーを取得できませんでした。",
                                      error,
                                  );
                              }
                              return null;
                          })
                        : null;

                if (!controller.signal.aborted) {
                    setContent(loaded);
                    setCategory(loadedCategory);
                }
            } catch (error: unknown) {
                if (!controller.signal.aborted) {
                    console.error("記事を取得できませんでした。", error);
                    setHasError(true);
                }
            } finally {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            }
        };

        void load();

        return () => controller.abort();
    }, [contentKey, showCategory]);

    if (isLoading) {
        return <p>記事を読み込んでいます...</p>;
    }
    if (hasError || !content) {
        return <p role="alert">記事が取得できませんでした</p>;
    }

    return (
        <article>
            <ContentTitle content={content} category={category} />
            <ContentBody body={content.body} />
            <ContentFooter content={content} showTags={showTags} />
        </article>
    );
};
export default ContentView;

import { getContent } from "@/api/contents";
import ContentBody from "@/components/pages/contents/ContentBody";
import { useEffect, useState } from "react";

interface Props {
    contentKey: string;
}

/** 指定したkeyの本文のみを取得してページ内に埋め込む（タイトル・フッターなし） */
const ContentEmbed = ({ contentKey }: Props) => {
    const [body, setBody] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();
        setIsLoading(true);
        setHasError(false);
        setBody(null);

        getContent(contentKey, controller.signal)
            .then((content) => setBody(content.body))
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    console.error("本文を取得できませんでした。", error);
                    setHasError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, [contentKey]);

    if (isLoading) {
        return <p>記事を読み込んでいます...</p>;
    }
    if (hasError) {
        return <p role="alert">記事が取得できませんでした</p>;
    }

    return <ContentBody body={body} />;
};
export default ContentEmbed;

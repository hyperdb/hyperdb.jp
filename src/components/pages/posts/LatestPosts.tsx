import ComponentHeader from "@/components/pages/ComponentHeader";
import PostListItem from "@/components/pages/posts/PostListItem";
import { getLatestPosts } from "@/api/contents";
import { useEffect, useState } from "react";
import type { Content } from "@/types/Content";

const LatestPosts = () => {
    const [posts, setPosts] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    useEffect(() => {
        const controller = new AbortController();

        getLatestPosts(controller.signal)
            .then(setPosts)
            .catch((error: unknown) => {
                if (!controller.signal.aborted) {
                    console.error("新着記事を取得できませんでした。", error);
                    setHasError(true);
                }
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setIsLoading(false);
                }
            });

        return () => controller.abort();
    }, []);

    return (
        <>
            <ComponentHeader title="新着記事の一覧" />
            {isLoading && <p>記事を読み込んでいます...</p>}
            {hasError && <p role="alert">記事が取得できませんでした</p>}
            {!isLoading && !hasError && posts.length === 0 && <p>記事はありません</p>}
            {!hasError &&
                posts.map((post) => <PostListItem key={post.key} item={post} />)}
        </>
    );
};
export default LatestPosts;

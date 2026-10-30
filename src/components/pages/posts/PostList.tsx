import {
    getPostCount,
    getPostList,
    POSTS_PER_PAGE,
    type PostFilter,
} from "@/api/contents";
import ComponentHeader from "@/components/pages/ComponentHeader";
import PostListItem from "@/components/pages/posts/PostListItem";
import type { Content } from "@/types/Content";
import { ButtonGroup, Center, IconButton, Pagination } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useSearchParams } from "wouter";

interface Props {
    title?: string;
    filter?: PostFilter;
}

const PostList = ({ title = "ブログ記事一覧", filter }: Props) => {
    const category = filter?.category;
    const tag = filter?.tag;
    const [posts, setPosts] = useState<Content[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const requestedPage = Number(searchParams.get("page"));
    const page =
        Number.isInteger(requestedPage) && requestedPage > 1
            ? requestedPage - 1
            : 0;
    const setPage = (nextPage: number) =>
        setSearchParams(nextPage > 0 ? { page: String(nextPage + 1) } : {});
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        const controller = new AbortController();

        const loadPosts = async () => {
            setIsLoading(true);
            setHasError(false);
            setPosts([]);

            try {
                const postFilter = { category, tag };
                const [currentPosts, count] = await Promise.all([
                    getPostList(page, controller.signal, postFilter),
                    getPostCount(controller.signal, postFilter),
                ]);

                setPosts(currentPosts);
                setTotalCount(count);
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

        void loadPosts();

        return () => controller.abort();
    }, [page, category, tag]);

    return (
        <>
            <ComponentHeader title={title} />
            {isLoading && <p>記事を読み込んでいます...</p>}
            {hasError && <p role="alert">記事が取得できませんでした</p>}
            {!isLoading && !hasError && posts.length === 0 && (
                <p>記事はありません</p>
            )}
            {!hasError &&
                posts.map((post) => (
                    <PostListItem key={post.key} item={post} listPage={page + 1} />
                ))}
            {!isLoading && !hasError && totalCount > POSTS_PER_PAGE && (
                <Center mt={"1.5em"}>
                    <Pagination.Root
                        aria-label="ブログ記事一覧のページネーション"
                        count={totalCount}
                        pageSize={POSTS_PER_PAGE}
                        page={page + 1}
                        onPageChange={({ page: selectedPage }) =>
                            setPage(selectedPage - 1)
                        }
                    >
                        <ButtonGroup variant="ghost" size="sm">
                            <Pagination.PrevTrigger asChild>
                                <IconButton>
                                    <LuChevronLeft />
                                </IconButton>
                            </Pagination.PrevTrigger>
                            <Pagination.Items
                                render={(item) => (
                                    <Pagination.Item key={item.value} {...item}>
                                        <IconButton
                                            variant={{
                                                base: "ghost",
                                                _selected: "outline",
                                            }}
                                        >
                                            {item.value}
                                        </IconButton>
                                    </Pagination.Item>
                                )}
                            />
                            <Pagination.NextTrigger asChild>
                                <IconButton>
                                    <LuChevronRight />
                                </IconButton>
                            </Pagination.NextTrigger>
                        </ButtonGroup>
                    </Pagination.Root>
                </Center>
            )}
        </>
    );
};
export default PostList;

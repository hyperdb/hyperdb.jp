import PostList from "@/components/pages/posts/PostList";
import { useFilterLabel } from "@/hooks/useFilterLabel";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useParams } from "wouter";

/** S111 カテゴリー別ブログ記事一覧 */
const BlogCategory = () => {
    const { id } = useParams<{ id: string }>();
    const label = useFilterLabel("category", id);

    return (
        <DefaultLayout>
            <PostList
                title={label ? `カテゴリー: ${label}` : "カテゴリー別記事一覧"}
                filter={{ category: id }}
            />
        </DefaultLayout>
    );
};
export default BlogCategory;

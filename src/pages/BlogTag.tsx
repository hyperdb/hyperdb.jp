import PostList from "@/components/pages/posts/PostList";
import { useFilterLabel } from "@/hooks/useFilterLabel";
import DefaultLayout from "@/layouts/DefaultLayout";
import { useParams } from "wouter";

/** S121 タグ別ブログ記事一覧 */
const BlogTag = () => {
    const { id } = useParams<{ id: string }>();
    const label = useFilterLabel("tag", id);

    return (
        <DefaultLayout>
            <PostList
                title={label ? `タグ: ${label}` : "タグ別記事一覧"}
                filter={{ tag: id }}
            />
        </DefaultLayout>
    );
};
export default BlogTag;

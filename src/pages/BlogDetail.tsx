import ContentView from "@/components/pages/contents/ContentView";
import BlogLayout from "@/layouts/BlogLayout";
import { Link as ChakraLink } from "@chakra-ui/react";
import { Link, useParams, useSearchParams } from "wouter";

/** S102 ブログ記事詳細 */
const BlogDetail = () => {
    const { id } = useParams<{ id: string }>();
    const [searchParams] = useSearchParams();
    const listPage = Number(searchParams.get("page"));
    const backHref =
        Number.isInteger(listPage) && listPage > 1
            ? `/blog?page=${listPage}`
            : "/blog";

    return (
        <BlogLayout>
            <ContentView contentKey={id} withMeta />
            <ChakraLink asChild mt={10} display="inline-block">
                <Link href={backHref}>← ブログ記事一覧に戻る</Link>
            </ChakraLink>
        </BlogLayout>
    );
};
export default BlogDetail;

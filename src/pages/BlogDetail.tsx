import ContentView from "@/components/pages/contents/ContentView";
import DefaultLayout from "@/layouts/DefaultLayout";
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
        <DefaultLayout>
            <ContentView contentKey={id} />
            <ChakraLink asChild mt={10} display="inline-block">
                <Link href={backHref}>← ブログ記事一覧に戻る</Link>
            </ChakraLink>
        </DefaultLayout>
    );
};
export default BlogDetail;

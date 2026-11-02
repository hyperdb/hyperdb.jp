import type { MetaProps } from "@/components/pages/Meta";
import PageHeader from "@/components/pages/PageHeader";
import PostList from "@/components/pages/posts/PostList";
import DefaultLayout from "@/layouts/DefaultLayout";

/** S001 ホーム */
const Home = () => {
    const metaInfo: MetaProps = {
        title: "ブログ一覧",
    };

    return (
        <DefaultLayout meta={metaInfo}>
            <PageHeader title="ブログ一覧" />
            <PostList />
        </DefaultLayout>
    );
};
export default Home;

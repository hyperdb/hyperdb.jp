import PageHeader from "@/components/pages/PageHeader";
import PostList from "@/components/pages/posts/PostList";
import DefaultLayout from "@/layouts/DefaultLayout";

/** S001 ホーム */
const Home = () => {
    return (
        <DefaultLayout>
            <PageHeader title="ブログ記事一覧" />
            <PostList />
        </DefaultLayout>
    );
};
export default Home;

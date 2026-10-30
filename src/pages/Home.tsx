import PageHeader from "@/components/pages/PageHeader";
import ContentEmbed from "@/components/pages/contents/ContentEmbed";
import LatestPosts from "@/components/pages/posts/LatestPosts";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S001 ホーム */
const Home = () => {
    return (
        <DefaultLayout>
            <PageHeader title="Home" description="ようこそ、hyperdb.jpへ" />
            <ContentEmbed contentKey={PAGE_KEYS.home} />
            <LatestPosts />
        </DefaultLayout>
    );
};
export default Home;

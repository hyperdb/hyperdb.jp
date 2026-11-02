import ContentView from "@/components/pages/contents/ContentView";
import type { MetaProps } from "@/components/pages/Meta";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S011 プロフィール */
const Profile = () => {
    const metaInfo: MetaProps = {
        title: "プロフィール",
    };

    return (
        <DefaultLayout meta={metaInfo}>
            <ContentView
                contentKey={PAGE_KEYS.profile}
                showCategory={false}
                showTags={false}
            />
        </DefaultLayout>
    );
};
export default Profile;

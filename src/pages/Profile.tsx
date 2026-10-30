import ContentView from "@/components/pages/contents/ContentView";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S011 プロフィール */
const Profile = () => {
    return (
        <DefaultLayout>
            <ContentView
                contentKey={PAGE_KEYS.profile}
                showCategory={false}
                showTags={false}
            />
        </DefaultLayout>
    );
};
export default Profile;

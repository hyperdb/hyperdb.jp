import ContentView from "@/components/pages/contents/ContentView";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S012 プライバシーポリシー */
const Policy = () => {
    return (
        <DefaultLayout>
            <ContentView
                contentKey={PAGE_KEYS.policy}
                showCategory={false}
                showTags={false}
            />
        </DefaultLayout>
    );
};
export default Policy;

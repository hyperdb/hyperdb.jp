import ContentView from "@/components/pages/contents/ContentView";
import type { MetaProps } from "@/components/pages/Meta";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S012 プライバシーポリシー */
const Policy = () => {
    const metaInfo: MetaProps = {
        title: "プライバシーポリシー",
    };

    return (
        <DefaultLayout meta={metaInfo}>
            <ContentView
                contentKey={PAGE_KEYS.policy}
                showCategory={false}
                showTags={false}
            />
        </DefaultLayout>
    );
};
export default Policy;

import ContactForm from "@/components/pages/contact/ContactForm";
import ContentView from "@/components/pages/contents/ContentView";
import type { MetaProps } from "@/components/pages/Meta";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S013 コンタクト */
const Contact = () => {
    const metaInfo: MetaProps = {
        title: "お問い合わせ",
    };

    return (
        <DefaultLayout meta={metaInfo}>
            <ContentView
                contentKey={PAGE_KEYS.contact}
                showCategory={false}
                showTags={false}
                showFooter={false}
            />
            <ContactForm />
        </DefaultLayout>
    );
};
export default Contact;

import ContactForm from "@/components/pages/contact/ContactForm";
import ContentEmbed from "@/components/pages/contents/ContentEmbed";
import type { MetaProps } from "@/components/pages/Meta";
import PageHeader from "@/components/pages/PageHeader";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S013 コンタクト */
const Contact = () => {
    const metaInfo: MetaProps = {
        title: "お問い合わせ",
    };

    return (
        <DefaultLayout meta={metaInfo}>
            <PageHeader
                title="お問い合わせ"
                description="お問い合わせはこちらから"
            />
            <ContentEmbed contentKey={PAGE_KEYS.contact} />
            <ContactForm />
        </DefaultLayout>
    );
};
export default Contact;

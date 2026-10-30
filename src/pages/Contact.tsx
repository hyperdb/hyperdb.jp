import ContactForm from "@/components/pages/contact/ContactForm";
import ContentEmbed from "@/components/pages/contents/ContentEmbed";
import DefaultLayout from "@/layouts/DefaultLayout";
import { PAGE_KEYS } from "@/lib/constant";

/** S013 コンタクト */
const Contact = () => {
    return (
        <DefaultLayout>
            <ContentEmbed contentKey={PAGE_KEYS.contact} />
            <ContactForm />
        </DefaultLayout>
    );
};
export default Contact;

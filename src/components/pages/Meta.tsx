import { SITE_INFO } from "@/lib/constant";
import { useLocation } from "wouter";

export interface MetaProps {
    title?: string;
    description?: string;
    image?: string;
    type?: "website" | "article";
    /** サイトURLからの相対パス。省略時は現在のパス */
    path?: string;
    noindex?: boolean;
}

/** title / description / OGP / Twitter Card を出力する（React 19 により head へ移動される） */
const Meta = ({
    title,
    description = SITE_INFO.description,
    image = SITE_INFO.image,
    type = "website",
    path,
    noindex = false,
}: MetaProps) => {
    const [location] = useLocation();
    const fullTitle = title ? `${title} | ${SITE_INFO.title}` : SITE_INFO.title;
    const url = `${SITE_INFO.url}${path ?? location}`;

    return (
        <>
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            {noindex && <meta name="robots" content="noindex" />}
            <link rel="canonical" href={url} />
            <meta property="og:site_name" content={SITE_INFO.title} />
            <meta property="og:locale" content={SITE_INFO.locale} />
            <meta property="og:type" content={type} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:url" content={url} />
            <meta property="og:image" content={image} />
            <meta name="twitter:card" content={SITE_INFO.twitterCard} />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />
        </>
    );
};
export default Meta;

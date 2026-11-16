import { Box, Heading } from "@chakra-ui/react";
import { useEffect } from "react";

const COMMENT_HOST = "https://comment.hyperdb.cc";
const COMMENT_SCRIPT = "https://comment.hyperdb.cc/web/embed.js";

interface Props {
    pageId: string;
    title: string;
    siteId: string;
}

interface RemarkConfig {
    host: string;
    site_id: string;
    url_param: string;
    max_shown_comments: number;
    theme: "system";
    locale: "ja";
}

declare global {
    interface Window {
        remark_config: RemarkConfig;
        REMARK42?: {
            createInstance?: (config: RemarkConfig) => { destroy: () => void };
        };
    }
}

const CommentBlock = ({ pageId, siteId }: Props) => {
    useEffect(() => {
        const config: RemarkConfig = {
            host: COMMENT_HOST,
            site_id: siteId,
            url_param: pageId,
            max_shown_comments: 50,
            theme: "system",
            locale: "ja",
        };
        window.remark_config = config;

        const SCRIPT_ID = "remark42-embed-script";
        let instance: { destroy: () => void } | undefined;

        const initialize = () => {
            if (window.REMARK42?.createInstance) {
                instance = window.REMARK42.createInstance(config);
            }
        };

        if (window.REMARK42?.createInstance) {
            initialize();
        } else {
            window.addEventListener("REMARK42::ready", initialize);
        }

        if (!document.getElementById(SCRIPT_ID)) {
            const script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = COMMENT_SCRIPT;
            script.defer = true;
            script.addEventListener("error", () => {
                console.error("コメントの読み込みに失敗しました。");
                script.remove();
            });
            document.body.appendChild(script);
        }

        return () => {
            window.removeEventListener("REMARK42::ready", initialize);
            instance?.destroy();
        };
    }, [pageId, siteId]);

    return (
        <Box as="section" my={8} p={4} borderTop={"1px solid"}>
            <Heading size={"lg"} mx={2}>
                コメント
            </Heading>
            {/* Remark42のウィジェットがマウントされる要素 */}
            <Box as="div" id="remark42" p={2} />
        </Box>
    );
};
export default CommentBlock;

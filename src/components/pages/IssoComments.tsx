import { Box, Heading } from "@chakra-ui/react";
import { useEffect } from "react";
interface Props {
    threadId?: string;
}

const IssoComments = ({ threadId }: Props) => {
    useEffect(() => {
        // すでにスクリプトが存在しない場合のみ動的に追加する
        const scriptId = "isso-embed-script";
        if (!document.getElementById(scriptId)) {
            const script = document.createElement("script");
            script.id = scriptId;
            script.src = "https://comment.hyperdb.cc/js/embed.js";
            script.async = true;
            script.setAttribute("data-isso", "https://comment.hyperdb.cc");
            script.setAttribute("data-isso-lang", "ja");
            if (threadId) {
                script.setAttribute("data-isso-id", threadId);
            }
            document.body.appendChild(script);
        }
    }, [threadId]);

    return (
        <Box as="section" my={8} p={4} borderTop={"1px solid"}>
            <Heading size={"lg"} mx={2}>
                コメント
            </Heading>
            {/* Issoがこの中にコメントスレッドを自動描画します */}
            <Box as="div" id="isso-thread" p={2} />
        </Box>
    );
};
export default IssoComments;

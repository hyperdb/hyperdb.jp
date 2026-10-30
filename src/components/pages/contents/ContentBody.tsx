import MermaidDiagram from "@/components/pages/contents/MermaidDiagram";
import { Box } from "@chakra-ui/react";
import "highlight.js/styles/github.css";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import "../../../assets/content_body.css";

interface Props {
    body: string | null;
}

const ContentBody = ({ body }: Props) => {
    return (
        <Box
            className="content-body"
            my={8}
            lineHeight="1.9"
        >
            <Markdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[[rehypeHighlight, { ignoreMissing: true }]]}
                components={{
                    code({ className, children, ...props }) {
                        const language = /language-(\w+)/.exec(
                            className ?? "",
                        )?.[1];
                        if (language === "mermaid") {
                            return (
                                <MermaidDiagram
                                    chart={String(children).replace(/\n$/, "")}
                                />
                            );
                        }
                        return (
                            <code className={className} {...props}>
                                {children}
                            </code>
                        );
                    },
                }}
            >
                {body ?? ""}
            </Markdown>
        </Box>
    );
};
export default ContentBody;

import MermaidDiagram from "@/components/pages/contents/MermaidDiagram";
import {
    Box,
    CloseButton,
    Dialog,
    Portal,
    useMediaQuery,
    VisuallyHidden,
} from "@chakra-ui/react";
import { installCodeHighlightTheme } from "@/lib/codeHighlightTheme";
import rehypeImageArea from "@/lib/rehypeImageArea";
import { useEffect, useMemo, useRef, useState } from "react";
import Markdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

import "../../../assets/content_body.css";

interface Props {
    body: string | null;
    enableImageZoom?: boolean;
}

const ContentBody = ({ body, enableImageZoom = false }: Props) => {
    const [isDesktop] = useMediaQuery(["(min-width: 601px)"], { ssr: false });
    const [image, setImage] = useState<{
        src: string;
        alt: string;
        body: string | null;
    } | null>(null);
    const imageTriggerRef = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        installCodeHighlightTheme();
    }, []);

    useEffect(() => {
        const media = window.matchMedia("(min-width: 601px)");
        const closeOnMobile = (event: MediaQueryListEvent) => {
            if (!event.matches) setImage(null);
        };
        media.addEventListener("change", closeOnMobile);
        return () => media.removeEventListener("change", closeOnMobile);
    }, []);

    const components = useMemo<Components>(() => ({
        img({ node: _node, className, src, alt, ...props }) {
            if (
                !enableImageZoom ||
                !className?.split(" ").includes("image-area-image") ||
                !src
            ) {
                return <img className={className} src={src} alt={alt} {...props} />;
            }

            return (
                <button
                    type="button"
                    className="image-zoom-trigger"
                    disabled={!isDesktop}
                    aria-label={alt ? `${alt}を拡大表示` : "画像を拡大表示"}
                    onClick={(event) => {
                        imageTriggerRef.current = event.currentTarget;
                        setImage({ src, alt: alt ?? "", body });
                    }}
                >
                    <img className={className} src={src} alt={alt} {...props} />
                </button>
            );
        },
        code({ className, children, ...props }) {
            const language = /language-(\w+)/.exec(className ?? "")?.[1];
            if (language === "mermaid") {
                return (
                    <MermaidDiagram chart={String(children).replace(/\n$/, "")} />
                );
            }
            return (
                <code className={className} {...props}>
                    {children}
                </code>
            );
        },
    }), [body, enableImageZoom, isDesktop]);

    return (
        <>
            <Box className="content-body" my={8} lineHeight="1.9">
                <Markdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[
                        rehypeImageArea,
                        [rehypeHighlight, { ignoreMissing: true }],
                    ]}
                    components={components}
                >
                    {body ?? ""}
                </Markdown>
            </Box>
            <Dialog.Root
                open={isDesktop && image !== null && image.body === body}
                onOpenChange={({ open }) => {
                    if (!open) setImage(null);
                }}
                placement="center"
                finalFocusEl={() =>
                    imageTriggerRef.current?.disabled ? null : imageTriggerRef.current
                }
            >
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner padding="4">
                        <Dialog.Content width="auto" maxWidth="95vw" bg="bg.panel">
                            <VisuallyHidden>
                                <Dialog.Title>画像の拡大表示</Dialog.Title>
                            </VisuallyHidden>
                            <Dialog.Body padding="4">
                                {image && (
                                    <img
                                        src={image.src}
                                        alt={image.alt}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: "85vh",
                                            objectFit: "contain",
                                        }}
                                    />
                                )}
                            </Dialog.Body>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton aria-label="拡大画像を閉じる" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </>
    );
};
export default ContentBody;

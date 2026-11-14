import type { Element, Root, RootContent } from "hast";

const isBlank = (node: RootContent) =>
    node.type === "text" && node.value.trim() === "";

const isImageOnlyParagraph = (node: RootContent): node is Element =>
    node.type === "element" &&
    node.tagName === "p" &&
    node.children.some((c) => c.type === "element" && c.tagName === "img") &&
    node.children.every(
        (c) =>
            (c.type === "element" && c.tagName === "img") ||
            (c.type === "text" && c.value.trim() === "") ||
            (c.type === "element" && c.tagName === "br"),
    );

const collectImages = (p: Element): Element[] =>
    p.children.filter(
        (c): c is Element => c.type === "element" && c.tagName === "img",
    ).map((image) => ({
        ...image,
        properties: { ...image.properties, className: ["image-area-image"] },
    }));

/** 連続する画像のみの段落を <div class="image-area"> にまとめる */
const rehypeImageArea = () => (tree: Root) => {
    const result: RootContent[] = [];
    let images: Element[] | null = null;
    let pending: RootContent[] = [];

    const flush = () => {
        if (images) {
            result.push({
                type: "element",
                tagName: "div",
                properties: { className: ["image-area"] },
                children: images,
            });
        }
        result.push(...pending);
        images = null;
        pending = [];
    };

    for (const node of tree.children) {
        if (isImageOnlyParagraph(node)) {
            images = [...(images ?? []), ...collectImages(node)];
            pending = [];
        } else if (images && isBlank(node)) {
            pending.push(node);
        } else {
            flush();
            result.push(node);
        }
    }
    flush();
    tree.children = result;
};

export default rehypeImageArea;

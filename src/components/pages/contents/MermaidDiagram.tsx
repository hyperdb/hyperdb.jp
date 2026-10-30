import { Box } from "@chakra-ui/react";
import { useEffect, useId, useState } from "react";

interface Props {
    chart: string;
}

type RenderResult =
    | { chart: string; svg: string }
    | { chart: string; error: true };

const loadMermaid = async () => {
    const { default: mermaid } = await import("mermaid");
    mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "default",
    });
    return mermaid;
};

let mermaidPromise: ReturnType<typeof loadMermaid> | undefined;
const getMermaid = () => (mermaidPromise ??= loadMermaid());

const MermaidDiagram = ({ chart }: Props) => {
    const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
    const [result, setResult] = useState<RenderResult | null>(null);

    useEffect(() => {
        let isCurrent = true;

        void getMermaid()
            .then((mermaid) => mermaid.render(`mermaid-${id}`, chart))
            .then(({ svg: renderedSvg }) => {
                if (isCurrent) {
                    setResult({ chart, svg: renderedSvg });
                }
            })
            .catch((error: unknown) => {
                if (isCurrent) {
                    console.error("Mermaid図を描画できませんでした。", error);
                    setResult({ chart, error: true });
                }
            });

        return () => {
            isCurrent = false;
        };
    }, [chart, id]);

    if (result?.chart === chart && "error" in result) {
        return (
            <Box role="alert">
                <p>図を表示できませんでした。</p>
                <pre>
                    <code>{chart}</code>
                </pre>
            </Box>
        );
    }

    if (!result || result.chart !== chart || !("svg" in result)) {
        return <p role="status">図を描画しています...</p>;
    }

    return (
        <Box
            className="mermaid-diagram"
            role="img"
            aria-label="Mermaid図"
            dangerouslySetInnerHTML={{ __html: result.svg }}
        />
    );
};

export default MermaidDiagram;

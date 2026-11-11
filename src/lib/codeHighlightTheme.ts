// highlight.jsのテーマCSSをライト/ダーク別にスコープして注入する
const loaders = import.meta.glob("/node_modules/highlight.js/styles/*.css", {
    query: "?raw",
    import: "default",
}) as Record<string, () => Promise<string>>;

const DEFAULT_LIGHT = "github";
const DEFAULT_DARK = "github-dark";

function resolveTheme(name: string | undefined, fallback: string) {
    const key = `/node_modules/highlight.js/styles/${name?.trim()}.css`;
    if (name && key in loaders) return key;
    if (name) {
        console.warn(`未対応のコードハイライトテーマです: ${name}`);
    }
    return `/node_modules/highlight.js/styles/${fallback}.css`;
}

let installed = false;

export async function installCodeHighlightTheme() {
    if (installed) return;
    installed = true;
    const light = resolveTheme(
        import.meta.env.VITE_CODE_THEME_LIGHT,
        DEFAULT_LIGHT,
    );
    const dark = resolveTheme(
        import.meta.env.VITE_CODE_THEME_DARK,
        DEFAULT_DARK,
    );
    const [lightCss, darkCss] = await Promise.all([
        loaders[light](),
        loaders[dark](),
    ]);
    const style = document.createElement("style");
    style.dataset.codeHighlight = "";
    style.textContent = `.light .content-body{${lightCss}}\n.dark .content-body{${darkCss}}`;
    document.head.appendChild(style);
}

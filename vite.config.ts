import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react(),
        {
            name: "ogp-settings",
            generateBundle() {
                const settings = JSON.parse(
                    readFileSync(
                        new URL("./src/lib/settings.json", import.meta.url),
                        "utf8",
                    ),
                );
                this.emitFile({
                    type: "asset",
                    fileName: "ogp-settings.json",
                    source: JSON.stringify({
                        site: {
                            key: settings.site_info.key,
                            title: settings.site_info.title,
                            url: settings.site_info.url,
                            description: settings.site_info.description,
                            image: settings.site_info.image,
                            locale: settings.site_info.locale,
                            twitterCard: settings.site_info.twitterCard,
                        },
                        postType: settings.page_type.post,
                    }),
                });
            },
        },
    ],
    resolve: {
        tsconfigPaths: true,
    },
});

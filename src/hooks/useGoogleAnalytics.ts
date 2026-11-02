import { useEffect } from "react";
import { useLocation, useSearch } from "wouter";

const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;

let isConfigured = false;
let lastTrackedPage: string | undefined;

declare global {
    interface Window {
        dataLayer?: unknown[];
        gtag?: (...args: unknown[]) => void;
    }
}

export default function useGoogleAnalytics() {
    const [location] = useLocation();
    const search = useSearch();
    const pagePath = `${location}${search}`;

    useEffect(() => {
        if (!measurementId || isConfigured) return;

        window.dataLayer = window.dataLayer || [];
        // gtag.js は配列ではなく Arguments オブジェクトのみ処理するため arguments を積む
        window.gtag = function () {
            // eslint-disable-next-line prefer-rest-params
            window.dataLayer?.push(arguments);
        };
        window.gtag("js", new Date());
        window.gtag("config", measurementId, { send_page_view: false });

        const script = document.createElement("script");
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        script.dataset.googleAnalytics = "true";
        document.head.appendChild(script);

        isConfigured = true;
    }, []);

    useEffect(() => {
        if (!measurementId || !window.gtag || lastTrackedPage === pagePath) return;

        window.gtag("event", "page_view", {
            page_path: pagePath,
            page_location: `${window.location.origin}${pagePath}`,
            page_title: document.title,
        });
        lastTrackedPage = pagePath;
    }, [pagePath]);
}

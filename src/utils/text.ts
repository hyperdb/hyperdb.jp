/** 制御文字・ゼロ幅文字・双方向制御文字を除去する（改行とタブは`keepNewline`時のみ維持） */
export const sanitizeText = (value: string, keepNewline = false): string => {
    const normalized = value.normalize("NFC").replace(/\r\n?/g, "\n");
    const pattern = keepNewline
        ? /[\u0000-\u0008\u000B-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF\uFFF0-\uFFFF]/g
        : /[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u2069\uFEFF\uFFF0-\uFFFF]/g;
    return normalized.replace(pattern, "");
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (value: string): boolean =>
    value.length <= 254 && EMAIL_PATTERN.test(value);

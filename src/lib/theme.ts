import * as radix from "@radix-ui/colors";
import { createSystem, defaultConfig, defineConfig } from "@chakra-ui/react";

type Scales = Record<string, Record<string, string>>;

const scales = radix as unknown as Scales;

const DEFAULT_ACCENT = "blue";
const DEFAULT_GRAY = "slate";
const DEFAULT_COMPLEMENT = "orange";

// 9番(ソリッド)の上に置く文字色が黒になるスケール
const DARK_CONTRAST_SCALES = ["sky", "mint", "lime", "yellow", "amber"];

function resolveScale(name: string | undefined, fallback: string): string {
  const key = name?.trim().toLowerCase() || fallback;
  if (scales[key] && scales[`${key}Dark`]) return key;
  console.warn(`[theme] 未知のRadix Colors名です: "${name}" → "${fallback}" を使用します`);
  return fallback;
}

function step(name: string, n: number) {
  return {
    value: {
      base: scales[name][`${name}${n}`],
      _dark: scales[`${name}Dark`][`${name}${n}`],
    },
  };
}

function steps(name: string) {
  return Object.fromEntries(
    Array.from({ length: 12 }, (_, i) => [String(i + 1), step(name, i + 1)]),
  );
}

// Chakra UIのcolorPalette(solid/fg/muted等)とRadixの12段階を対応付ける
function palette(name: string) {
  const contrast = DARK_CONTRAST_SCALES.includes(name) ? "#000" : "#fff";
  return {
    ...steps(name),
    solid: step(name, 9),
    contrast: { value: contrast },
    fg: step(name, 11),
    muted: step(name, 4),
    subtle: step(name, 3),
    emphasized: step(name, 5),
    border: step(name, 7),
    focusRing: step(name, 8),
  };
}

const accent = resolveScale(import.meta.env.VITE_THEME_ACCENT, DEFAULT_ACCENT);
const gray = resolveScale(import.meta.env.VITE_THEME_GRAY, DEFAULT_GRAY);
const complement = resolveScale(
  import.meta.env.VITE_THEME_COMPLEMENT,
  DEFAULT_COMPLEMENT,
);

const config = defineConfig({
  theme: {
    semanticTokens: {
      colors: {
        accent: palette(accent),
        complement: palette(complement),
        gray: { ...palette(gray), solid: step(gray, 9) },
        bg: {
          DEFAULT: step(gray, 1),
          subtle: step(gray, 2),
          muted: step(gray, 3),
          emphasized: step(gray, 4),
          panel: step(gray, 2),
        },
        fg: {
          DEFAULT: step(gray, 12),
          muted: step(gray, 11),
          subtle: step(gray, 10),
        },
        border: {
          DEFAULT: step(gray, 6),
          muted: step(gray, 5),
          subtle: step(gray, 4),
          emphasized: step(gray, 7),
        },
      },
    },
  },
  globalCss: {
    ":root": {
      colorPalette: "accent",
    },
  },
});

export const system = createSystem(defaultConfig, config);

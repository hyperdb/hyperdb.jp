# hyperdb.jp

このリポジトリは個人サイト「hyperdb.jp」のソースコードを管理するためのものです。

## 技術スタック

- Vite 8
- React 19
- Chakra UI 3
- APIサイト
  - コンテンツ関連 `writers`（独自APIサイト）
  - 問い合わせ関連 `contacts`（独自APIサイト）

## Google Analytics

GA4の測定IDを`.env`に設定すると、ページ表示とSPA内のページ遷移を計測します。

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 配色テーマ

[Radix Colors](https://www.radix-ui.com/colors)のスケール名を`.env`に設定すると、サイトの配色を切り替えられます。未設定の場合は括弧内の値になります。ライト/ダークの両モードに対応します。

```env
VITE_THEME_ACCENT=blue        # アクセント色 (blue)
VITE_THEME_GRAY=slate         # グレー系 (slate)
VITE_THEME_COMPLEMENT=orange  # 補色系 (orange)
```

- Chakra UIでは`colorPalette="accent"` / `"complement"` / `"gray"`で参照します（既定は`accent`）。
- `accent.1`〜`accent.12`のようにRadixの12段階を直接指定することもできます。

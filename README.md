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

## コードハイライト

コンテンツ内のコードブロックは[highlight.js](https://highlightjs.org/examples)のテーマでハイライトされ、ライト/ダークに応じて切り替わります。テーマ名（`node_modules/highlight.js/styles`のCSS名）を`.env`で指定できます。未設定の場合は括弧内の値になります。

```env
VITE_CODE_THEME_LIGHT=github       # ライトモード (github)
VITE_CODE_THEME_DARK=github-dark   # ダークモード (github-dark)
```

## ブログ記事のOGP

S102の記事詳細は、PHPが初期HTMLに記事タイトルとOGPを出力します。説明文と画像はサイト共通の設定を使用します。JavaScriptを実行しないSNSのクローラーにも同じ情報が返ります。

1. PHP 8.1以上（cURL拡張あり）と、`.htaccess`の`mod_rewrite`が利用できる環境に、`pnpm build`で作成した`dist`の内容を配置します。
2. 公開ディレクトリにPHPから書き込める権限を設定し、初回は次のコマンドを実行します。PHP CLIの実行ファイルと公開ディレクトリのパスはサーバー環境に合わせてください。

   ```sh
   php /公開ディレクトリ/ogp-update.php
   ```

3. 同じコマンドをcronに登録し、1日1回実行します。例えば次の設定は毎日3時に実行します。パスは実際の環境に合わせ、ログは公開ディレクトリの外に保存してください。

   ```cron
   0 3 * * * /path/to/php /path/to/public/ogp-update.php >> /path/to/logs/ogp.log 2>&1
   ```

   標準出力・標準エラーのログを確認してください。終了コードが0以外の場合は更新失敗です。

バッチは公開記事一覧を取得し、`ogp-cache.json`を更新します。APIの取得に失敗した場合、以前のキャッシュは保持されます。デプロイ時はこのファイルを消さず、`ogp-settings.json`とPHPファイルをビルド成果物から更新してください。初回更新前や未収録の記事は、従来のSPA用HTMLが返ります。SNS側のキャッシュが更新されるまで、新しいOGPが反映されない場合があります。

ローカルでの検証: `php tests/ogp.php`。Vite開発サーバーはPHPや`.htaccess`を実行しないため、実際のレスポンスはPHP対応サーバーでも確認してください。

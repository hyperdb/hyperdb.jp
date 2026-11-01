# hyperdb.jp

このリポジトリは個人サイト「hyperdb.jp」のソースコードを管理するためのものです。

## 技術スタック

- Vite 8
- React 19
- Chakra UI 3
- APIサイト
  - コンテンツ関連 `writers`（独自APIサイト）

## Google Analytics

GA4の測定IDを`.env`に設定すると、ページ表示とSPA内のページ遷移を計測します。

```env
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

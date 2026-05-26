# EventStockMG

イベント備品の在庫管理アプリ（Next.js + Supabase）

## 開発サーバー

```bash
npm run dev
```

http://localhost:3010 を開いてください。

## 環境変数

`.env.local` に以下を設定します。

**ローカル開発**（従来どおり `NEXT_PUBLIC_*` でも動きます）

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

**本番・Docker などビルド済みイメージを複数環境で流す場合**

Next.js は `NEXT_PUBLIC_*` を `next build` 時にバンドルへ埋め込むため、ビルド後にだけ URL／キーを変えてもサーバー側の取得に反映されません。その場合はサーバー専用名でランタイム注入してください（`inventory-queries` / Server Action は `connection()` のあとにこれらを読みます）。

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
```

上記が未設定のときは、フォールバックとして `NEXT_PUBLIC_*` を使います。

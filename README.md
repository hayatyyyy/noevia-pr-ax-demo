# PR AX Studio — PoC Demo

ノエビア向けプレスリリースAX化 PoC（Phase 1）のUI/UX確認用デモです。

## デモURL

**https://hayatyyyy.github.io/noevia-pr-ax-demo/**

GitHub リポジトリ: https://github.com/hayatyyyy/noevia-pr-ax-demo

## 機能（Phase 1 PoC）

| 画面 | 内容 |
|------|------|
| ダッシュボード | 業務フロー概要・PoCスコープ |
| PR資産・型化 | エクセルブランドのタイトル型・訴求軸・配信済みPR一覧 |
| 新規PR作成 | 商品情報 → ターゲティング予測 → PR整理エージェント → 企画メモ |
| AIレビュー | 原稿の5段階スコアリング・改善提案 → **保存** |
| 保存PRリスト | ステータス・配信状況・媒体・効果・メモ、JSONエクスポート |

## ローカル確認

```bash
cd demo
python3 -m http.server 8080
# http://localhost:8080 を開く
```

## データ永続化（PoC → Phase 3）

| レイヤ | 実装 | 本番移行先 |
|--------|------|-----------|
| デモ | `localStorage`（`js/storage.js`） | — |
| スキーマ | `js/schema.js`（RAG chunk 自動生成） | Supabase `pr_records` 等 |
| エクスポート | JSON（媒体・効果・レビュー含む） | pgvector インデックス元 |

### PRレコード主要フィールド

- `status` — 下書き / レビュー済 / 承認済 / 配信済 / 掲載済
- `distribution` — 配信状況、媒体リスト（ステータス・URL・IMP）
- `performance` — 推定IMP、SNS反響、転載数、広告換算
- `ragMeta.chunkText` — RAG用テキスト（保存時に自動生成）

## 技術

- 静的 HTML / CSS / JavaScript（ビルド不要）
- モックデータ：`tokiwayakuhin.co.jp` ニュース一覧のエクセルPRを参考

## 注意

- AI応答はすべてモックです。本番では Claude API 等と連携します。
- デザインは常盤薬品工業コーポレートサイトのトンマナを参考にしています（PoCデモ用）。

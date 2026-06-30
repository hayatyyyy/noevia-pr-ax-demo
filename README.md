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

**重要:** `index.html` を Finder からダブルクリックで開く（`file://`）と **JavaScript が読み込めず**、画面が更新されません。必ずローカルサーバー経由で開いてください。

```bash
cd demo
chmod +x serve.sh   # 初回のみ
./serve.sh          # → http://localhost:8080/
```

または:

```bash
cd demo
python3 -m http.server 8080
# ブラウザで http://localhost:8080/ を開く
```

**更新確認:** ヘッダー右上に `v1.4` バッジが表示されていれば最新版です。キャッシュが残る場合は **Cmd+Shift+R**（スーパーリロード）してください。

**UX確認の入口:** 起動後は「PR作成」画面が最初に開きます。「体験デモを開始」で全ステップを約1分で確認できます。

## データ永続化（PoC → Phase 3）

| レイヤ | 実装 | 本番移行先 |
|--------|------|-----------|
| デモ | `localStorage`（`js/storage.js`） | — |
| スキーマ | `js/schema.js`（RAG chunk 自動生成） | Supabase `pr_records` 等 |
| エクスポート | JSON（媒体・効果・レビュー含む） | pgvector インデックス元 |

### PRレコード主要フィールド

- `status` — 下書き / レビュー済 / 承認済 / 配信済 / 掲載済
- `distribution` — 配信状況、媒体リスト（ステータス・URL・PR TIMES view）
- `performance` — PR TIMES view、SNS反響、転載数、広告換算
- `ragMeta.chunkText` — RAG用テキスト（保存時に自動生成）

## 技術

- 静的 HTML / CSS / JavaScript（ビルド不要）
- モックデータ：`tokiwayakuhin.co.jp` ニュース一覧のエクセルPRを参考

## 注意

- AI応答はすべてモックです。本番では Claude API 等と連携します。
- デザインは常盤薬品工業コーポレートサイトのトンマナを参考にしています（PoCデモ用）。

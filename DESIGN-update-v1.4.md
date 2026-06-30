# デザインアップデート案 v1.4 — 視認性・メリハリ強化

> 対象：PR AX デモ（広報担当 UX 確認用）  
> 参照：`DESIGN-tokiwayakuhin-co-jp.md`（常盤薬品工業コーポレート準拠）  
> 作成：2026-06-30

---

## 1. 現状の課題（デザイナー診断）

| # | 症状 | 原因 |
|---|------|------|
| A | パネル・フォーム・背景の境界が見えない | `--color-border: #f8f8f8` が背景 `#fff` / `#f8f8f8` とほぼ同色 |
| B | 入力欄が「枠のないテキスト」に見える | input border が border token と同色 |
| C | セカンダリボタンが背景に溶ける | `btn-secondary` の border も同色 |
| D | 一覧・表の行区切りが弱い | table / list の divider が同 token |
| E | 情報の階層（ページ > セクション > フィールド）がフラット | 表面レイヤーが1枚のみ |
| F | KPI・ステッパー・タグの状態差が弱い | アクセントはあるが面積が小さい |

**結論：** パレット自体はブランド準拠だが、**ボーダー token の設計ミス**により UI 全体のコントラストが失われている。色を増やすより **レイヤー構造 + ボーダー再定義** で解決可能。

---

## 2. デザイン方針（3原則）

1. **レイヤーで depth を作る** — 影は使わず、背景色の段差 + 明確な border（コーポレート flat 維持）
2. **アクセントは点ではなく面** — プライマリ `#e7382d` を CTA・active・左ライン・フォーカスに集中
3. **フォームは「入力可能」が一瞬で分かる** — 白フィールド + 可視 border + focus ring

---

## 3. Token 更新案

| Token | 現行 | 提案 | 用途 |
|-------|------|------|------|
| `--color-bg` | `#ffffff` | `#ffffff` | パネル・カード（elevated） |
| `--color-bg-canvas` | （なし） | `#f5f5f5` | ページ地（body） |
| `--color-bg-secondary` | `#f8f8f8` | `#f8f8f8` | セクション内サブ面 |
| `--color-bg-input` | （なし） | `#ffffff` | 入力欄背景 |
| `--color-border` | `#f8f8f8` | `#d4d4d4` | 通常 divider / input |
| `--color-border-strong` | （なし） | `#bdbdbd` | ヘッダー下線・表頭 |
| `--color-text` | `#565b62` | `#565b62` | 本文（維持） |
| `--color-text-heading` | （なし） | `#454a50` | 見出し（やや濃く） |
| `--color-primary-soft` | （なし） | `rgba(231,56,45,.08)` | 選択行・ハイライト面 |
| `--color-secondary-soft` | （なし） | `rgba(46,195,208,.12)` | ガイドバナー |

※ `#d4d4d4` は `#9a9da1` 系の明度を上げた実用 border。パレット外だが **テキスト secondary から導出** し、装飾色の追加ではない。

---

## 4. コンポーネント別仕様

### 4-1. ページ構造
```
[ Header #fff + border-strong ]
[ Canvas #f5f5f5 ]
  └ [ Panel #fff + border + radius 20px ]
       └ [ Section title + 左赤ライン 3px ]
       └ [ Form fields ]
```

### 4-2. フォーム
- ラベル：`font-weight 700`、`--color-text-heading`
- input / textarea / select：`bg #fff`、`border 1px solid --color-border`、`min-height 44px`
- `:focus`：`border-color --color-primary` + `box-shadow 0 0 0 3px primary-soft`
- placeholder：`--color-text-secondary`

### 4-3. ボタン
| 種別 | 背景 | 文字 | Border |
|------|------|------|--------|
| Primary | `#e7382d` | `#fff` | none |
| Secondary | `#fff` | `#565b62` | `1px #d4d4d4` |
| Active nav | transparent | `#e7382d` | bottom `2px #e7382d` |

### 4-4. 表・一覧
- thead：`background #f8f8f8`、`border-bottom 2px #d4d4d4`
- tbody tr：`border-bottom 1px #ececec`
- hover / selected：`background primary-soft`

### 4-5. KPI / ステッパー / フロー
- KPI カード：白面 + border、highlight 項目は左赤ライン + primary-soft 背景
- ステッパー active：赤下線 + `font-weight 700`
- フロー progress：active = 白面 + 赤文字 + border

### 4-6. タグ
- PR タグ：`primary-soft` 背景 + 赤文字（現行維持・border 追加）
- 型タグ：白 + border

---

## 5. デザイナーフィードバック（レビュー記録）

**レビュアー：** デザイナー視点チェック（ブランドガイド照合）  
**日付：** 2026-06-30

| ID | 観点 | コメント | 判定 |
|----|------|----------|------|
| D-01 | ブランド色維持 | `#e7382d` / `#565b62` / `#f8f8f8` は維持。新規色は border 実用値のみ | ✅ |
| D-02 | flat 維持 | box-shadow は focus ring のみ。カード影なし | ✅ |
| D-03 | 日本語可読性 | body 14px、line-height 1.75 維持 | ✅ |
| D-04 | フォーム視認性 | 白 field + `#d4d4d4` border で非 focus 時も識別可能 | ✅ |
| D-05 | 階層 | canvas / panel / section の3段 | ✅ |
| D-06 | CTA 優先度 | Primary 赤・Secondary 白枠で明確化 | ✅ |
| D-07 | 広報 UX | 装飾過多なし。業務画面として scannable | ✅ |
| D-08 | アクセシビリティ | UI コンポーネント境界 3:1 程度を border で確保 | ✅ |
| D-09 | コーポレート逸脱 | ダーク BG・純黒・バッジ乱用なし | ✅ |
| D-10 | 実装範囲 | CSS token + 既存 class 上書きのみ（HTML 変更不要） | ✅ |

**総合判定：カバレッジクリア — 実装 GO**

---

## 6. 実装スコープ

- [x] `:root` token 更新
- [x] body / header / main canvas
- [x] panel / panel-title / panel--secondary
- [x] form-grid / #detail-form inputs
- [x] btn-primary / btn-secondary
- [x] data-table / news-list dividers
- [x] kpi-row / flow-progress / stepper
- [x] filter-bar / scenario-banner / ux-guide-banner
- [x] version bump → v1.4

---

## 7. 確認手順（UX / デザイン QA）

1. http://localhost:8080/ — ヘッダー `v1.4` 表示
2. **PR作成** — 入力欄の枠が白背景上で見える
3. **原稿チェック** — 結果パネルと原稿エリアの境界
4. **PR一覧** — 表ヘッダー・行 hover・詳細フォーム
5. **過去PR参考** — 表・KPI カードの区切り

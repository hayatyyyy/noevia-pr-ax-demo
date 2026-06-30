/**
 * Mock data — sourced from tokiwayakuhin.co.jp topic list (Excel brand PRs)
 * Demo only. Not for production use.
 */
export const BRAND = {
  name: "エクセル",
  tone: "親しみやすく、具体的な数字・使用感を前面に。断定しすぎず、生活者のメリットを短い文で伝える。",
  forbidden: ["完全に治る", "シワが消える", "医学的効果", "No.1（根拠なし）"],
};

export const PR_PATTERNS = [
  {
    id: "release-day",
    label: "本日発売！型",
    description: "発売日当日の事実報告。商品名・特徴・価格・発売日を明確に。",
    examples: ["本日発売！『エクセル』から、大人気「朝用UVクリーム」のひんやりタイプが限定登場！"],
    frequency: 32,
  },
  {
    id: "numeric",
    label: "実績数値型",
    description: "売上・リピート率・累計本数などの数字でニュース性を担保。",
    examples: ["リニューアル発売初月の売上が旧品比220%と好調", "累計販売本数2,400万本突破"],
    frequency: 24,
  },
  {
    id: "limited",
    label: "限定・数量限定型",
    description: "期間・数量・チャネル限定で緊急性を演出。",
    examples: ["数量限定発売", "アインズ＆トルペ、公式EC限定", "ロフト、公式オンライン限定"],
    frequency: 18,
  },
  {
    id: "renewal",
    label: "リニューアル型",
    description: "進化ポイント（色・ツヤ・密着力等）を箇条書き的に列挙。",
    examples: ["色・ツヤ・密着力すべてをアップデート", "13年ぶりリニューアル"],
    frequency: 15,
  },
  {
    id: "collab",
    label: "コラボ・イベント型",
    description: "サロン・クリエイター・店舗とのコラボで話題性を付与。",
    examples: ["眉サロンと期間限定コラボ", "Makeup Creator“GYUTAE”プロデュースカラー"],
    frequency: 9,
  },
];

export const APPEAL_AXES = [
  { id: "benefit", label: "生活者ベネフィット", pct: 38 },
  { id: "season", label: "季節性・トレンド", pct: 22 },
  { id: "numeric", label: "実績・数値訴求", pct: 20 },
  { id: "texture", label: "使用感・テクスチャ", pct: 12 },
  { id: "collab", label: "コラボ・イベント", pct: 8 },
];

export const PAST_PRS = [
  {
    id: "pr-001",
    date: "2026-06-19",
    category: "プレスリリース",
    brand: "エクセル",
    title: "塗るほど眉が目立ってしまう悩みに。『エクセル』の新「ノーミス眉マスカラ」で、誰でも簡単にふんわり軽やかなニュアンス薄眉に",
    pattern: "renewal",
    appeal: "benefit",
    prtimesViews: 12400,
  },
  {
    id: "pr-002",
    date: "2026-06-10",
    category: "プレスリリース",
    brand: "エクセル",
    title: "『エクセル』、リニューアル発売初月の売上が旧品比220%と好調の「スキニーリッチシャドウ N」から新たに「透明感モーヴカラー」登場",
    pattern: "numeric",
    appeal: "numeric",
    prtimesViews: 18200,
  },
  {
    id: "pr-003",
    date: "2026-06-16",
    category: "お知らせ",
    brand: "エクセル",
    title: "本日発売！『エクセル』から、大人気「朝用UVクリーム」のひんやりタイプが限定登場！ 水分感たっぷりのジェルクリームで、夏場のメイクのりアップ",
    pattern: "release-day",
    appeal: "season",
    prtimesViews: 9800,
  },
  {
    id: "pr-004",
    date: "2026-03-27",
    category: "プレスリリース",
    brand: "エクセル",
    title: "『エクセル』が眉サロンと期間限定コラボ！眉WAX施術＋人気アイテム「ザ プライムアイブロウ」「スキニーリッチシャドウ」付きメイクレッスンを実施",
    pattern: "collab",
    appeal: "collab",
    prtimesViews: 7600,
  },
  {
    id: "pr-005",
    date: "2026-02-17",
    category: "プレスリリース",
    brand: "エクセル",
    title: "ロフト、公式オンライン限定！『エクセル』最高峰の美容液パウダーから、ピュアにきらめく肌を演出するクリアな #お砂糖パウダー限定登場！",
    pattern: "limited",
    appeal: "texture",
    prtimesViews: 11300,
  },
  {
    id: "pr-006",
    date: "2025-10-28",
    category: "お知らせ",
    brand: "エクセル",
    title: "本日発売！メイクアップブランド『エクセル』から、累計販売本数2,400万本突破！ ブランド内売上圧倒的1位の「パウダー＆ペンシル アイブロウＥＸ」13年ぶりリニューアルのご紹介",
    pattern: "numeric",
    appeal: "numeric",
    prtimesViews: 15600,
  },
  {
    id: "pr-007",
    date: "2026-03-30",
    category: "お知らせ",
    brand: "エクセル",
    title: "本日発売！『エクセル』から、大人気オールインワン美容液UV下地「モチベートユアスキン」新色登場！",
    pattern: "release-day",
    appeal: "benefit",
    prtimesViews: 14200,
    body: "血色感も透明感も叶うラベンダーピンクカラー。朝のメイク前に1本で下地〜UVケアまで完結。",
  },
  {
    id: "pr-008",
    date: "2026-02-16",
    category: "プレスリリース",
    brand: "エクセル",
    title: "ロフト、公式オンライン限定！『エクセル』最高峰の美容液パウダーから、クリアな #お砂糖パウダー限定登場！",
    pattern: "limited",
    appeal: "texture",
    prtimesViews: 11300,
    body: "SNSで話題の#お砂糖パウダーが限定カラーで再登場。ピュアにきらめく肌演出。",
  },
];

export const BRAND_STATS = {
  analyzedCount: 48,
  avgPrtimesViews: 12800,
  topPattern: "実績数値型",
  topAppeal: "生活者ベネフィット",
  period: "2024年1月〜2026年6月",
};

export const SAMPLE_PRODUCT = {
  name: "スキニーリッチシャドウ N",
  brand: "エクセル",
  category: "アイシャドウ（メイクアップ）",
  features: "4色パレット、保湿成分配合、発色・密着性、透明感モーヴカラー新色",
  price: "オープン価格（参考：1,650円税込）",
  releaseType: "新色追加",
  season: "夏〜初秋（透明感・くすみオフ訴求）",
  launchDate: "2026-07-15",
};

export const PRODUCT_PRESETS = [
  {
    id: "shadow-mauve",
    label: "【デモ】スキニーリッチシャドウ N — 透明感モーヴ新色",
    name: "スキニーリッチシャドウ N",
    brand: "エクセル",
    category: "アイシャドウ（メイクアップ）",
    features: "4色パレット、保湿成分配合、発色・密着性、透明感モーヴカラー新色",
    price: "オープン価格（参考：1,650円税込）",
    releaseType: "新色追加",
    season: "夏〜初秋（透明感・くすみオフ訴求）",
    launchDate: "2026-07-15",
  },
  {
    id: "brow-mascara",
    label: "【デモ】ノーミス眉マスカラ — 新規発売",
    name: "ノーミス眉マスカラ",
    brand: "エクセル",
    category: "眉メイク",
    features: "ふんわり軽やかな仕上がり、ニュアンス薄眉、落ちにくい処方",
    price: "オープン価格（参考：1,320円税込）",
    releaseType: "新規発売",
    season: "通年（眉メイクトレンド：薄眉・ニュアンス眉）",
    launchDate: "2026-06-19",
  },
  {
    id: "uv-cool",
    label: "【デモ】朝用UVクリーム — ひんやり限定",
    name: "朝用UVクリーム ひんやりタイプ",
    brand: "エクセル",
    category: "UV・ベースメイク",
    features: "ひんやり感触、水分感ジェル、夏のメイクのりアップ、SPF50+",
    price: "オープン価格（参考：1,430円税込）",
    releaseType: "限定発売",
    season: "夏季限定（6〜8月）",
    launchDate: "2026-06-16",
  },
];

export const MOCK_MEDIA_SUGGESTIONS = [
  { name: "@cosme", category: "Web美容メディア", reason: "20代向け新色・プチプラ訴求の掲載実績多数" },
  { name: "MAQUIA ONLINE", category: "Web美容メディア", reason: "夏コスメ特集との相性が高い" },
  { name: "美的", category: "美容誌", reason: "エクセル新色の定期掲載枠あり（7月号）" },
];

/** 外部情報収集・トレンド分析（追加提案）— 原稿作成前の盛り込みレコメンド */
export const MOCK_TREND_INSIGHTS = {
  fetchedAt: "2026-06-28",
  periodLabel: "直近7日間",
  summary:
    "商品の「モーヴカラー」「透明感」訴求と、SNS・TV・Webで注目されている美容トレンドに高い一致があります。チェックした項目は企画メモに反映されます。",
  sources: [
    { id: "sns", label: "X（SNS）", desc: "ハッシュタグ・投稿トレンド" },
    { id: "tv", label: "TV・情報番組", desc: "美容特集の放映予定" },
    { id: "web", label: "Web美容メディア", desc: "特集テーマ・成分トレンド" },
    { id: "competitor", label: "競合PR", desc: "PR TIMES等の配信動向" },
    { id: "search", label: "Google Trends", desc: "検索量の季節変化" },
  ],
  recommendations: [
    {
      id: "tr-sns-1",
      category: "sns",
      categoryLabel: "X",
      relevance: "high",
      headline: "Xでは「#透明感メイク」「#モーヴシャドウ」関連が盛り上がっています",
      detail:
        "直近7日で関連投稿が前週比+38%。20代女性のデイリーメイク・プチプラコスメ投稿が中心です。",
      suggestInclusion:
        "見出し・本文に「透明感」「くすみオフ」を含めると、SNS拡散・記事転載と相性が良い可能性があります。",
      matchedKeywords: ["透明感", "モーヴ", "夏メイク"],
    },
    {
      id: "tr-tv-1",
      category: "tv",
      categoryLabel: "TV",
      relevance: "high",
      headline:
        "「ラクロス！」7月特集で「夏の密着メイク」「崩れにくいアイメイク」が取り上げ予定",
      detail: "TVer番組表より。毎週水曜・美容特集枠で夏コスメ特集が続く見込みです。",
      suggestInclusion:
        "「メイク持ち」「崩れにくい発色」など季節キーワードを1文足すと、情報番組の切り口と接続しやすいです。",
      matchedKeywords: ["夏", "メイク持ち", "アイシャドウ"],
    },
    {
      id: "tr-web-1",
      category: "web",
      categoryLabel: "Webメディア",
      relevance: "medium",
      headline: "美的・MAQUIAの7月特集で「ヌードモーヴ」「多色パレット時短術」がトレンドワードに",
      detail: "両誌の7月号・Web特集予告より。1パレット完結・朝メイク時短が編集部の関心テーマです。",
      suggestInclusion:
        "「4色パレットで完結」「朝5分メイク」など時短訴求を切り口候補に加える価値があります。",
      matchedKeywords: ["時短", "4色", "ヌードモーヴ"],
    },
    {
      id: "tr-comp-1",
      category: "competitor",
      categoryLabel: "競合PR",
      relevance: "medium",
      headline: "競合ブランドが先週「夏限定シェード＋旧品比数値」のPRを配信し反応良好",
      detail: "PR TIMES上で同カテゴリの新色PRが3件。いずれも実績数値＋季節訴求の構成です。",
      suggestInclusion:
        "自社も「旧品比220%＋夏の透明感」の組み合わせは競合と同じ勝ち筋。差別化はモーヴの具体的仕上がり描写で。",
      matchedKeywords: ["実績数値", "新色", "夏"],
    },
    {
      id: "tr-search-1",
      category: "search",
      categoryLabel: "検索トレンド",
      relevance: "high",
      headline: "Google Trends：「アイシャドウ モーヴ」「くすみオフ メイク」が6月後半から上昇",
      detail: "検索量は昨年同時期比+22%。梅雨〜初夏の「肌トーン整え」需要と連動しています。",
      suggestInclusion:
        "「くすみオフ」「黄み肌に馴染む」など検索されやすいフレーズを本文に入れると、Web記事化後の流入も期待できます。",
      matchedKeywords: ["モーヴ", "くすみオフ"],
    },
  ],
};

export const MOCK_TARGETING = {
  mainTarget: "20〜35歳女性、デイリーメイク重視、プチプラ志向",
  subTarget: "40代・ナチュラルメイク志向、コスパ重視層",
  interests: ["時短メイク", "SNS映え", "くすみケア", "デパコスより身近なコスメ"],
  purchaseMotivation: ["季節の色変え", "プチプラで試したい", "口コミ・SNS発見"],
  keywords: ["透明感モーヴ", "4色パレット", "密着", "使い回し", "夏コスメ"],
  mediaCategories: ["Web美容メディア", "20〜30代向け女性誌", "Instagram・TikTok"],
  timing: "7月中旬（夏コスメ特集）、8月号の色見本特集",
  rationale:
    "エクセル過去PRは「実績数値型」「限定色追加型」が高反応。モーヴ系は2026年トレンド色。価格帯・カテゴリから20代中心のプチプラ層が主ターゲット。",
};

export const MOCK_PLANNING_MEMO = {
  angles: [
    {
      title: "実績×新色追加",
      headline: "旧品比220%好調の『スキニーリッチシャドウ N』から、透明感モーヴカラー新登場",
      appeal: "メイン：実績数値 / サブ：季節トレンド",
    },
    {
      title: "夏の透明感メイク",
      headline: "くすみオフ×透明感。1パレット4役の『エクセル』新作モーヴで夏メイクをアップデート",
      appeal: "メイン：生活者ベネフィット / サブ：使用感",
    },
    {
      title: "使い回し・時短訴求",
      headline: "朝5分メイクに。『エクセル』人気4色パレットに「抜け感モーヴ」が加わる",
      appeal: "メイン：時短・使い回し / サブ：プチプラ",
    },
  ],
  facts: [
    "リニューアル初月売上 旧品比220%",
    "4色パレット（ベース・主役・陰影・ラメ）",
    "保湿成分配合",
    "2026年7月15日発売",
    "参考価格 1,650円（税込）",
  ],
  cautions: [
    "「シワを消す」等の効能表現は不可（化粧品の範囲内表現に留める）",
    "「No.1」表記は調査根拠・期間の明記が必要",
    "旧品比220%は社内データのため、媒体により数値開示可否を確認",
  ],
  direction:
    "エクセル定番の「具体的数字＋使用シーン」構成。見出しは40字前後。本文は商品特徴→ベネフィット→発売情報の順。",
};

export const MOCK_REVIEW = {
  overall: 4,
  scores: [
    { label: "ニュース性", score: 4, comment: "旧品比220%の実績と新色追加の組み合わせで、媒体が取り上げる理由は明確。" },
    { label: "見出し化しやすさ", score: 5, comment: "数字・ブランド名・商品名が揃っており、記者が見出しを作りやすい。" },
    { label: "ターゲット整合性", score: 4, comment: "20〜35歳向けの透明感・プチプラ訴求と整合。40代向け補足は任意。" },
    { label: "商品特徴の伝わりやすさ", score: 3, comment: "モーヴカラーの具体的な使用イメージ（肌色別の仕上がり等）を1文追加すると改善。" },
    { label: "ブランドトーン", score: 5, comment: "エクセルらしい親しみやすさと具体性。トーンは問題なし。" },
    { label: "薬機法・景表法", score: 4, comment: "リスク表現なし。ただし「No.1」表記がある場合は根拠の明記を確認。" },
  ],
  suggestions: [
    {
      text: "「透明感モーヴ」の具体的な仕上がりイメージ（例：黄み肌にも馴染む）を1文追加",
      patch: {
        type: "insertAfter",
        find: "使い回せる。",
        insert: "黄み肌にも馴染むヌードモーヴの発色で、肌全体をやわらかく見せる仕上がり。",
      },
    },
    {
      text: "旧品比220%の数値は出典・期間を括弧書きで補足",
      patch: { type: "replace", find: "旧品比220%", replace: "旧品比220%（2026年5月、当社調べ）" },
    },
    {
      text: "夏コスメ特集向けに「メイク持ち」など季節キーワードを本文に含める",
      patch: {
        type: "insertAfter",
        find: "見せる仕上がり。",
        insert: "夏のメイク持ちにも配慮した、軽やかな発色設計。",
      },
    },
  ],
  risks: [],
};

/** 改善提案をすべて反映した原稿（デモ用） */
export const REVISED_DRAFT = `『エクセル』、リニューアル発売初月の売上が旧品比220%（2026年5月、当社調べ）と好調の「スキニーリッチシャドウ N」から、新たに"透明感モーヴカラー"を7月15日より全国発売。

4色パレットでベースから主役シャドウまで1つに。保湿成分を配合し、密着性と発色を両立。新色モーヴは夏のくすみオフ・透明感メイクに向き、デイリー使いからお出かけメイクまで使い回せる。黄み肌にも馴染むヌードモーヴの発色で、肌全体をやわらかく見せる仕上がり。夏のメイク持ちにも配慮した、軽やかな発色設計。

参考価格 1,650円（税込）。ドラッグストア・バラエティショップ・オンラインにて展開。`;

export const SAMPLE_DRAFT = `『エクセル』、リニューアル発売初月の売上が旧品比220%と好調の「スキニーリッチシャドウ N」から、新たに"透明感モーヴカラー"を7月15日より全国発売。

4色パレットでベースから主役シャドウまで1つに。保湿成分を配合し、密着性と発色を両立。新色モーヴは夏のくすみオフ・透明感メイクに向き、デイリー使いからお出かけメイクまで使い回せる。

参考価格 1,650円（税込）。ドラッグストア・バラエティショップ・オンラインにて展開。`;

export const AGENT_MESSAGES = [
  {
    role: "agent",
    text: "外部トレンドの確認結果も踏まえました。**透明感メイク**や**夏のメイク持ち**は今、SNS・TV・Webで注目されています。まず、**何が新しいか**を教えてください。色追加だけでなく、パレット構成や処方の変更はありますか？",
  },
  {
    role: "user",
    text: "色追加のみ。パレット構成・処方は前回リニューアル版と同じです。旧品比220%の実績を活かしたいです。",
  },
  {
    role: "agent",
    text: "了解です。配信済みPRを参照すると、エクセルでは**実績数値型**（旧品比220%）と**限定・新色型**の組み合わせが反応が良いパターンです。\n\n次に、**誰に届けたいか**は20〜35歳のデイリーメイク層で合っていますか？それとも既存ファン向けの訴求を強めますか？",
  },
  {
    role: "user",
    text: "20〜35歳中心。SNSでも見てもらえる切り口が欲しいです。",
  },
  {
    role: "agent",
    text: "では切り口候補を3案整理します。\n\n1. **実績×新色** — 旧品比220%の好調さ＋モーヴ新色\n2. **夏の透明感** — くすみオフ・透明感メイクの季節訴求\n3. **時短4色** — 1パレットで完結する朝メイク\n\n右側の「PR企画メモ」に詳細を出力しました。修正があればお知らせください。",
  },
];

/** 初期表示用シード — localStorage が空のとき投入 */
export const SEED_SAVED_PRS = [
  {
    id: "seed-pr-001",
    createdAt: "2026-06-10T09:00:00.000Z",
    updatedAt: "2026-06-18T14:30:00.000Z",
    status: "published",
    title: "『エクセル』スキニーリッチシャドウ N 透明感モーヴカラー新登場",
    product: {
      name: "スキニーリッチシャドウ N",
      brand: "エクセル",
      category: "アイシャドウ（メイクアップ）",
      releaseType: "新色追加",
    },
    targeting: MOCK_TARGETING,
    draft: {
      body: "『エクセル』、リニューアル発売初月の売上が旧品比220%と好調の「スキニーリッチシャドウ N」から、新たに「透明感モーヴカラー」登場。",
      headlineCandidates: ["旧品比220%好調の人気パレットにモーヴ新色"],
    },
    review: { overall: 4, reviewedAt: "2026-06-10T10:00:00.000Z" },
    distribution: {
      status: "published",
      scheduledDate: "2026-06-10",
      distributedAt: "2026-06-10",
      media: [
        {
          id: "m1",
          name: "@cosme",
          category: "Web美容メディア",
          contact: "press@cosme.net",
          status: "published",
          publishedUrl: "https://example.com/cosme/excel-mauve",
          publishedAt: "2026-06-12",
          prtimesViews: 18200,
          notes: "新色特集に掲載。画像使用可。",
        },
        {
          id: "m2",
          name: "MAQUIA ONLINE",
          category: "Web美容メディア",
          contact: "",
          status: "sent",
          publishedUrl: "",
          publishedAt: "",
          prtimesViews: null,
          notes: "6/15送付。返信待ち。",
        },
      ],
    },
    performance: { prtimesViews: 18200, snsMentions: 340, reprints: 5, adEquivalent: 450000 },
    memo: "旧品比220%の数値訴求が刺さった。次回も実績数値型を優先。",
    tags: ["エクセル", "アイシャドウ", "実績数値型", "夏コスメ"],
  },
  {
    id: "seed-pr-002",
    createdAt: "2026-06-19T11:00:00.000Z",
    updatedAt: "2026-06-20T09:00:00.000Z",
    status: "distributed",
    title: "『エクセル』ノーミス眉マスカラ — ニュアンス薄眉",
    product: {
      name: "ノーミス眉マスカラ",
      brand: "エクセル",
      category: "眉メイク",
      releaseType: "新規発売",
    },
    targeting: {
      mainTarget: "20〜30代女性、眉メイクに悩みがある層",
      keywords: ["薄眉", "ニュアンス眉", "時短"],
    },
    draft: {
      body: "塗るほど眉が目立ってしまう悩みに。『エクセル』の新「ノーミス眉マスカラ」で、誰でも簡単にふんわり軽やかなニュアンス薄眉に。",
      headlineCandidates: [],
    },
    review: { overall: 5, reviewedAt: "2026-06-19T12:00:00.000Z" },
    distribution: {
      status: "sent",
      scheduledDate: "2026-06-22",
      distributedAt: "2026-06-22",
      media: [
        {
          id: "m3",
          name: "美的",
          category: "美容誌",
          contact: "編集部",
          status: "candidate",
          publishedUrl: "",
          publishedAt: "",
          prtimesViews: null,
          notes: "7月号掲載候補。フォローアップ予定。",
        },
      ],
    },
    performance: { prtimesViews: null, snsMentions: 120, reprints: 0, adEquivalent: null },
    memo: "",
    tags: ["エクセル", "眉メイク", "新規発売"],
  },
  {
    id: "seed-pr-003",
    createdAt: "2026-06-01T08:00:00.000Z",
    updatedAt: "2026-06-05T16:00:00.000Z",
    status: "approved",
    title: "『エクセル』朝用UVクリーム ひんやりタイプ — 夏限定",
    product: {
      name: "朝用UVクリーム ひんやりタイプ",
      brand: "エクセル",
      category: "UV・ベースメイク",
      releaseType: "限定発売",
    },
    targeting: {
      mainTarget: "10〜30代女性、夏のメイク崩れ・ベタつきが気になる層",
      keywords: ["ひんやり", "UV", "メイクのり", "夏コスメ"],
    },
    draft: {
      body: "本日発売！『エクセル』から、大人気「朝用UVクリーム」のひんやりタイプが限定登場！",
      headlineCandidates: ["夏のメイクのりアップ。ひんやりUVが限定登場"],
    },
    review: { overall: 4, reviewedAt: "2026-06-01T09:00:00.000Z" },
    distribution: {
      status: "not_sent",
      scheduledDate: "2026-06-16",
      distributedAt: "",
      media: [
        {
          id: "m4",
          name: "VOCE WEB",
          category: "Web美容メディア",
          contact: "press@voice-web.jp",
          status: "not_sent",
          publishedUrl: "",
          publishedAt: "",
          prtimesViews: null,
          notes: "夏のUV特集に提案予定",
        },
      ],
    },
    performance: { prtimesViews: null, snsMentions: 0, reprints: 0, adEquivalent: null },
    memo: "承認済。6/16配信予定。限定型＋季節訴求の型を使用。",
    tags: ["エクセル", "UV", "限定発売", "夏コスメ"],
  },
];

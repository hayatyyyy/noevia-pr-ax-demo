/**
 * PR Record Schema — Phase 3 RAG / DB migration ready
 *
 * Future mapping:
 *   pr_records          → main table
 *   pr_media_outcomes   → distribution.media[]
 *   pr_review_logs      → review
 *   pr_embeddings       → ragMeta (pgvector)
 */

export const PR_STATUS = {
  DRAFT: "draft",
  REVIEWED: "reviewed",
  APPROVED: "approved",
  DISTRIBUTED: "distributed",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

export const PR_STATUS_LABELS = {
  draft: "下書き",
  reviewed: "レビュー済",
  approved: "承認済",
  distributed: "配信済",
  published: "掲載済",
  archived: "アーカイブ",
};

export const DISTRIBUTION_STATUS = {
  NOT_SENT: "not_sent",
  SENT: "sent",
  READ: "read",
  REPLIED: "replied",
  CANDIDATE: "candidate",
  PUBLISHED: "published",
  NO_RESPONSE: "no_response",
};

export const DISTRIBUTION_STATUS_LABELS = {
  not_sent: "未送付",
  sent: "送付済",
  read: "既読",
  replied: "返信あり",
  candidate: "掲載候補",
  published: "掲載済",
  no_response: "未反応",
};

export const MEDIA_CATEGORIES = [
  "美容誌",
  "Web美容メディア",
  "ライフスタイルメディア",
  "業界紙・専門媒体",
  "地方紙",
  "TV・情報番組",
  "SNS・インフルエンサー",
];

export const SCHEMA_VERSION = 1;

export function createEmptyMediaEntry() {
  return {
    id: crypto.randomUUID(),
    name: "",
    category: MEDIA_CATEGORIES[0],
    contact: "",
    status: DISTRIBUTION_STATUS.NOT_SENT,
    publishedUrl: "",
    publishedAt: "",
    estimatedImp: null,
    notes: "",
  };
}

export function buildRagChunkText(record) {
  const parts = [
    record.title && `タイトル: ${record.title}`,
    record.product?.brand && `ブランド: ${record.product.brand}`,
    record.product?.name && `商品: ${record.product.name}`,
    record.product?.category && `カテゴリ: ${record.product.category}`,
    record.draft?.body && `原稿:\n${record.draft.body}`,
    record.review?.overall != null && `レビュースコア: ${record.review.overall}/5`,
    record.targeting?.mainTarget && `ターゲット: ${record.targeting.mainTarget}`,
    record.targeting?.keywords?.length &&
      `キーワード: ${record.targeting.keywords.join(", ")}`,
    record.performance?.estimatedImp != null &&
      `推定IMP: ${record.performance.estimatedImp}`,
    record.memo && `メモ: ${record.memo}`,
  ].filter(Boolean);
  return parts.join("\n\n");
}

export function createPrRecord(partial = {}) {
  const now = new Date().toISOString();
  const record = {
    schemaVersion: SCHEMA_VERSION,
    id: partial.id || crypto.randomUUID(),
    createdAt: partial.createdAt || now,
    updatedAt: now,
    status: partial.status || PR_STATUS.REVIEWED,
    title: partial.title || "",
    product: partial.product || null,
    targeting: partial.targeting || null,
    planningMemo: partial.planningMemo || null,
    draft: partial.draft || { body: "", headlineCandidates: [] },
    review: partial.review || null,
    distribution: partial.distribution || {
      status: DISTRIBUTION_STATUS.NOT_SENT,
      scheduledDate: "",
      distributedAt: "",
      media: [],
    },
    performance: partial.performance || {
      estimatedImp: null,
      snsMentions: null,
      reprints: null,
      adEquivalent: null,
    },
    memo: partial.memo || "",
    tags: partial.tags || [],
    ragMeta: {
      embeddingReady: false,
      chunkText: "",
      lastIndexedAt: null,
    },
  };
  record.ragMeta.chunkText = buildRagChunkText(record);
  return record;
}

export function validatePrRecord(record) {
  if (!record.id || !record.createdAt) return false;
  if (!Object.values(PR_STATUS).includes(record.status)) return false;
  return true;
}

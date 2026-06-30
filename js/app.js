import {
  BRAND,
  BRAND_STATS,
  PR_PATTERNS,
  APPEAL_AXES,
  PAST_PRS,
  SAMPLE_PRODUCT,
  PRODUCT_PRESETS,
  DEMO_PRODUCT_URL,
  resolveProductFromUrl,
  MOCK_TARGETING,
  MOCK_PLANNING_MEMO,
  MOCK_REVIEW,
  MOCK_MEDIA_SUGGESTIONS,
  MOCK_TREND_INSIGHTS,
  SAMPLE_DRAFT,
  REVISED_DRAFT,
  AGENT_MESSAGES,
  SEED_SAVED_PRS,
} from "./data.js";
import {
  PR_STATUS,
  PR_STATUS_LABELS,
  DISTRIBUTION_STATUS,
  DISTRIBUTION_STATUS_LABELS,
  MEDIA_CATEGORIES,
  createEmptyMediaEntry,
  createPrRecord,
} from "./schema.js";
import {
  listRecords,
  getRecord,
  saveRecord,
  deleteRecord,
  exportRecordsJson,
  importRecordsJson,
  seedIfEmpty,
  getStorageStats,
} from "./storage.js";

const patternLabelMap = Object.fromEntries(PR_PATTERNS.map((p) => [p.id, p.label]));
const MOCK_DELAY = 600;
const CREATE_STEP_LABELS = ["商品情報", "読者・媒体", "外部トレンド", "切り口整理", "企画メモ"];
const CREATE_STEP_COUNT = CREATE_STEP_LABELS.length;

function getRecordPrtimesViews(record) {
  return record?.performance?.prtimesViews ?? record?.performance?.estimatedImp ?? null;
}

function getPastPrPrtimesViews(pr) {
  return pr.prtimesViews ?? pr.impressions ?? 0;
}

function getMediaPrtimesViews(media) {
  return media?.prtimesViews ?? media?.estimatedImp ?? null;
}

/* ── Navigation ── */
function switchView(viewId) {
  document.querySelectorAll(".view").forEach((v) => {
    const active = v.id === `view-${viewId}`;
    v.classList.toggle("is-active", active);
    v.hidden = !active;
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    const isActive = btn.dataset.view === viewId;
    btn.classList.toggle("is-active", isActive);
  });
  document.querySelector(".main-nav")?.classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  initView(viewId);
}

function initView(viewId) {
  switch (viewId) {
    case "guide":
      renderGuide();
      break;
    case "assets":
      renderAssets();
      if (!assetsBootstrapped && PAST_PRS.length > 0) {
        assetsBootstrapped = true;
        showPrDetail(PAST_PRS[0].id);
      }
      break;
    case "create":
      bootstrapCreateView();
      break;
    case "review":
      bootstrapReviewView();
      break;
    case "saved":
      renderSavedList(null, !savedBootstrapped);
      savedBootstrapped = true;
      break;
  }
}

function renderKpi(containerId, items) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items
    .map(
      (item) => `
    <div class="kpi-item${item.highlight ? " kpi-item--highlight" : ""}">
      <span class="kpi-item__value">${escapeHtml(item.value)}</span>
      <span class="kpi-item__label">${escapeHtml(item.label)}</span>
    </div>`
    )
    .join("");
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => switchView(btn.dataset.view));
});

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", () => {
    switchView(el.dataset.goto);
    if (el.dataset.startDemo === "true") {
      fillProductForm();
      currentSession.product = getProductFromForm();
      chatIndex = 0;
      runCreateDemoFlow(true);
    }
  });
});

document.querySelector("[data-view-link]")?.addEventListener("click", (e) => {
  e.preventDefault();
  switchView("create");
});

document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const btn = document.querySelector(".menu-toggle");
  const open = nav.classList.toggle("is-open");
  btn.setAttribute("aria-expanded", String(open));
});

/* ── Guide (home for PR staff) ── */
function renderGuide() {
  document.getElementById("dash-brand-name").textContent = BRAND.name;
  document.getElementById("dash-brand-tone").textContent = BRAND.tone;

  const list = document.getElementById("dash-pr-list");
  list.innerHTML = PAST_PRS.slice(0, 4)
    .map(
      (pr) => `
      <li>
        <time datetime="${pr.date}">${pr.date.replace(/-/g, "/")}</time>
        <span class="tag${pr.category === "プレスリリース" ? " tag--pr" : ""}">${escapeHtml(pr.category)}</span>
        <span class="news-list__title">${escapeHtml(pr.title)}</span>
      </li>`
    )
    .join("");
}

/* ── Assets ── */
function renderAssets() {
  renderKpi("assets-kpi", [
    { value: `${BRAND_STATS.analyzedCount}件`, label: "分析対象PR", highlight: true },
    { value: BRAND_STATS.topPattern, label: "最多タイトル型" },
    { value: `${BRAND_STATS.avgPrtimesViews.toLocaleString()}`, label: "平均 PR TIMES view" },
    { value: BRAND_STATS.period, label: "分析期間" },
  ]);

  document.getElementById("pr-count-label").textContent = `表示 ${PAST_PRS.length}件 / 分析 ${BRAND_STATS.analyzedCount}件`;

  document.getElementById("pattern-list").innerHTML = PR_PATTERNS.map(
    (p) => `
    <div class="pattern-item">
      <div class="pattern-item__header">
        <h4>${escapeHtml(p.label)}</h4>
        <span class="pattern-freq pattern-freq--strong">${p.frequency}%</span>
      </div>
      <p>${escapeHtml(p.description)}</p>
      <div class="pattern-example">${escapeHtml(p.examples[0])}</div>
    </div>`
  ).join("");

  document.getElementById("appeal-chart").innerHTML = APPEAL_AXES.map(
    (a, i) => `
    <div class="appeal-bar">
      <div class="appeal-bar__label">
        <span>${escapeHtml(a.label)}</span>
        <span class="appeal-bar__pct">${a.pct}%</span>
      </div>
      <div class="appeal-bar__track">
        <div class="appeal-bar__fill appeal-bar__fill--${i === 0 ? "primary" : "default"}" style="width: ${a.pct}%"></div>
      </div>
    </div>`
  ).join("");

  document.getElementById("pr-table-body").innerHTML = PAST_PRS.map(
    (pr) => `
    <tr class="pr-row" data-pr-id="${pr.id}" tabindex="0">
      <td>${pr.date.replace(/-/g, "/")}</td>
      <td><span class="tag ${pr.category === "プレスリリース" ? "tag--pr" : ""}">${pr.category}</span></td>
      <td class="pr-row__title">${escapeHtml(pr.title)}</td>
      <td><span class="tag tag--type">${escapeHtml(patternLabelMap[pr.pattern] || pr.pattern)}</span></td>
      <td class="num-cell">${getPastPrPrtimesViews(pr).toLocaleString()}</td>
    </tr>`
  ).join("");

  document.querySelectorAll(".pr-row").forEach((row) => {
    const open = () => showPrDetail(row.dataset.prId);
    row.addEventListener("click", open);
    row.addEventListener("keydown", (e) => {
      if (e.key === "Enter") open();
    });
  });

  document.getElementById("brand-tone-text").textContent = BRAND.tone;
  document.getElementById("brand-forbidden-list").innerHTML = BRAND.forbidden
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("");
}

function showPrDetail(id) {
  const pr = PAST_PRS.find((p) => p.id === id);
  if (!pr) return;
  const panel = document.getElementById("pr-detail-panel");
  panel.hidden = false;
  document.querySelectorAll(".pr-row").forEach((r) => {
    r.classList.toggle("is-selected", r.dataset.prId === id);
  });
  document.getElementById("pr-detail-content").innerHTML = `
    <dl class="detail-dl">
      <dt>日付</dt><dd>${pr.date.replace(/-/g, "/")}</dd>
      <dt>カテゴリ</dt><dd><span class="tag ${pr.category === "プレスリリース" ? "tag--pr" : ""}">${pr.category}</span></dd>
      <dt>タイトル型</dt><dd>${escapeHtml(patternLabelMap[pr.pattern])}</dd>
      <dt>PR TIMES view</dt><dd class="num-cell">${getPastPrPrtimesViews(pr).toLocaleString()}</dd>
      <dt>タイトル</dt><dd>${escapeHtml(pr.title)}</dd>
      ${pr.body ? `<dt>概要</dt><dd>${escapeHtml(pr.body)}</dd>` : ""}
    </dl>
    <p class="text-muted">※ 配信済みPRのサンプルデータです。PR作成時にAIが参照する「勝ちパターン」の元になります。</p>`;
  panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

let createBootstrapped = false;
let reviewBootstrapped = false;
let savedBootstrapped = false;
let assetsBootstrapped = false;

function updateFlowProgress(step) {
  document.querySelectorAll(".flow-progress__item").forEach((el) => {
    const s = Number(el.dataset.flowStep);
    el.classList.toggle("is-active", s === step);
    el.classList.toggle("is-done", s < step);
  });
}

function bootstrapCreateView() {
  fillProductForm();
  updateScenarioText();
  if (!createBootstrapped) {
    setStep(1);
    chatIndex = 0;
    createBootstrapped = true;
  }
  renderCreateKpi();
  updateFlowProgress(currentStep);
}

function renderCreateKpi() {
  const p = currentSession.product || SAMPLE_PRODUCT;
  renderKpi("create-kpi", [
    { value: p.name, label: "商品", highlight: true },
    { value: p.brand, label: "ブランド" },
    { value: CREATE_STEP_LABELS[currentStep - 1] || "—", label: `現在：${currentStep}/${CREATE_STEP_COUNT}` },
    { value: p.releaseType, label: "発売区分" },
  ]);
}

function bootstrapReviewView() {
  renderReviewMeta();
  renderKpi("review-kpi", [
    { value: "エクセル", label: "ブランド", highlight: true },
    { value: "スキニーリッチシャドウ N", label: "商品" },
    { value: "実績数値型", label: "参考PR型" },
    { value: reviewBootstrapped ? "チェック済" : "未チェック", label: "状態" },
  ]);
  updateFlowProgress(6);

  if (!reviewBootstrapped) {
    reviewBootstrapped = true;
    document.getElementById("draft-input").value = SAMPLE_DRAFT;
    runReviewMock(true);
  }
}

function renderReviewMeta() {
  const p = currentSession.product || SAMPLE_PRODUCT;
  const el = document.getElementById("review-meta");
  if (!el) return;
  el.innerHTML = `
    <dl class="meta-dl">
      <dt>商品</dt><dd>${escapeHtml(p.name)}（${escapeHtml(p.brand)}）</dd>
      <dt>想定媒体</dt><dd>${MOCK_MEDIA_SUGGESTIONS.map((m) => m.name).join("、")}</dd>
    </dl>`;
}

function populateProductPresets() {
  const sel = document.getElementById("product-preset");
  if (!sel) return;
  sel.innerHTML = PRODUCT_PRESETS.map(
    (p, i) => `<option value="${i}" ${i === 0 ? "selected" : ""}>${escapeHtml(p.label)}</option>`
  ).join("");
  sel.addEventListener("change", () => {
    applyPreset(Number(sel.value));
  });
}

function applyPreset(index) {
  const preset = PRODUCT_PRESETS[index];
  if (!preset) return;
  applyProductToForm(preset);
  renderCreateKpi();
  clearUrlFetchFeedback();
}

function applyProductToForm(product, { merge = false } = {}) {
  const form = document.getElementById("product-form");
  if (!form || !product) return;
  ["name", "brand", "category", "price", "releaseType", "season", "features"].forEach((key) => {
    const field = form.elements[key];
    if (!field || product[key] == null) return;
    if (merge && String(field.value).trim()) return;
    field.value = product[key];
  });
  currentSession.product = getProductFromForm();
  if (product.sourceUrl) {
    currentSession.product.sourceUrl = product.sourceUrl;
  }
  updateScenarioText();
}

function hasProductFormContent() {
  const form = document.getElementById("product-form");
  if (!form) return false;
  return ["name", "brand", "category", "price", "season", "features"].some((key) => {
    const field = form.elements[key];
    return field && String(field.value).trim();
  });
}

function clearUrlFetchFeedback() {
  const feedback = document.getElementById("url-fetch-feedback");
  if (feedback) feedback.hidden = true;
}

function showUrlFetchFeedback(type, message, details = "") {
  const feedback = document.getElementById("url-fetch-feedback");
  if (!feedback) return;
  feedback.hidden = false;
  feedback.className = `url-fetch-feedback url-fetch-feedback--${type}`;
  feedback.innerHTML = `
    <p class="url-fetch-feedback__message">${escapeHtml(message)}</p>
    ${details ? `<p class="url-fetch-feedback__detail text-muted">${escapeHtml(details)}</p>` : ""}`;
}

function fetchProductFromUrl() {
  const input = document.getElementById("product-url-input");
  const loading = document.getElementById("url-fetch-loading");
  const btn = document.getElementById("fetch-product-url-btn");
  if (!input || !loading) return;

  const url = input.value.trim();
  const resolved = resolveProductFromUrl(url);
  if (resolved.error) {
    showUrlFetchFeedback("error", resolved.error);
    return;
  }

  const applyFetch = (merge) => {
    applyProductToForm({ ...resolved.product, sourceUrl: resolved.sourceUrl }, { merge });
    const filled = Object.values(resolved.product).filter(Boolean).length;
    showUrlFetchFeedback(
      "success",
      `${filled}項目をフォームに反映しました`,
      `取得元：${resolved.sourceLabel}（デモ）— 内容は手入力で修正できます`
    );
    renderCreateKpi();
    document.getElementById("product-form")?.querySelector('[name="name"]')?.focus();
  };

  if (hasProductFormContent()) {
    const overwrite = window.confirm(
      "入力済みの項目があります。URLの情報で上書きしますか？\n\n「キャンセル」を選ぶと、空欄のみ補完します。"
    );
    applyFetch(!overwrite);
    return;
  }

  loading.hidden = false;
  if (btn) btn.disabled = true;
  clearUrlFetchFeedback();

  setTimeout(() => {
    loading.hidden = true;
    if (btn) btn.disabled = false;
    applyFetch(false);
  }, MOCK_DELAY);
}

function updateScenarioText() {
  const p = currentSession.product || SAMPLE_PRODUCT;
  const el = document.getElementById("scenario-text");
  if (el) {
    el.textContent = `${p.brand}「${p.name}」— ${p.releaseType}（${p.season}）のPRを作成します。`;
  }
}

function runCreateDemoFlow(full = true) {
  currentSession.product = getProductFromForm();
  currentSession.targeting = cloneTargeting(MOCK_TARGETING);
  currentSession.trendSelections = null;
  currentSession.planningMemo = MOCK_PLANNING_MEMO;
  setStep(2);
  showTargetingResult();
  renderCreateKpi();

  if (full) {
    setTimeout(() => {
      setStep(3);
      showTrendResult();
      renderCreateKpi();
    }, MOCK_DELAY);
    setTimeout(() => {
      setStep(4);
      renderAgentChatComplete();
      renderCreateKpi();
    }, MOCK_DELAY * 2);
    setTimeout(() => {
      renderPlanningMemo();
      setStep(5);
      renderCreateKpi();
    }, MOCK_DELAY * 3);
  }
}

function showTargetingResult() {
  const loading = document.getElementById("targeting-loading");
  const result = document.getElementById("targeting-result");
  const note = document.getElementById("targeting-save-note");
  loading.hidden = true;
  result.hidden = false;
  if (note) note.hidden = false;
  if (!currentSession.targeting) {
    currentSession.targeting = cloneTargeting(MOCK_TARGETING);
  }
  renderTargetingForm(currentSession.targeting);
  populateTargetingSidebar();
}

function populateTargetingSidebar() {
  document.getElementById("ref-patterns").innerHTML = PR_PATTERNS.filter((p) =>
    ["numeric", "limited"].includes(p.id)
  )
    .map((p) => `<li><strong>${escapeHtml(p.label)}</strong> — ${escapeHtml(p.description)}</li>`)
    .join("");
  document.getElementById("media-suggest-list").innerHTML = MOCK_MEDIA_SUGGESTIONS.map(
    (m) => `<li><strong>${escapeHtml(m.name)}</strong>（${escapeHtml(m.category)}）<br><span class="text-muted">${escapeHtml(m.reason)}</span></li>`
  ).join("");
}

function initDefaultTrendSelections() {
  currentSession.trendSelections = MOCK_TREND_INSIGHTS.recommendations
    .filter((r) => r.relevance === "high")
    .map((r) => r.id);
}

function getSelectedTrendRecommendations() {
  const ids = currentSession.trendSelections || [];
  return MOCK_TREND_INSIGHTS.recommendations.filter((r) => ids.includes(r.id));
}

function runTrendMock() {
  const loading = document.getElementById("trend-loading");
  const result = document.getElementById("trend-result");
  if (!loading || !result) return;
  if (!result.hidden) {
    if (!currentSession.trendSelections?.length) initDefaultTrendSelections();
    renderTrendRecommendations();
    populateTrendSidebar();
    return;
  }
  loading.hidden = false;
  result.hidden = true;

  setTimeout(() => {
    showTrendResult();
    renderCreateKpi();
  }, MOCK_DELAY);
}

function showTrendResult() {
  const loading = document.getElementById("trend-loading");
  const result = document.getElementById("trend-result");
  if (!result) return;
  if (loading) loading.hidden = true;
  result.hidden = false;
  if (!currentSession.trendSelections?.length) {
    initDefaultTrendSelections();
  }
  renderTrendRecommendations();
  populateTrendSidebar();
}

function populateTrendSidebar() {
  const list = document.getElementById("trend-sources-list");
  if (!list) return;
  list.innerHTML = MOCK_TREND_INSIGHTS.sources
    .map((s) => `<li><strong>${escapeHtml(s.label)}</strong><br><span class="text-muted">${escapeHtml(s.desc)}</span></li>`)
    .join("");
  const meta = document.getElementById("trend-meta");
  if (meta) {
    meta.textContent = `取得日：${MOCK_TREND_INSIGHTS.fetchedAt.replace(/-/g, "/")}（${MOCK_TREND_INSIGHTS.periodLabel}）`;
  }
}

function renderTrendRecommendations() {
  const summary = document.getElementById("trend-summary");
  const list = document.getElementById("trend-rec-list");
  const countEl = document.getElementById("trend-selected-count");
  if (!list) return;

  if (summary) summary.textContent = MOCK_TREND_INSIGHTS.summary;

  const selected = new Set(currentSession.trendSelections || []);
  list.innerHTML = MOCK_TREND_INSIGHTS.recommendations
    .map((r) => {
      const checked = selected.has(r.id);
      return `
    <li class="trend-rec-card trend-rec-card--${r.category}${checked ? " is-selected" : ""}">
      <label class="trend-rec-card__label">
        <input type="checkbox" class="trend-rec-card__check" data-trend-id="${r.id}" ${checked ? "checked" : ""} />
        <span class="trend-rec-card__body">
          <span class="trend-rec-card__meta">
            <span class="trend-badge trend-badge--${r.category}">${escapeHtml(r.categoryLabel)}</span>
            <span class="trend-relevance trend-relevance--${r.relevance}">${r.relevance === "high" ? "一致度：高" : "一致度：中"}</span>
          </span>
          <strong class="trend-rec-card__headline">${escapeHtml(r.headline)}</strong>
          <p class="trend-rec-card__detail">${escapeHtml(r.detail)}</p>
          <p class="trend-rec-card__suggest"><span class="trend-rec-card__suggest-label">盛り込み提案</span>${escapeHtml(r.suggestInclusion)}</p>
          <p class="trend-rec-card__keywords text-muted">商品との接点：${r.matchedKeywords.map((k) => `<span class="tag tag--soft">${escapeHtml(k)}</span>`).join(" ")}</p>
        </span>
      </label>
    </li>`;
    })
    .join("");

  list.querySelectorAll(".trend-rec-card__check").forEach((cb) => {
    cb.addEventListener("change", () => {
      saveTrendSelections();
      updateTrendSelectedCount();
      cb.closest(".trend-rec-card")?.classList.toggle("is-selected", cb.checked);
    });
  });

  updateTrendSelectedCount();
}

function saveTrendSelections() {
  const checked = document.querySelectorAll(".trend-rec-card__check:checked");
  currentSession.trendSelections = [...checked].map((el) => el.dataset.trendId);
}

function updateTrendSelectedCount() {
  const countEl = document.getElementById("trend-selected-count");
  if (!countEl) return;
  const n = currentSession.trendSelections?.length || 0;
  countEl.textContent = `${n}件を企画に盛り込み`;
}

function cloneTargeting(t) {
  return {
    mainTarget: t.mainTarget || "",
    subTarget: t.subTarget || "",
    interests: [...(t.interests || [])],
    purchaseMotivation: [...(t.purchaseMotivation || [])],
    keywords: [...(t.keywords || [])],
    mediaCategories: [...(t.mediaCategories || [])],
    timing: t.timing || "",
    rationale: t.rationale || "",
  };
}

function linesToArray(str) {
  return String(str)
    .split(/\n/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function arrayToLines(arr) {
  return (arr || []).join("\n");
}

function stringToKeywords(str) {
  return String(str)
    .split(/[、,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function keywordsToString(arr) {
  return (arr || []).join("、");
}

function renderTargetingForm(targeting) {
  const t = cloneTargeting(targeting);
  const result = document.getElementById("targeting-result");
  result.innerHTML = `
    <form id="targeting-form" class="targeting-form">
      <p class="targeting-form__hint">AI が整理した読者・媒体像です。広報担当者が内容を直接編集できます。</p>
      <div class="form-grid">
        <label class="full-width">
          届けたい読者
          <textarea name="mainTarget" rows="2" required>${escapeHtml(t.mainTarget)}</textarea>
        </label>
        <label class="full-width">
          サブ読者
          <textarea name="subTarget" rows="2">${escapeHtml(t.subTarget)}</textarea>
        </label>
        <label class="full-width">
          関心テーマ
          <span class="field-hint">1行に1項目</span>
          <textarea name="interests" rows="4">${escapeHtml(arrayToLines(t.interests))}</textarea>
        </label>
        <label class="full-width">
          購買動機
          <span class="field-hint">1行に1項目</span>
          <textarea name="purchaseMotivation" rows="3">${escapeHtml(arrayToLines(t.purchaseMotivation))}</textarea>
        </label>
        <label class="full-width">
          訴求キーワード
          <span class="field-hint">読点（、）または改行で区切り</span>
          <input type="text" name="keywords" value="${escapeAttr(keywordsToString(t.keywords))}" />
        </label>
        <label class="full-width">
          相性のいい媒体カテゴリ
          <span class="field-hint">1行に1項目</span>
          <textarea name="mediaCategories" rows="3">${escapeHtml(arrayToLines(t.mediaCategories))}</textarea>
        </label>
        <label class="full-width">
          配信タイミング推奨
          <input type="text" name="timing" value="${escapeAttr(t.timing)}" />
        </label>
        <label class="full-width rationale-field">
          予測の根拠（メモ）
          <textarea name="rationale" rows="4">${escapeHtml(t.rationale)}</textarea>
        </label>
      </div>
    </form>`;
  bindTargetingForm();
}

function readTargetingForm() {
  const form = document.getElementById("targeting-form");
  if (!form) return currentSession.targeting || cloneTargeting(MOCK_TARGETING);
  return {
    mainTarget: form.elements.mainTarget.value.trim(),
    subTarget: form.elements.subTarget.value.trim(),
    interests: linesToArray(form.elements.interests.value),
    purchaseMotivation: linesToArray(form.elements.purchaseMotivation.value),
    keywords: stringToKeywords(form.elements.keywords.value),
    mediaCategories: linesToArray(form.elements.mediaCategories.value),
    timing: form.elements.timing.value.trim(),
    rationale: form.elements.rationale.value.trim(),
  };
}

function saveTargetingFromForm() {
  currentSession.targeting = readTargetingForm();
  return currentSession.targeting;
}

function bindTargetingForm() {
  const form = document.getElementById("targeting-form");
  if (!form) return;
  form.addEventListener("input", () => {
    currentSession.targeting = readTargetingForm();
  });
  form.addEventListener("submit", (e) => e.preventDefault());
}

function renderAgentChatComplete() {
  chatIndex = AGENT_MESSAGES.length;
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  AGENT_MESSAGES.forEach((msg) => appendBubble(container, msg));
  document.getElementById("memo-preview").hidden = false;
  document.getElementById("memo-preview").innerHTML = renderMemoPreviewShort();
}

function renderMemoPreviewShort() {
  const m = MOCK_PLANNING_MEMO;
  const trendN = getSelectedTrendRecommendations().length;
  const trendNote =
    trendN > 0
      ? `<p class="memo-preview__trend text-muted">外部トレンド <strong>${trendN}件</strong> を盛り込み予定</p>`
      : "";
  return `
    <h3 class="panel-title">PR企画メモ（プレビュー）</h3>
    ${trendNote}
    <p class="memo-preview__lead">切り口候補 <strong>${m.angles.length}案</strong> を整理済み</p>
    <ol class="memo-preview__list">${m.angles.map((a) => `<li>${escapeHtml(a.title)}</li>`).join("")}</ol>`;
}
let currentStep = 1;
let chatIndex = 0;
let chatTimer = null;
let currentSession = {
  product: null,
  targeting: null,
  trendSelections: null,
  planningMemo: null,
};
let lastReviewResult = null;
let suggestionsApplied = false;
let selectedRecordId = null;

function suggestionText(s) {
  return typeof s === "string" ? s : s.text;
}

function applySuggestionPatches(draft, suggestions) {
  let text = draft;
  for (const s of suggestions) {
    if (typeof s === "string" || !s.patch) continue;
    const p = s.patch;
    if (p.type === "insertAfter" && text.includes(p.find)) {
      text = text.replace(p.find, p.find + p.insert);
    } else if (p.type === "replace" && text.includes(p.find)) {
      text = text.replace(p.find, p.replace);
    } else if (p.type === "append") {
      text = `${text.trimEnd()}\n\n${p.insert}`;
    }
  }
  return text;
}

function renderDraftSuggestions(review) {
  const panel = document.getElementById("draft-suggestions-panel");
  const list = document.getElementById("draft-suggestions-list");
  const feedback = document.getElementById("draft-suggestions-feedback");
  const applyBtn = document.getElementById("apply-suggestions-btn");
  if (!panel || !list) return;

  const items = review?.suggestions || [];
  if (items.length === 0) {
    panel.hidden = true;
    return;
  }

  list.innerHTML = items
    .map(
      (s, i) => `
    <li class="draft-suggestion-item${suggestionsApplied ? " is-applied" : ""}">
      <span class="draft-suggestion-item__num">${i + 1}</span>
      <span class="draft-suggestion-item__text">${escapeHtml(suggestionText(s))}</span>
    </li>`
    )
    .join("");

  panel.hidden = false;
  feedback.hidden = true;
  if (applyBtn) {
    applyBtn.disabled = suggestionsApplied;
    applyBtn.textContent = suggestionsApplied ? "反映済み" : "提案を原稿に反映";
  }
}

function applySuggestionsToDraft() {
  const textarea = document.getElementById("draft-input");
  const review = lastReviewResult || MOCK_REVIEW;
  const current = textarea.value;
  let revised = applySuggestionPatches(current, review.suggestions);
  if (revised === current && current.trim() === SAMPLE_DRAFT.trim()) {
    revised = REVISED_DRAFT;
  } else if (revised === current) {
    alert("提案を自動反映できませんでした。改善提案を参考に手動で修正してください。");
    return;
  }

  textarea.value = revised;
  suggestionsApplied = true;
  renderDraftSuggestions(review);

  const feedback = document.getElementById("draft-suggestions-feedback");
  if (feedback) {
    feedback.hidden = false;
    feedback.textContent = `${review.suggestions.length}件の提案を原稿に反映しました`;
    feedback.className = "draft-suggestions-feedback is-success";
  }

  textarea.focus();
  textarea.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function setStep(step) {
  currentStep = step;
  document.querySelectorAll(".create-step").forEach((el) => {
    const s = Number(el.dataset.step);
    el.hidden = s !== step;
    el.classList.toggle("is-active", s === step);
  });
  document.querySelectorAll(".stepper-item").forEach((el) => {
    const s = Number(el.dataset.step);
    el.classList.toggle("is-active", s === step);
    el.classList.toggle("is-done", s < step);
  });
  if (document.getElementById("view-create")?.classList.contains("is-active")) {
    renderCreateKpi();
    updateFlowProgress(step);
  }
  if (step === 2 && !document.getElementById("targeting-result")?.hidden) {
    saveTargetingFromForm();
    renderTargetingForm(currentSession.targeting || cloneTargeting(MOCK_TARGETING));
  }
}

function fillProductForm() {
  applyProductToForm(SAMPLE_PRODUCT);
}

document.getElementById("fetch-product-url-btn")?.addEventListener("click", () => {
  fetchProductFromUrl();
});

document.getElementById("fill-demo-url-btn")?.addEventListener("click", () => {
  const input = document.getElementById("product-url-input");
  if (input) input.value = DEMO_PRODUCT_URL;
  clearUrlFetchFeedback();
});

document.getElementById("product-url-input")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    fetchProductFromUrl();
  }
});

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  currentSession.product = getProductFromForm();
  currentSession.targeting = null;
  currentSession.trendSelections = null;
  currentSession.planningMemo = null;
  chatIndex = 0;
  setStep(2);
  runTargetingMock();
  renderCreateKpi();
});

document.getElementById("demo-run-create-btn")?.addEventListener("click", () => {
  fillProductForm();
  currentSession.product = getProductFromForm();
  chatIndex = 0;
  runCreateDemoFlow(true);
});

function getProductFromForm() {
  const form = document.getElementById("product-form");
  const product = {
    name: form.elements.name.value,
    brand: form.elements.brand.value,
    category: form.elements.category.value,
    price: form.elements.price.value,
    releaseType: form.elements.releaseType.value,
    season: form.elements.season.value,
    features: form.elements.features.value,
  };
  const urlInput = document.getElementById("product-url-input");
  if (urlInput?.value.trim()) {
    product.sourceUrl = urlInput.value.trim();
  }
  return product;
}

function runTargetingMock() {
  const loading = document.getElementById("targeting-loading");
  const result = document.getElementById("targeting-result");
  loading.hidden = false;
  result.hidden = true;

  setTimeout(() => {
    loading.hidden = true;
    result.hidden = false;
    document.getElementById("targeting-save-note").hidden = false;
    currentSession.targeting = cloneTargeting(MOCK_TARGETING);
    renderTargetingForm(currentSession.targeting);
    populateTargetingSidebar();
    renderCreateKpi();
  }, MOCK_DELAY);
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = Number(btn.dataset.next);
    if (currentStep === 2) saveTargetingFromForm();
    if (currentStep === 3) saveTrendSelections();
    setStep(step);
    renderCreateKpi();
    if (step === 3) runTrendMock();
    if (step === 4) startAgentChat();
  });
});

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => {
    if (currentStep === 2) saveTargetingFromForm();
    setStep(Number(btn.dataset.back));
    renderCreateKpi();
  });
});

document.querySelectorAll(".stepper-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = Number(btn.dataset.step);
    if (currentStep === 2 && step !== 2) saveTargetingFromForm();
    if (currentStep === 3 && step !== 3) saveTrendSelections();
    if (step <= currentStep || step === 1) {
      setStep(step);
      if (step === 3 && document.getElementById("trend-result")?.hidden) runTrendMock();
      if (step === 4 && chatIndex === 0) startAgentChat();
      if (step === 5) renderPlanningMemo();
    }
  });
});

function startAgentChat() {
  if (chatIndex > 0) return;
  const container = document.getElementById("chat-messages");
  container.innerHTML = "";
  chatIndex = 0;
  playNextMessage(container);
}

function playNextMessage(container) {
  if (chatIndex >= AGENT_MESSAGES.length) return;
  const msg = AGENT_MESSAGES[chatIndex];
  const delay = chatIndex === 0 ? 400 : msg.role === "agent" ? 900 : 300;

  chatTimer = setTimeout(() => {
    appendBubble(container, msg);
    chatIndex += 1;
    if (chatIndex < AGENT_MESSAGES.length) {
      playNextMessage(container);
    } else {
      document.getElementById("memo-preview").hidden = false;
      document.getElementById("memo-preview").innerHTML = renderMemoPreviewShort();
    }
  }, delay);
}

function appendBubble(container, msg) {
  const div = document.createElement("div");
  div.className = `chat-bubble chat-bubble--${msg.role}`;
  div.innerHTML = formatMarkdown(msg.text);
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
}

document.getElementById("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = e.target.querySelector("input");
  const text = input.value.trim();
  if (!text) return;
  const container = document.getElementById("chat-messages");
  appendBubble(container, { role: "user", text });
  input.value = "";
  setTimeout(() => {
    appendBubble(container, {
      role: "agent",
      text: "ありがとうございます。デモ版では固定の企画メモを出力します。「企画メモを表示」ボタンで詳細をご確認ください。",
    });
  }, 600);
});

document.getElementById("show-memo-btn").addEventListener("click", () => {
  saveTrendSelections();
  renderPlanningMemo();
  setStep(5);
});

function renderPlanningMemo() {
  currentSession.planningMemo = MOCK_PLANNING_MEMO;
  const m = MOCK_PLANNING_MEMO;
  const trends = getSelectedTrendRecommendations();
  const trendSection =
    trends.length > 0
      ? `
    <div class="memo-section">
      <h4>外部トレンドから盛り込む要素</h4>
      <ul class="memo-list trend-memo-list">
        ${trends
          .map(
            (t) =>
              `<li><strong>${escapeHtml(t.categoryLabel)}</strong> — ${escapeHtml(t.suggestInclusion)}</li>`
          )
          .join("")}
      </ul>
    </div>`
      : "";

  document.getElementById("planning-memo").innerHTML = `
    <h3 class="panel-title">PR企画メモ</h3>

    <div class="memo-section">
      <h4>PRの切り口候補</h4>
      ${m.angles
        .map(
          (a) => `
        <div class="angle-card">
          <h5>${escapeHtml(a.title)}</h5>
          <p class="headline">${escapeHtml(a.headline)}</p>
          <p class="appeal">${escapeHtml(a.appeal)}</p>
        </div>`
        )
        .join("")}
    </div>

    ${trendSection}

    <div class="memo-section">
      <h4>入れるべき事実情報</h4>
      <ul class="memo-list">${m.facts.map((f) => `<li>${escapeHtml(f)}</li>`).join("")}</ul>
    </div>

    <div class="memo-section">
      <h4>注意すべき表現</h4>
      <ul class="memo-list caution-list">${m.cautions.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
    </div>

    <div class="memo-section">
      <h4>原稿ドラフトの方向性</h4>
      <p>${escapeHtml(m.direction)}</p>
    </div>`;
}

document.querySelector("[data-goto-review]")?.addEventListener("click", () => {
  document.getElementById("draft-input").value = SAMPLE_DRAFT;
  switchView("review");
});

/* ── Review ── */
document.getElementById("load-sample-draft").addEventListener("click", () => {
  document.getElementById("draft-input").value = SAMPLE_DRAFT;
  suggestionsApplied = false;
  document.getElementById("draft-suggestions-panel").hidden = true;
});

document.getElementById("apply-suggestions-btn")?.addEventListener("click", () => {
  applySuggestionsToDraft();
});

document.getElementById("run-review-btn").addEventListener("click", () => {
  const draft = document.getElementById("draft-input").value.trim();
  if (!draft) {
    alert("原稿を入力するか、サンプル原稿を読み込んでください。");
    return;
  }
  runReviewMock();
});

function runReviewMock(silent = false) {
  const panel = document.getElementById("review-result-panel");
  const loading = document.getElementById("review-loading");
  const result = document.getElementById("review-result");
  const savePanel = document.getElementById("save-panel");
  panel.hidden = false;
  loading.hidden = false;
  result.innerHTML = "";
  savePanel.hidden = true;
  suggestionsApplied = false;
  document.getElementById("draft-suggestions-panel").hidden = true;

  setTimeout(() => {
    loading.hidden = true;
    lastReviewResult = {
      ...MOCK_REVIEW,
      reviewedAt: new Date().toISOString(),
    };
    result.innerHTML = renderReview(lastReviewResult);
    renderDraftSuggestions(lastReviewResult);
    showSavePanel();
    renderKpi("review-kpi", [
      { value: "エクセル", label: "ブランド" },
      { value: `${MOCK_REVIEW.overall}/5`, label: "総合スコア", highlight: true },
      { value: `${MOCK_REVIEW.suggestions.length}件`, label: "改善提案" },
      { value: "チェック済", label: "状態" },
    ]);
    if (!silent) reviewBootstrapped = true;
  }, MOCK_DELAY);
}

function showSavePanel() {
  const savePanel = document.getElementById("save-panel");
  const form = document.getElementById("save-pr-form");
  const draft = document.getElementById("draft-input").value.trim();
  const titleField = form.elements.title;
  if (!titleField.value) {
    titleField.value = draft.split("\n")[0].slice(0, 80);
  }
  if (!form.elements.scheduledDate.value) {
    form.elements.scheduledDate.value = "2026-07-15";
  }
  if (!form.elements.memo.value) {
    form.elements.memo.value = "旧品比220%の数値訴求を活かす。夏コスメ特集向けに@cosme・MAQUIAへ配信予定。";
  }
  savePanel.hidden = false;
  document.getElementById("save-feedback").hidden = true;
}

function renderReview(r) {
  const scoreLabel =
    r.overall >= 4 ? "配信可能（軽微な修正推奨）" : r.overall >= 3 ? "修正後に再レビュー推奨" : "要修正";

  return `
    <div class="overall-score">
      <div class="score-circle" aria-label="総合スコア ${r.overall}">${r.overall}</div>
      <div>
        <div class="score-label">総合評価</div>
        <p class="text-muted">${scoreLabel}</p>
      </div>
    </div>

    <div class="review-scores">
      ${r.scores
        .map(
          (s) => `
        <div class="review-score-item">
          <div class="review-score-item__header">
            <span class="review-score-item__label">${escapeHtml(s.label)}</span>
            <div class="score-dots">${renderDots(s.score)}</div>
          </div>
          <p>${escapeHtml(s.comment)}</p>
        </div>`
        )
        .join("")}
    </div>

    <div class="suggestions-box">
      <h4>改善提案</h4>
      <ol>${r.suggestions.map((s) => `<li>${escapeHtml(suggestionText(s))}</li>`).join("")}</ol>
      <p class="text-muted suggestions-box__note">左の原稿入力欄の下から「提案を原稿に反映」できます。</p>
    </div>`;
}

function renderDots(score) {
  return Array.from({ length: 5 }, (_, i) =>
    `<span class="score-dot ${i < score ? "is-filled" : ""}"></span>`
  ).join("");
}

/* ── Save after review ── */
function populateStatusSelects() {
  const statusSelect = document.getElementById("save-status-select");
  const distSelect = document.getElementById("save-distribution-select");
  const filterSelect = document.getElementById("saved-filter-status");

  statusSelect.innerHTML = Object.entries(PR_STATUS_LABELS)
    .map(([k, v]) => `<option value="${k}" ${k === PR_STATUS.REVIEWED ? "selected" : ""}>${v}</option>`)
    .join("");

  distSelect.innerHTML = Object.entries(DISTRIBUTION_STATUS_LABELS)
    .map(([k, v]) => `<option value="${k}" ${k === DISTRIBUTION_STATUS.NOT_SENT ? "selected" : ""}>${v}</option>`)
    .join("");

  filterSelect.innerHTML =
    `<option value="">すべて</option>` +
    Object.entries(PR_STATUS_LABELS)
      .map(([k, v]) => `<option value="${k}">${v}</option>`)
      .join("");
}

document.getElementById("save-pr-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const form = e.target;
  const draftBody = document.getElementById("draft-input").value.trim();
  const product = currentSession.product || SAMPLE_PRODUCT;

  const record = createPrRecord({
    status: form.elements.status.value,
    title: form.elements.title.value.trim(),
    product,
    targeting: currentSession.targeting || MOCK_TARGETING,
    planningMemo: currentSession.planningMemo,
    draft: {
      body: draftBody,
      headlineCandidates: currentSession.planningMemo?.angles?.map((a) => a.headline) || [],
    },
    review: lastReviewResult,
    distribution: {
      status: form.elements.distributionStatus.value,
      scheduledDate: form.elements.scheduledDate.value,
      distributedAt: "",
      media: [],
    },
    memo: form.elements.memo.value.trim(),
    tags: [product.brand, product.category, product.releaseType].filter(Boolean),
  });

  saveRecord(record);

  const feedback = document.getElementById("save-feedback");
  feedback.hidden = false;
  feedback.textContent = "保存しました";
  feedback.className = "save-feedback is-success";

  setTimeout(() => {
    switchView("saved");
    renderSavedList(record.id);
  }, 800);
});

/* ── Saved PR list ── */
function renderSavedList(openId = null, autoOpenFirst = false) {
  const filter = document.getElementById("saved-filter-status").value;
  const records = listRecords(filter ? { status: filter } : {});
  const tbody = document.getElementById("saved-table-body");
  const empty = document.getElementById("saved-empty");
  const stats = getStorageStats();
  const totalViews = records.reduce((s, r) => s + (getRecordPrtimesViews(r) || 0), 0);

  renderKpi("saved-kpi", [
    { value: `${stats.total}件`, label: "登録PR", highlight: true },
    { value: `${stats.byStatus.published || 0}件`, label: "掲載済" },
    { value: `${stats.byStatus.reviewed || 0}件`, label: "チェック済" },
    { value: totalViews ? totalViews.toLocaleString() : "—", label: "PR TIMES view 合計" },
  ]);

  document.getElementById("saved-stats").textContent = [
    `全 ${stats.total} 件`,
    ...Object.entries(stats.byStatus).map(([k, n]) => `${PR_STATUS_LABELS[k] || k} ${n}件`),
  ].join("　");

  if (records.length === 0) {
    tbody.innerHTML = "";
    empty.hidden = false;
    document.getElementById("saved-detail-panel").hidden = true;
    return;
  }

  empty.hidden = true;
  tbody.innerHTML = records
    .map((r) => {
      const mediaCount = r.distribution?.media?.length || 0;
      const views = getRecordPrtimesViews(r);
      return `
      <tr data-id="${r.id}" class="saved-row">
        <td>${formatDate(r.updatedAt)}</td>
        <td>${escapeHtml(r.title || "（無題）")}</td>
        <td>${escapeHtml(r.product?.brand || "—")}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${distBadge(r.distribution?.status)}</td>
        <td>${mediaCount}</td>
        <td>${views != null ? views.toLocaleString() : "—"}</td>
        <td>${r.review?.overall != null ? `${r.review.overall}/5` : "—"}</td>
        <td><button type="button" class="btn-link" data-open="${r.id}">詳細</button></td>
      </tr>`;
    })
    .join("");

  tbody.querySelectorAll("[data-open]").forEach((btn) => {
    btn.addEventListener("click", (ev) => {
      ev.stopPropagation();
      openDetail(btn.dataset.open);
    });
  });

  tbody.querySelectorAll(".saved-row").forEach((row) => {
    row.addEventListener("click", () => openDetail(row.dataset.id));
  });

  if (openId) openDetail(openId);
  else if (autoOpenFirst && records.length > 0) openDetail(records[0].id);
}

function statusBadge(status) {
  return `<span class="status-badge status-badge--${status}">${PR_STATUS_LABELS[status] || status}</span>`;
}

function distBadge(status) {
  if (!status) return "—";
  return `<span class="dist-badge">${DISTRIBUTION_STATUS_LABELS[status] || status}</span>`;
}

function formatDate(iso) {
  if (!iso) return "—";
  return iso.slice(0, 10);
}

document.getElementById("saved-filter-status").addEventListener("change", () => renderSavedList());

document.getElementById("export-json-btn").addEventListener("click", () => exportRecordsJson());

document.getElementById("import-json-input").addEventListener("change", async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  try {
    await importRecordsJson(file);
    renderSavedList();
    alert(`${file.name} をインポートしました。`);
  } catch {
    alert("インポートに失敗しました。JSON形式を確認してください。");
  }
  e.target.value = "";
});

document.getElementById("close-detail-btn").addEventListener("click", () => {
  document.getElementById("saved-detail-panel").hidden = true;
  selectedRecordId = null;
});

function openDetail(id) {
  selectedRecordId = id;
  const record = getRecord(id);
  if (!record) return;
  document.querySelectorAll(".saved-row").forEach((r) => {
    r.classList.toggle("is-selected", r.dataset.id === id);
  });
  const panel = document.getElementById("saved-detail-panel");
  panel.hidden = false;
  panel.scrollIntoView({ behavior: "smooth", block: "start" });
  renderDetailForm(record);
}

function renderDetailForm(record) {
  const form = document.getElementById("detail-form");
  const mediaRows = (record.distribution?.media || []).map((m) => renderMediaRow(m)).join("");

  form.innerHTML = `
    <div class="form-grid">
      <label class="full-width">
        PRタイトル
        <input type="text" name="title" value="${escapeAttr(record.title)}" required />
      </label>
      <label>
        ステータス
        <select name="status">${optionsHtml(PR_STATUS_LABELS, record.status)}</select>
      </label>
      <label>
        配信状況
        <select name="distributionStatus">${optionsHtml(DISTRIBUTION_STATUS_LABELS, record.distribution?.status)}</select>
      </label>
      <label>
        配信予定日
        <input type="date" name="scheduledDate" value="${record.distribution?.scheduledDate || ""}" />
      </label>
      <label>
        配信日
        <input type="date" name="distributedAt" value="${record.distribution?.distributedAt || ""}" />
      </label>
      <label class="full-width">
        原稿
        <textarea name="draftBody" rows="6"></textarea>
      </label>
    </div>

    <div class="detail-section">
      <div class="detail-section__header">
        <h4>媒体・配信先</h4>
        <button type="button" class="btn btn-secondary btn-sm" id="add-media-btn">媒体を追加</button>
      </div>
      <div id="media-list">${mediaRows || `<p class="text-muted">媒体が未登録です</p>`}</div>
    </div>

    <div class="detail-section">
      <h4>効果・成果</h4>
      <div class="form-grid">
        <label>
          PR TIMES view（合計）
          <input type="number" name="prtimesViews" value="${getRecordPrtimesViews(record) ?? ""}" min="0" />
        </label>
        <label>
          SNS反響数
          <input type="number" name="snsMentions" value="${record.performance?.snsMentions ?? ""}" min="0" />
        </label>
        <label>
          転載数
          <input type="number" name="reprints" value="${record.performance?.reprints ?? ""}" min="0" />
        </label>
        <label>
          広告換算（円）
          <input type="number" name="adEquivalent" value="${record.performance?.adEquivalent ?? ""}" min="0" />
        </label>
      </div>
    </div>

    <div class="detail-section">
      <h4>メモ・タグ</h4>
      <div class="form-grid">
        <label class="full-width">
          運用メモ
          <textarea name="memo" rows="4"></textarea>
        </label>
        <label class="full-width">
          タグ（カンマ区切り）
          <input type="text" name="tags" value="${escapeAttr((record.tags || []).join(", "))}" />
        </label>
      </div>
    </div>

    <div class="detail-section detail-section--admin">
      <details>
        <summary>システム情報（管理者向け）</summary>
        <h4>検索用テキスト（自動生成）</h4>
        <pre class="rag-chunk">${escapeHtml(record.ragMeta?.chunkText || "")}</pre>
        <label class="rag-ready-label">
          <input type="checkbox" name="embeddingReady" ${record.ragMeta?.embeddingReady ? "checked" : ""} />
          検索インデックス済みとしてマーク
        </label>
      </details>
    </div>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary">変更を保存</button>
      <button type="button" class="btn btn-secondary" id="delete-record-btn">削除</button>
    </div>`;

  form.querySelector('[name="draftBody"]').value = record.draft?.body || "";
  form.querySelector('[name="memo"]').value = record.memo || "";

  form.onsubmit = (e) => {
    e.preventDefault();
    saveDetailForm(record.id);
  };

  document.getElementById("add-media-btn").addEventListener("click", () => {
    const list = document.getElementById("media-list");
    if (list.querySelector(".text-muted")) list.innerHTML = "";
    const idx = list.querySelectorAll(".media-row").length;
    list.insertAdjacentHTML("beforeend", renderMediaRow(createEmptyMediaEntry()));
    bindMediaRemove();
  });

  document.getElementById("delete-record-btn").addEventListener("click", () => {
    if (confirm("このPRレコードを削除しますか？")) {
      deleteRecord(record.id);
      document.getElementById("saved-detail-panel").hidden = true;
      renderSavedList();
    }
  });

  bindMediaRemove();
}

function renderMediaRow(m) {
  return `
    <div class="media-row">
      <div class="form-grid">
        <label>
          媒体名
          <input type="text" class="media-name" value="${escapeAttr(m.name)}" />
        </label>
        <label>
          カテゴリ
          <select class="media-category">${MEDIA_CATEGORIES.map((c) => `<option ${c === m.category ? "selected" : ""}>${c}</option>`).join("")}</select>
        </label>
        <label>
          配信ステータス
          <select class="media-status">${optionsHtml(DISTRIBUTION_STATUS_LABELS, m.status)}</select>
        </label>
        <label>
          連絡先
          <input type="text" class="media-contact" value="${escapeAttr(m.contact)}" />
        </label>
        <label>
          掲載URL
          <input type="url" class="media-url" value="${escapeAttr(m.publishedUrl)}" placeholder="https://" />
        </label>
        <label>
          掲載日
          <input type="date" class="media-published" value="${m.publishedAt || ""}" />
        </label>
        <label>
          PR TIMES view
          <input type="number" class="media-prtimes-views" value="${getMediaPrtimesViews(m) ?? ""}" min="0" />
        </label>
        <label class="full-width">
          媒体メモ
          <textarea class="media-notes" rows="2">${escapeHtml(m.notes)}</textarea>
        </label>
      </div>
      <button type="button" class="btn-link btn-link--danger media-remove">この媒体を削除</button>
    </div>`;
}

function bindMediaRemove() {
  document.querySelectorAll(".media-remove").forEach((btn) => {
    btn.onclick = () => btn.closest(".media-row")?.remove();
  });
}

function saveDetailForm(id) {
  const form = document.getElementById("detail-form");
  const existing = getRecord(id);
  const media = [];
  document.querySelectorAll(".media-row").forEach((row, index) => {
    media.push({
      id: existing.distribution?.media?.[index]?.id || crypto.randomUUID(),
      name: row.querySelector(".media-name")?.value || "",
      category: row.querySelector(".media-category")?.value || MEDIA_CATEGORIES[0],
      contact: row.querySelector(".media-contact")?.value || "",
      status: row.querySelector(".media-status")?.value || DISTRIBUTION_STATUS.NOT_SENT,
      publishedUrl: row.querySelector(".media-url")?.value || "",
      publishedAt: row.querySelector(".media-published")?.value || "",
      prtimesViews: numOrNull(row.querySelector(".media-prtimes-views")?.value),
      notes: row.querySelector(".media-notes")?.value || "",
    });
  });

  const updated = createPrRecord({
    ...existing,
    id,
    title: form.elements.title.value,
    status: form.elements.status.value,
    draft: { ...existing.draft, body: form.elements.draftBody.value },
    distribution: {
      ...existing.distribution,
      status: form.elements.distributionStatus.value,
      scheduledDate: form.elements.scheduledDate.value,
      distributedAt: form.elements.distributedAt.value,
      media,
    },
    performance: {
      prtimesViews: numOrNull(form.elements.prtimesViews.value),
      snsMentions: numOrNull(form.elements.snsMentions.value),
      reprints: numOrNull(form.elements.reprints.value),
      adEquivalent: numOrNull(form.elements.adEquivalent.value),
    },
    memo: form.elements.memo.value,
    tags: form.elements.tags.value.split(",").map((t) => t.trim()).filter(Boolean),
    ragMeta: {
      ...existing.ragMeta,
      embeddingReady: form.elements.embeddingReady.checked,
    },
  });

  saveRecord(updated);
  renderSavedList(id);
  alert("保存しました");
}

function optionsHtml(labels, selected) {
  return Object.entries(labels)
    .map(([k, v]) => `<option value="${k}" ${k === selected ? "selected" : ""}>${v}</option>`)
    .join("");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function numOrNull(val) {
  if (val === "" || val == null) return null;
  const n = Number(val);
  return Number.isNaN(n) ? null : n;
}

/* ── Utils ── */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatMarkdown(text) {
  return escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\n/g, "<br>");
}

/* ── Init ── */
seedIfEmpty(SEED_SAVED_PRS);
populateStatusSelects();
populateProductPresets();
renderGuide();
fillProductForm();
currentSession.product = { ...SAMPLE_PRODUCT };
document.getElementById("draft-input").value = SAMPLE_DRAFT;
renderReviewMeta();
bootstrapCreateView();

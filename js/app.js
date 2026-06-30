import {
  BRAND,
  PR_PATTERNS,
  APPEAL_AXES,
  PAST_PRS,
  SAMPLE_PRODUCT,
  MOCK_TARGETING,
  MOCK_PLANNING_MEMO,
  MOCK_REVIEW,
  SAMPLE_DRAFT,
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

/* ── Navigation ── */
function switchView(viewId) {
  document.querySelectorAll(".view").forEach((v) => {
    const active = v.id === `view-${viewId}`;
    v.classList.toggle("is-active", active);
    v.hidden = !active;
  });
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.view === viewId);
  });
  document.querySelector(".main-nav")?.classList.remove("is-open");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

document.querySelectorAll(".nav-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchView(btn.dataset.view);
    if (btn.dataset.view === "saved") renderSavedList();
  });
});

document.querySelectorAll("[data-goto]").forEach((el) => {
  el.addEventListener("click", () => switchView(el.dataset.goto));
});

document.querySelector(".menu-toggle")?.addEventListener("click", () => {
  const nav = document.querySelector(".main-nav");
  const btn = document.querySelector(".menu-toggle");
  const open = nav.classList.toggle("is-open");
  btn.setAttribute("aria-expanded", String(open));
});

/* ── Dashboard ── */
function renderDashboard() {
  document.getElementById("dash-brand-name").textContent = BRAND.name;
  document.getElementById("dash-brand-tone").textContent = BRAND.tone;

  const list = document.getElementById("dash-pr-list");
  list.innerHTML = PAST_PRS.slice(0, 4)
    .map(
      (pr) => `
      <li>
        <span class="date">${pr.date} · ${pr.category}</span>
        ${escapeHtml(pr.title)}
      </li>`
    )
    .join("");
}

/* ── Assets ── */
function renderAssets() {
  document.getElementById("pr-count-label").textContent = `${PAST_PRS.length}件を分析（サンプル）`;

  document.getElementById("pattern-list").innerHTML = PR_PATTERNS.map(
    (p) => `
    <div class="pattern-item">
      <div class="pattern-item__header">
        <h4>${escapeHtml(p.label)}</h4>
        <span class="pattern-freq">${p.frequency}%</span>
      </div>
      <p>${escapeHtml(p.description)}</p>
      <div class="pattern-example">${escapeHtml(p.examples[0])}</div>
    </div>`
  ).join("");

  document.getElementById("appeal-chart").innerHTML = APPEAL_AXES.map(
    (a) => `
    <div class="appeal-bar">
      <div class="appeal-bar__label">
        <span>${escapeHtml(a.label)}</span>
        <span>${a.pct}%</span>
      </div>
      <div class="appeal-bar__track">
        <div class="appeal-bar__fill" style="width: ${a.pct}%"></div>
      </div>
    </div>`
  ).join("");

  document.getElementById("pr-table-body").innerHTML = PAST_PRS.map(
    (pr) => `
    <tr>
      <td>${pr.date}</td>
      <td><span class="tag ${pr.category === "プレスリリース" ? "tag--pr" : ""}">${pr.category}</span></td>
      <td>${escapeHtml(pr.title)}</td>
      <td>${escapeHtml(patternLabelMap[pr.pattern] || pr.pattern)}</td>
      <td>${pr.impressions.toLocaleString()}</td>
    </tr>`
  ).join("");

  document.getElementById("brand-tone-text").textContent = BRAND.tone;
  document.getElementById("brand-forbidden-list").innerHTML = BRAND.forbidden
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("");
}

/* ── Create flow ── */
let currentStep = 1;
let chatIndex = 0;
let chatTimer = null;
let currentSession = {
  product: null,
  targeting: null,
  planningMemo: null,
};
let lastReviewResult = null;
let selectedRecordId = null;

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
}

function fillProductForm() {
  const form = document.getElementById("product-form");
  Object.entries(SAMPLE_PRODUCT).forEach(([key, val]) => {
    const field = form.elements[key];
    if (field) field.value = val;
  });
}

document.getElementById("product-form").addEventListener("submit", (e) => {
  e.preventDefault();
  currentSession.product = getProductFromForm();
  currentSession.targeting = null;
  currentSession.planningMemo = null;
  setStep(2);
  runTargetingMock();
});

function getProductFromForm() {
  const form = document.getElementById("product-form");
  return {
    name: form.elements.name.value,
    brand: form.elements.brand.value,
    category: form.elements.category.value,
    price: form.elements.price.value,
    releaseType: form.elements.releaseType.value,
    season: form.elements.season.value,
    features: form.elements.features.value,
  };
}

function runTargetingMock() {
  const loading = document.getElementById("targeting-loading");
  const result = document.getElementById("targeting-result");
  loading.hidden = false;
  result.hidden = true;

  setTimeout(() => {
    loading.hidden = true;
    result.hidden = false;
    currentSession.targeting = MOCK_TARGETING;
    result.innerHTML = renderTargeting(MOCK_TARGETING);

    document.getElementById("ref-patterns").innerHTML = PR_PATTERNS.filter((p) =>
      ["numeric", "limited"].includes(p.id)
    )
      .map((p) => `<li><strong>${escapeHtml(p.label)}</strong> — ${escapeHtml(p.description)}</li>`)
      .join("");
  }, 1400);
}

function renderTargeting(t) {
  return `
    <div class="targeting-grid">
      <div class="target-card">
        <h4>メインターゲット</h4>
        <p>${escapeHtml(t.mainTarget)}</p>
      </div>
      <div class="target-card">
        <h4>サブターゲット</h4>
        <p>${escapeHtml(t.subTarget)}</p>
      </div>
      <div class="target-card">
        <h4>関心テーマ</h4>
        <ul>${t.interests.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="target-card">
        <h4>購買動機</h4>
        <ul>${t.purchaseMotivation.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="target-card">
        <h4>訴求キーワード</h4>
        <p>${escapeHtml(t.keywords.join(" · "))}</p>
      </div>
      <div class="target-card">
        <h4>相性のいい媒体カテゴリ</h4>
        <ul>${t.mediaCategories.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
      </div>
      <div class="target-card">
        <h4>配信タイミング推奨</h4>
        <p>${escapeHtml(t.timing)}</p>
      </div>
      <div class="rationale-box">
        <h4>予測の根拠</h4>
        <p>${escapeHtml(t.rationale)}</p>
      </div>
    </div>`;
}

document.querySelectorAll("[data-next]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = Number(btn.dataset.next);
    setStep(step);
    if (step === 3) startAgentChat();
  });
});

document.querySelectorAll("[data-back]").forEach((btn) => {
  btn.addEventListener("click", () => setStep(Number(btn.dataset.back)));
});

document.querySelectorAll(".stepper-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    const step = Number(btn.dataset.step);
    if (step <= currentStep || step === 1) {
      setStep(step);
      if (step === 3 && chatIndex === 0) startAgentChat();
      if (step === 4) renderPlanningMemo();
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
      document.getElementById("memo-preview").innerHTML = `
        <h3 class="panel-title">PR企画メモ（プレビュー）</h3>
        <p>切り口候補 ${MOCK_PLANNING_MEMO.angles.length}案を整理しました。「企画メモを表示」で詳細を確認できます。</p>`;
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
  renderPlanningMemo();
  setStep(4);
});

function renderPlanningMemo() {
  currentSession.planningMemo = MOCK_PLANNING_MEMO;
  const m = MOCK_PLANNING_MEMO;
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
});

document.getElementById("run-review-btn").addEventListener("click", () => {
  const draft = document.getElementById("draft-input").value.trim();
  if (!draft) {
    alert("原稿を入力するか、サンプル原稿を読み込んでください。");
    return;
  }
  runReviewMock();
});

function runReviewMock() {
  const panel = document.getElementById("review-result-panel");
  const loading = document.getElementById("review-loading");
  const result = document.getElementById("review-result");
  const savePanel = document.getElementById("save-panel");
  panel.hidden = false;
  loading.hidden = false;
  result.innerHTML = "";
  savePanel.hidden = true;

  setTimeout(() => {
    loading.hidden = true;
    lastReviewResult = {
      ...MOCK_REVIEW,
      reviewedAt: new Date().toISOString(),
    };
    result.innerHTML = renderReview(lastReviewResult);
    showSavePanel();
  }, 1600);
}

function showSavePanel() {
  const savePanel = document.getElementById("save-panel");
  const form = document.getElementById("save-pr-form");
  const draft = document.getElementById("draft-input").value.trim();
  const titleField = form.elements.title;
  if (!titleField.value) {
    titleField.value = draft.split("\n")[0].slice(0, 80);
  }
  savePanel.hidden = false;
  document.getElementById("save-feedback").hidden = true;
}

function renderReview(r) {
  const scoreLabel =
    r.overall >= 4 ? "配信可能（軽微な修正推奨）" : r.overall >= 3 ? "修正後に再レビュー推奨" : "要修正";

  return `
    <div class="overall-score">
      <div class="score-circle">${r.overall}</div>
      <div>
        <div class="score-label">総合スコア ${r.overall} / 5</div>
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
      <ol>${r.suggestions.map((s) => `<li>${escapeHtml(s)}</li>`).join("")}</ol>
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
function renderSavedList(openId = null) {
  const filter = document.getElementById("saved-filter-status").value;
  const records = listRecords(filter ? { status: filter } : {});
  const tbody = document.getElementById("saved-table-body");
  const empty = document.getElementById("saved-empty");
  const stats = getStorageStats();

  document.getElementById("saved-stats").innerHTML = `
    <span class="stat-chip">全 ${stats.total} 件</span>
    ${Object.entries(stats.byStatus)
      .map(([k, n]) => `<span class="stat-chip">${PR_STATUS_LABELS[k] || k}: ${n}</span>`)
      .join("")}
    <span class="stat-chip stat-chip--rag">RAGインデックス済: ${stats.ragReady}</span>`;

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
      const imp = r.performance?.estimatedImp;
      return `
      <tr data-id="${r.id}" class="saved-row">
        <td>${formatDate(r.updatedAt)}</td>
        <td>${escapeHtml(r.title || "（無題）")}</td>
        <td>${escapeHtml(r.product?.brand || "—")}</td>
        <td>${statusBadge(r.status)}</td>
        <td>${distBadge(r.distribution?.status)}</td>
        <td>${mediaCount}</td>
        <td>${imp != null ? imp.toLocaleString() : "—"}</td>
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
          推定IMP（合計）
          <input type="number" name="estimatedImp" value="${record.performance?.estimatedImp ?? ""}" min="0" />
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
      <label class="full-width">
        運用メモ
        <textarea name="memo" rows="3"></textarea>
      </label>
      <label class="full-width">
        タグ（カンマ区切り）
        <input type="text" name="tags" value="${escapeAttr((record.tags || []).join(", "))}" />
      </label>
    </div>

    <div class="detail-section rag-preview">
      <h4>RAG用テキスト（自動生成）</h4>
      <p class="text-muted">Phase 3 で pgvector へインデックスする際のチャンク原文プレビュー</p>
      <pre class="rag-chunk">${escapeHtml(record.ragMeta?.chunkText || "")}</pre>
      <label class="rag-ready-label">
        <input type="checkbox" name="embeddingReady" ${record.ragMeta?.embeddingReady ? "checked" : ""} />
        RAGインデックス済みとしてマーク
      </label>
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
          推定IMP
          <input type="number" class="media-imp" value="${m.estimatedImp ?? ""}" min="0" />
        </label>
        <label class="full-width">
          媒体メモ
          <input type="text" class="media-notes" value="${escapeAttr(m.notes)}" />
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
      estimatedImp: numOrNull(row.querySelector(".media-imp")?.value),
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
      estimatedImp: numOrNull(form.elements.estimatedImp.value),
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
renderDashboard();
renderAssets();
fillProductForm();
currentSession.product = { ...SAMPLE_PRODUCT };

document.getElementById("draft-input").value = SAMPLE_DRAFT;

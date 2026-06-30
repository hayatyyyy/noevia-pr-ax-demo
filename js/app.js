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
} from "./data.js";

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
  btn.addEventListener("click", () => switchView(btn.dataset.view));
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
  setStep(2);
  runTargetingMock();
});

function runTargetingMock() {
  const loading = document.getElementById("targeting-loading");
  const result = document.getElementById("targeting-result");
  loading.hidden = false;
  result.hidden = true;

  setTimeout(() => {
    loading.hidden = true;
    result.hidden = false;
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
  panel.hidden = false;
  loading.hidden = false;
  result.innerHTML = "";

  setTimeout(() => {
    loading.hidden = true;
    result.innerHTML = renderReview(MOCK_REVIEW);
  }, 1600);
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
renderDashboard();
renderAssets();
fillProductForm();

document.getElementById("draft-input").value = SAMPLE_DRAFT;

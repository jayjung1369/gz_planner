/* Sprint 1-2 guide module. Classic scripts preserve existing global behavior. */

function renderTravelGuide() {
  const categories = [
    "전체",
    ...new Set(TRAVEL_GUIDE.map((item) => item.category))
  ];

  guideFilterList.innerHTML = categories
    .map(
      (category) => `
        <button
          type="button"
          class="${category === activeGuideCategory ? "active" : ""}"
          data-guide-category="${escapeHtml(category)}"
        >
          ${escapeHtml(category)}
        </button>
      `
    )
    .join("");

  guideNotice.innerHTML = `
    <strong>출국 전 확인</strong>
    <p>${escapeHtml(TRAVEL_GUIDE_NOTICE)}</p>
  `;

  renderTravelGuideCards();
}

function renderTravelGuideCards() {
  const keyword = guideSearchInput.value
    .trim()
    .toLowerCase();

  const items = TRAVEL_GUIDE.filter((item) => {
    const categoryMatch =
      activeGuideCategory === "전체" ||
      item.category === activeGuideCategory;

    const searchable = [
      item.title,
      item.summary,
      item.category,
      item.appName,
      item.searchKeyword,
      ...(item.checklist || []),
      ...(item.tips || []),
      ...(item.warnings || [])
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return categoryMatch && searchable.includes(keyword);
  });

  if (items.length === 0) {
    guideCardGrid.innerHTML = `
      <div class="guide-empty">
        <strong>검색 결과가 없습니다.</strong>
        <p>다른 검색어 또는 카테고리를 선택해주세요.</p>
      </div>
    `;
    return;
  }

  guideCardGrid.innerHTML = items
    .map(
      (item) => `
        <button
          class="guide-topic-card"
          type="button"
          data-guide-id="${item.id}"
        >
          <span class="guide-topic-icon">${escapeHtml(item.icon || "•")}</span>
          <span class="guide-topic-content">
            <small>
              ${escapeHtml(item.category)}
              · ${escapeHtml(item.priority || "안내")}
            </small>
            <strong>${escapeHtml(item.title)}</strong>
            <p>${escapeHtml(item.summary)}</p>
          </span>
          <span class="guide-topic-arrow">→</span>
        </button>
      `
    )
    .join("");
}

function openTravelGuide(guideId) {
  const item = TRAVEL_GUIDE.find(
    (guide) => guide.id === guideId
  );

  if (!item) {
    return;
  }

  activeGuideItem = item;
  setText(travelGuideIcon, item.icon || "•");
  setText(travelGuideCategory, `${item.category} · ${item.priority || "안내"}`);
  setText(travelGuideTitle, item.title);
  setText(travelGuideSummary, item.summary);

  travelGuideBody.innerHTML = createTravelGuideContent(item);
  guideCopyFeedback.textContent = "";

  if (item.officialUrl) {
    guideOfficialLink.href = item.officialUrl;
    guideOfficialLink.hidden = false;
  } else {
    guideOfficialLink.hidden = true;
    guideOfficialLink.removeAttribute("href");
  }

  travelGuideModal.classList.add("open");
  travelGuideModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeTravelGuide() {
  if (!travelGuideModal) {
    return;
  }

  travelGuideModal.classList.remove("open");
  travelGuideModal.setAttribute("aria-hidden", "true");

  if (
    !detailModal.classList.contains("open") &&
    !scheduleEditModal.classList.contains("open") &&
    !sharedPlanModal.classList.contains("open")
  ) {
    document.body.classList.remove("modal-open");
  }
}

function createTravelGuideContent(item) {
  const blocks = [];

  if (item.appName || item.searchKeyword) {
    blocks.push(`
      <section class="travel-guide-app">
        <div>
          <span>앱 이름</span>
          <strong>${escapeHtml(item.appName || "-")}</strong>
        </div>
        <div>
          <span>스토어 검색어</span>
          <strong>${escapeHtml(item.searchKeyword || item.appName || "-")}</strong>
        </div>
      </section>
    `);
  }

  if (Array.isArray(item.checklist) && item.checklist.length) {
    blocks.push(`
      <section class="travel-guide-section">
        <h3>준비 체크리스트</h3>
        <div class="travel-checklist">
          ${item.checklist.map((text) => `
            <label>
              <input type="checkbox">
              <span>${escapeHtml(text)}</span>
            </label>
          `).join("")}
        </div>
      </section>
    `);
  }

  if (Array.isArray(item.steps) && item.steps.length) {
    blocks.push(`
      <section class="travel-guide-section">
        <h3>단계별 사용법</h3>
        <ol class="travel-step-list">
          ${item.steps.map((step, index) => `
            <li>
              <span>${index + 1}</span>
              <div>
                <strong>${escapeHtml(step.title)}</strong>
                <p>${escapeHtml(step.description)}</p>
              </div>
            </li>
          `).join("")}
        </ol>
      </section>
    `);
  }

  if (Array.isArray(item.sections) && item.sections.length) {
    blocks.push(`
      <section class="travel-guide-section">
        <h3>선택 방법</h3>
        <div class="travel-info-grid">
          ${item.sections.map((section) => `
            <article>
              <strong>${escapeHtml(section.title)}</strong>
              <p>${escapeHtml(section.body)}</p>
            </article>
          `).join("")}
        </div>
      </section>
    `);
  }

  if (Array.isArray(item.numbers) && item.numbers.length) {
    blocks.push(`
      <section class="travel-guide-section">
        <h3>긴급 연락처</h3>
        <div class="travel-number-grid">
          ${item.numbers.map((entry) => `
            <a href="tel:${escapeHtml(entry.number)}">
              <span>${escapeHtml(entry.label)}</span>
              <strong>${escapeHtml(entry.number)}</strong>
            </a>
          `).join("")}
        </div>
      </section>
    `);
  }

  if (Array.isArray(item.phrases) && item.phrases.length) {
    blocks.push(`
      <section class="travel-guide-section">
        <h3>바로 보여줄 중국어</h3>
        <div class="travel-phrase-list">
          ${item.phrases.map((phrase) => `
            <article>
              <span>${escapeHtml(phrase.ko)}</span>
              <strong lang="zh-CN">${escapeHtml(phrase.zh)}</strong>
              <small>${escapeHtml(phrase.pronunciation || "")}</small>
              <button
                type="button"
                data-copy-phrase="${escapeHtml(phrase.zh)}"
                onclick="copyGuidePhrase(this)"
              >
                중국어 복사
              </button>
            </article>
          `).join("")}
        </div>
      </section>
    `);
  }

  if (Array.isArray(item.tips) && item.tips.length) {
    blocks.push(createGuideNoteBlock("TIP", item.tips, "tip"));
  }

  if (Array.isArray(item.warnings) && item.warnings.length) {
    blocks.push(createGuideNoteBlock("주의사항", item.warnings, "warning"));
  }

  return blocks.join("");
}

function createGuideNoteBlock(title, items, className) {
  return `
    <section class="travel-guide-note ${className}">
      <strong>${escapeHtml(title)}</strong>
      <ul>
        ${items.map((text) => `<li>${escapeHtml(text)}</li>`).join("")}
      </ul>
    </section>
  `;
}

async function copyGuidePhrase(button) {
  const text = button.dataset.copyPhrase || "";

  try {
    await copyTextToClipboard(text);
    const original = button.textContent;
    button.textContent = "복사 완료";

    window.setTimeout(() => {
      button.textContent = original;
    }, 1500);
  } catch (error) {
    console.error(error);
  }
}

async function copyActiveGuide() {
  if (!activeGuideItem) {
    return;
  }

  const text = travelGuideItemToText(activeGuideItem);

  try {
    await copyTextToClipboard(text);
    guideCopyFeedback.textContent =
      "가이드 내용을 복사했습니다.";
  } catch (error) {
    console.error(error);
    guideCopyFeedback.textContent =
      "내용을 복사하지 못했습니다.";
  }
}

function travelGuideItemToText(item) {
  const lines = [
    item.title,
    item.summary,
    ""
  ];

  if (item.searchKeyword) {
    lines.push(`앱 검색어: ${item.searchKeyword}`, "");
  }

  (item.checklist || []).forEach((text) => {
    lines.push(`□ ${text}`);
  });

  if (item.steps?.length) {
    lines.push("");
    item.steps.forEach((step, index) => {
      lines.push(
        `${index + 1}. ${step.title}`,
        step.description
      );
    });
  }

  if (item.phrases?.length) {
    lines.push("");
    item.phrases.forEach((phrase) => {
      lines.push(
        `${phrase.ko} / ${phrase.zh} / ${phrase.pronunciation || ""}`
      );
    });
  }

  return lines.join("\n");
}

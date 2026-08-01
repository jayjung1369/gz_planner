/* Sprint 1-2 travel module. Classic scripts preserve existing global behavior. */

function getTravelLibraryItems() {
  return [
    ...PLACE_OPTIONS.map((item) => ({
      ...item,
      libraryType: "place"
    })),
    ...RESTAURANT_OPTIONS.map((item) => ({
      ...item,
      libraryType: "restaurant"
    }))
  ];
}

function renderTravelLibrary() {
  travelVisibleCount = TRAVEL_BATCH_SIZE;
  const items = getTravelLibraryItems();
  const districts = [
    "all",
    ...new Set(
      items
        .map((item) => item.district)
        .filter(Boolean)
    )
  ];

  travelTypeFilters
    .querySelectorAll("[data-travel-type]")
    .forEach((button) => {
      button.classList.toggle(
        "active",
        button.dataset.travelType === activeTravelType
      );
    });

  travelDistrictFilters.innerHTML = districts
    .map((district) => `
      <button
        type="button"
        class="${district === activeTravelDistrict ? "active" : ""}"
        data-travel-district="${district}"
      >
        ${district === "all"
          ? "전체 지역"
          : escapeHtml(getDistrictLabel(district))}
      </button>
    `)
    .join("");

  renderTravelLibraryCards();
}

function renderTravelLibraryCards() {
  const keyword = travelLibrarySearch.value
    .trim()
    .toLowerCase();

  const items = getTravelLibraryItems()
    .filter((item) => {
      const typeMatch =
        activeTravelType === "all" ||
        item.libraryType === activeTravelType;

      const districtMatch =
        activeTravelDistrict === "all" ||
        item.district === activeTravelDistrict;

      const searchable = [
        item.name,
        item.chineseName,
        item.category,
        item.district,
        getDistrictLabel(item.district),
        item.note,
        ...(item.tags || [])
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        typeMatch &&
        districtMatch &&
        searchable.includes(keyword)
      );
    })
    .sort((a, b) => {
      const priorityDifference =
        (b.priority || 0) - (a.priority || 0);

      if (priorityDifference !== 0) {
        return priorityDifference;
      }

      return a.name.localeCompare(b.name, "ko");
    });

  travelFilteredItems = items;
  travelVisibleCount = Math.min(
    travelVisibleCount,
    Math.max(items.length, TRAVEL_BATCH_SIZE)
  );

  travelLibraryCount.textContent =
    `${items.length}개 장소`;

  if (items.length === 0) {
    travelLibraryGrid.innerHTML = `
      <div class="travel-library-empty">
        <strong>검색 결과가 없습니다.</strong>
        <p>다른 검색어나 지역을 선택해주세요.</p>
      </div>
    `;
    updateTravelLoadMoreState();
    return;
  }

  const visibleItems = items.slice(0, travelVisibleCount);

  travelLibraryGrid.innerHTML = visibleItems
    .map(createTravelLibraryCard)
    .join("");

  initializeLazyImages(travelLibraryGrid);
  updateTravelLoadMoreState();
}

function loadMoreTravelItems() {
  if (
    travelVisibleCount >= travelFilteredItems.length
  ) {
    return;
  }

  const previousCount = travelVisibleCount;
  travelVisibleCount = Math.min(
    travelVisibleCount + TRAVEL_BATCH_SIZE,
    travelFilteredItems.length
  );

  const nextItems = travelFilteredItems.slice(
    previousCount,
    travelVisibleCount
  );

  travelLibraryGrid.insertAdjacentHTML(
    "beforeend",
    nextItems.map(createTravelLibraryCard).join("")
  );

  initializeLazyImages(travelLibraryGrid);
  updateTravelLoadMoreState();
}

function updateTravelLoadMoreState() {
  const hasMore =
    travelVisibleCount < travelFilteredItems.length;

  travelLoadMoreButton.hidden = !hasMore;
  travelLoadSentinel.hidden = !hasMore;

  if (hasMore) {
    travelLoadMoreButton.textContent =
      `더 보기 (${travelVisibleCount}/${travelFilteredItems.length})`;
  }
}

function initializeTravelInfiniteScroll() {
  if (!("IntersectionObserver" in window)) {
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadMoreTravelItems();
      }
    },
    {
      rootMargin: "500px 0px",
      threshold: 0
    }
  );

  observer.observe(travelLoadSentinel);
}

function createTravelLibraryCard(item) {
  const rawImage = getThumbnailImage(item);

  const typeLabel =
    item.libraryType === "restaurant"
      ? "맛집"
      : "관광지";

  return `
    <article
      class="travel-library-card"
      data-travel-card="${item.id}"
      data-item-type="${item.libraryType}"
    >
      <button
        class="travel-library-image"
        type="button"
        data-travel-detail="${item.id}"
        data-item-type="${item.libraryType}"
      >
        ${createLazyImageMarkup({
          src: rawImage,
          alt: `${item.name} 대표 사진`,
          className: "travel-library-card-image",
          fallbackType: "travel"
        })}
        <span>${typeLabel}</span>
      </button>

      <div class="travel-library-card-content">
        <div class="travel-library-card-heading">
          <div>
            <strong>${escapeHtml(item.name)}</strong>
            <span>${escapeHtml(item.chineseName || "")}</span>
          </div>
          <em>${formatDuration(item.duration || 90)}</em>
        </div>

        <div class="travel-library-card-tags">
          <span>${escapeHtml(getDistrictLabel(item.district))}</span>
          <span>${escapeHtml(item.category || typeLabel)}</span>
        </div>

        <p>${escapeHtml(item.note || item.tips || "상세 설명을 준비 중입니다.")}</p>

        <div class="travel-library-card-actions">
          <button
            type="button"
            data-travel-detail="${item.id}"
            data-item-type="${item.libraryType}"
          >
            상세보기
          </button>
          <button
            class="primary"
            type="button"
            data-travel-add="${item.id}"
            data-item-type="${item.libraryType}"
          >
            일정에 추가
          </button>
        </div>
      </div>
    </article>
  `;
}

function addTravelLibraryItem(itemId, itemType) {
  const item =
    itemType === "restaurant"
      ? RESTAURANTS[itemId]
      : PLACES[itemId];

  if (!item) {
    return;
  }

  if (!currentSchedule.length) {
    window.location.hash = "planner";
    showStorageStatus(
      "먼저 여행 일정을 만든 뒤 장소를 추가해주세요."
    );
    return;
  }

  openScheduleEditModal({
    mode: "add",
    dayIndex: 0,
    itemType,
    itemId,
    duration: item.duration || 90
  });
}

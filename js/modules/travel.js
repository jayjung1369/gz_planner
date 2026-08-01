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

const TRAVEL_FACETS = [
  { id: "recommended", label: "추천" },
  { id: "tour", label: "관광" },
  { id: "food", label: "맛집" },
  { id: "shopping", label: "쇼핑" },
  { id: "cafe", label: "카페" },
  { id: "night", label: "야경" },
  { id: "district", label: "지역" },
  { id: "search", label: "검색" }
];

function includesKeyword(item, words) {
  const searchable = [
    item.name,
    item.chineseName,
    item.category,
    item.note,
    ...(item.tags || []),
    ...(item.mealTypes || [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return words.some((word) => searchable.includes(word));
}

function matchesActiveFacet(item) {
  if (activeTravelFacet === "tour") {
    return item.libraryType === "place";
  }

  if (activeTravelFacet === "food") {
    return item.libraryType === "restaurant";
  }

  if (activeTravelFacet === "shopping") {
    return includesKeyword(item, ["쇼핑", "shopping"]);
  }

  if (activeTravelFacet === "cafe") {
    return includesKeyword(item, ["카페", "cafe"]);
  }

  if (activeTravelFacet === "night") {
    return includesKeyword(item, ["야경", "야식", "night", "late", "evening"]);
  }

  return true;
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

  travelTypeFilters.innerHTML = TRAVEL_FACETS.map((facet) => `
    <button
      type="button"
      class="${facet.id === activeTravelFacet ? "active" : ""}"
      data-travel-facet="${facet.id}"
    >
      ${facet.label}
    </button>
  `).join("");

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

function compareTravelItems(first, second) {
  if (activeTravelSort === "name") {
    return first.name.localeCompare(second.name, "ko");
  }

  if (activeTravelSort === "district") {
    const districtCompare = getDistrictLabel(first.district)
      .localeCompare(getDistrictLabel(second.district), "ko");

    return districtCompare ||
      first.name.localeCompare(second.name, "ko");
  }

  if (activeTravelSort === "duration") {
    return (
      (first.duration || 90) -
      (second.duration || 90) ||
      first.name.localeCompare(second.name, "ko")
    );
  }

  const priorityDifference =
    (second.priority || 0) - (first.priority || 0);

  return priorityDifference ||
    first.name.localeCompare(second.name, "ko");
}

function updateTravelActiveFilterText() {
  const labels = [];

  const facetLabel = TRAVEL_FACETS.find(
    (facet) => facet.id === activeTravelFacet
  )?.label;

  if (facetLabel) {
    labels.push(facetLabel);
  }

  if (activeTravelType === "place") {
    labels.push("관광지");
  } else if (activeTravelType === "restaurant") {
    labels.push("맛집");
  } else {
    labels.push("전체");
  }

  if (activeTravelDistrict !== "all") {
    labels.push(getDistrictLabel(activeTravelDistrict));
  }

  const keyword = travelLibrarySearch.value.trim();

  if (keyword) {
    labels.push(`“${keyword}” 검색`);
  }

  const sortLabels = {
    recommended: "추천순",
    name: "이름순",
    district: "지역순",
    duration: "짧은 시간순"
  };

  labels.push(sortLabels[activeTravelSort] || "추천순");
  travelActiveFilterText.textContent = labels.join(" · ");
}

function resetTravelLibraryFilters() {
  activeTravelType = "all";
  activeTravelFacet = "recommended";
  activeTravelDistrict = "all";
  activeTravelSort = "recommended";
  travelVisibleCount = TRAVEL_BATCH_SIZE;
  travelLibrarySearch.value = "";
  travelSortSelect.value = "recommended";
  renderTravelLibrary();
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
        matchesActiveFacet(item) &&
        typeMatch &&
        districtMatch &&
        searchable.includes(keyword)
      );
    })
    .sort(compareTravelItems);

  travelFilteredItems = items;
  travelVisibleCount = Math.min(
    travelVisibleCount,
    Math.max(items.length, TRAVEL_BATCH_SIZE)
  );

  travelLibraryCount.textContent =
    `${items.length}개 장소`;
  updateTravelActiveFilterText();

  if (items.length === 0) {
    travelLibraryGrid.innerHTML = `
      <div class="travel-library-empty">
        <strong>검색 결과가 없습니다.</strong>
        <p>다른 검색어 또는 지역을 선택해주세요.</p>
        <button type="button" data-reset-travel-library>
          필터 초기화
        </button>
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
  const hasItems = travelFilteredItems.length > 0;
  const hasMore =
    travelVisibleCount < travelFilteredItems.length;

  travelLoadMoreButton.hidden = !hasMore;
  travelLoadSentinel.hidden = !hasMore;
  travelLoadComplete.hidden = !hasItems || hasMore;

  if (hasMore) {
    const remaining =
      travelFilteredItems.length - travelVisibleCount;

    travelLoadMoreButton.textContent =
      `더 보기 · ${remaining}개 남음`;
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
    dayIndex: Math.min(
      activeScheduleDayIndex,
      Math.max(currentSchedule.length - 1, 0)
    ),
    itemType,
    itemId,
    duration: item.duration || 90
  });
}

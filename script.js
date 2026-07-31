let WEDDING_DATE = new Date("2026-11-14T00:00:00");

let PLACES = {};
let RESTAURANTS = {};
let PLACE_OPTIONS = [];
let RESTAURANT_OPTIONS = [];
let SCHEDULE_RULES = {};
let RECOMMENDED_DISTRICT_ORDER = [];
let RECOMMENDED_PLACE_IDS = {};
let RECOMMENDED_RESTAURANT_IDS = {};
let PHOTO_LIBRARY = {};
let TRAVEL_GUIDE = [];
let TRAVEL_GUIDE_NOTICE = "";

const arrivalInput = document.querySelector("#arrivalDate");
const arrivalTimeInput = document.querySelector("#arrivalTime");
const departureInput = document.querySelector("#departureDate");
const departureTimeInput = document.querySelector("#departureTime");
const createButton = document.querySelector("#createScheduleButton");
const scheduleResult = document.querySelector("#scheduleResult");
const customSelector = document.querySelector("#customSelector");
const placeChoices = document.querySelector("#placeChoices");
const restaurantChoices = document.querySelector("#restaurantChoices");
const modeButtons = document.querySelectorAll("[data-mode]");
const selectAllPlacesButton = document.querySelector("#selectAllPlaces");
const selectAllRestaurantsButton = document.querySelector("#selectAllRestaurants");
const detailModal = document.querySelector("#detailModal");
const detailModalPanel = document.querySelector(".detail-modal-panel");
const detailModalTitle = document.querySelector("#detailModalTitle");
const detailModalCategory = document.querySelector("#detailModalCategory");
const detailModalChinese = document.querySelector("#detailModalChinese");
const detailModalAddress = document.querySelector("#detailModalAddress");
const detailModalDuration = document.querySelector("#detailModalDuration");
const detailModalDescription = document.querySelector("#detailModalDescription");
const detailModalImage = document.querySelector("#detailModalImage");
const detailModalHours = document.querySelector("#detailModalHours");
const detailModalPrice = document.querySelector("#detailModalPrice");
const detailModalBestTime = document.querySelector("#detailModalBestTime");
const detailModalTip = document.querySelector("#detailModalTip");
const detailPhotoStatus = document.querySelector("#detailPhotoStatus");
const detailRestaurantInfo = document.querySelector("#detailRestaurantInfo");
const detailReservation = document.querySelector("#detailReservation");
const detailAverageCost = document.querySelector("#detailAverageCost");
const detailMenuBlock = document.querySelector("#detailMenuBlock");
const detailRecommendedMenu = document.querySelector("#detailRecommendedMenu");
const nearbyPlacesSection = document.querySelector("#nearbyPlacesSection");
const nearbyPlacesList = document.querySelector("#nearbyPlacesList");
const nearbyRestaurantsSection = document.querySelector("#nearbyRestaurantsSection");
const nearbyRestaurantsList = document.querySelector("#nearbyRestaurantsList");
const detailAddGuide = document.querySelector("#detailAddGuide");
const detailAddDaySelect = document.querySelector("#detailAddDaySelect");
const detailAddButton = document.querySelector("#detailAddButton");
const galleryPrevButton = document.querySelector("#galleryPrevButton");
const galleryNextButton = document.querySelector("#galleryNextButton");
const galleryDots = document.querySelector("#galleryDots");

let activeGalleryImages = [];
let activeGalleryIndex = 0;
const copyAddressButton = document.querySelector("#copyAddressButton");
const openAmapButton = document.querySelector("#openAmapButton");
const copyFeedback = document.querySelector("#copyFeedback");
const resetScheduleButton = document.querySelector("#resetScheduleButton");
const storageStatus = document.querySelector("#storageStatus");
const scheduleShareTools = document.querySelector("#scheduleShareTools");
const printScheduleButton = document.querySelector("#printScheduleButton");
const shareScheduleButton = document.querySelector("#shareScheduleButton");
const shareStatus = document.querySelector("#shareStatus");
const sharedPlanModal = document.querySelector("#sharedPlanModal");
const sharedPlanSummary = document.querySelector("#sharedPlanSummary");
const previewSharedPlanButton = document.querySelector("#previewSharedPlanButton");
const saveSharedPlanButton = document.querySelector("#saveSharedPlanButton");
const cancelSharedPlanButton = document.querySelector("#cancelSharedPlanButton");
const travelTypeFilters = document.querySelector("#travelTypeFilters");
const travelDistrictFilters = document.querySelector("#travelDistrictFilters");
const travelLibrarySearch = document.querySelector("#travelLibrarySearch");
const travelLibraryCount = document.querySelector("#travelLibraryCount");
const travelLibraryGrid = document.querySelector("#travelLibraryGrid");
const guideFilterList = document.querySelector("#guideFilterList");
const guideSearchInput = document.querySelector("#guideSearchInput");
const guideNotice = document.querySelector("#guideNotice");
const guideCardGrid = document.querySelector("#guideCardGrid");
const travelGuideModal = document.querySelector("#travelGuideModal");
const travelGuideClose = document.querySelector("#travelGuideClose");
const travelGuideIcon = document.querySelector("#travelGuideIcon");
const travelGuideCategory = document.querySelector("#travelGuideCategory");
const travelGuideTitle = document.querySelector("#travelGuideTitle");
const travelGuideSummary = document.querySelector("#travelGuideSummary");
const travelGuideBody = document.querySelector("#travelGuideBody");
const copyGuideButton = document.querySelector("#copyGuideButton");
const guideOfficialLink = document.querySelector("#guideOfficialLink");
const guideCopyFeedback = document.querySelector("#guideCopyFeedback");

let activeGuideItem = null;
let activeGuideCategory = "전체";
let activeTravelType = "all";
let activeTravelDistrict = "all";

let pendingSharedPlan = null;

const STORAGE_KEY = "guangzhouWeddingPlannerStateV14";
let storageStatusTimer = null;

const scheduleEditModal = document.querySelector("#scheduleEditModal");
const scheduleEditForm = document.querySelector("#scheduleEditForm");
const scheduleEditTitle = document.querySelector("#scheduleEditTitle");
const editItemType = document.querySelector("#editItemType");
const editItemSelect = document.querySelector("#editItemSelect");
const editItemPreview = document.querySelector("#editItemPreview");
const editItemPreviewImage = document.querySelector("#editItemPreviewImage");
const editItemPreviewStatus = document.querySelector("#editItemPreviewStatus");
const editItemPreviewName = document.querySelector("#editItemPreviewName");
const editItemPreviewChinese = document.querySelector("#editItemPreviewChinese");
const editItemPreviewDetailButton = document.querySelector("#editItemPreviewDetailButton");
const editItemPreviewTags = document.querySelector("#editItemPreviewTags");
const editItemPreviewDescription = document.querySelector("#editItemPreviewDescription");
const editItemPreviewAddress = document.querySelector("#editItemPreviewAddress");
const editItemPreviewDuration = document.querySelector("#editItemPreviewDuration");
const editItemPreviewHours = document.querySelector("#editItemPreviewHours");
const editItemSelectField = document.querySelector("#editItemSelectField");
const editCustomTitle = document.querySelector("#editCustomTitle");
const editCustomTitleField = document.querySelector("#editCustomTitleField");
const editTransportFields = document.querySelector("#editTransportFields");
const editTransportFrom = document.querySelector("#editTransportFrom");
const editTransportTo = document.querySelector("#editTransportTo");
const editTransportMode = document.querySelector("#editTransportMode");
const editStartTime = document.querySelector("#editStartTime");
const editDuration = document.querySelector("#editDuration");
const editFormMessage = document.querySelector("#editFormMessage");

let currentSchedule = [];
let dragState = null;
let pointerDragState = null;
let currentContext = null;
let editTarget = null;

let activeDetailItem = null;


let plannerMode = "recommended";

initialize();

async function initialize() {
  try {
    await loadPlannerData();
    renderChoices();
    renderTravelLibrary();
    renderTravelGuide();
    bindEvents();
    initializeRevealAnimation();
    restorePlannerState();
    readSharedPlanFromUrl();
  } catch (error) {
    console.error("플래너 데이터 로딩 실패:", error);
    showDataLoadError(error);
  }
}

async function loadPlannerData() {
  const [
    placesData,
    restaurantsData,
    photosData,
    rulesData,
    travelGuideData
  ] = await Promise.all([
    loadJson("data/places.json"),
    loadJson("data/restaurants.json"),
    loadJson("data/photos.json"),
    loadJson("data/scheduleRules.json"),
    loadJson("data/travelGuide.json")
  ]);

  PLACES = placesData.items || {};
  RESTAURANTS = restaurantsData.items || {};
  PHOTO_LIBRARY = photosData.items || {};
  TRAVEL_GUIDE = travelGuideData.items || [];
  TRAVEL_GUIDE_NOTICE = travelGuideData.notice || "";

  Object.entries(PLACES).forEach(([id, item]) => {
    item.images = PHOTO_LIBRARY[id] || ["images/places/default-place.svg"];
  });

  Object.entries(RESTAURANTS).forEach(([id, item]) => {
    item.images = PHOTO_LIBRARY[id] || ["images/places/default-place.svg"];
  });

  PLACE_OPTIONS = Object.values(PLACES).filter(
    (place) => !["airport", "weddingHotel"].includes(place.id)
  );
  RESTAURANT_OPTIONS = Object.values(RESTAURANTS);

  SCHEDULE_RULES = rulesData.rules || {};
  RECOMMENDED_DISTRICT_ORDER =
    rulesData.recommendedDistrictOrder || [];
  RECOMMENDED_PLACE_IDS = rulesData.recommendedPlaceIds || {};
  RECOMMENDED_RESTAURANT_IDS =
    rulesData.recommendedRestaurantIds || {};

  if (rulesData.weddingDate) {
    WEDDING_DATE = new Date(`${rulesData.weddingDate}T00:00:00`);
  }
}

async function loadJson(path) {
  const response = await fetch(path, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`${path} 파일을 불러오지 못했습니다. (${response.status})`);
  }

  return response.json();
}

function showDataLoadError(error) {
  const message =
    window.location.protocol === "file:"
      ? "JSON 파일은 파일 더블클릭 방식으로 불러올 수 없습니다. VS Code Live Server로 실행해주세요."
      : "관광지 데이터 파일을 불러오지 못했습니다. 배포 파일과 경로를 확인해주세요.";

  scheduleResult.innerHTML = `
    <div class="empty-state data-load-error">
      <p class="eyebrow">DATA LOAD ERROR</p>
      <h3>${message}</h3>
      <p>${error?.message || "알 수 없는 오류"}</p>
    </div>
  `;
}

function bindEvents() {
  createButton.addEventListener("click", createSchedule);

  scheduleResult.addEventListener("click", (event) => {
    const detailTrigger = event.target.closest("[data-detail-id]");
    const editTrigger = event.target.closest("[data-edit-item]");
    const deleteTrigger = event.target.closest("[data-delete-item]");
    const addTrigger = event.target.closest("[data-add-day]");
    const moveTrigger = event.target.closest("[data-move-item]");

    if (detailTrigger) {
      openDetailModal(
        detailTrigger.dataset.detailId,
        detailTrigger.dataset.detailType
      );
      return;
    }

    if (editTrigger) {
      openScheduleEditModal({
        mode: "edit",
        dayIndex: Number(editTrigger.dataset.dayIndex),
        itemIndex: Number(editTrigger.dataset.itemIndex)
      });
      return;
    }

    if (deleteTrigger) {
      deleteScheduleItem(
        Number(deleteTrigger.dataset.dayIndex),
        Number(deleteTrigger.dataset.itemIndex)
      );
      return;
    }

    if (moveTrigger) {
      moveScheduleItemByStep(
        Number(moveTrigger.dataset.dayIndex),
        Number(moveTrigger.dataset.itemIndex),
        Number(moveTrigger.dataset.moveItem)
      );
      return;
    }

    if (addTrigger) {
      openScheduleEditModal({
        mode: "add",
        dayIndex: Number(addTrigger.dataset.addDay)
      });
    }
  });

  bindScheduleDragEvents();

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeDetailModal);
  });

  copyAddressButton.addEventListener("click", copyActiveAddress);

  galleryPrevButton.addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex - 1);
  });

  galleryNextButton.addEventListener("click", () => {
    showGalleryImage(activeGalleryIndex + 1);
  });

  detailModal.addEventListener("click", (event) => {
    const nearbyTrigger = event.target.closest("[data-nearby-id]");

    if (!nearbyTrigger) {
      return;
    }

    openDetailModal(
      nearbyTrigger.dataset.nearbyId,
      nearbyTrigger.dataset.nearbyType
    );
  });

  detailAddButton.addEventListener("click", addActiveDetailToSchedule);

  document.querySelectorAll("[data-close-edit-modal]").forEach((element) => {
    element.addEventListener("click", closeScheduleEditModal);
  });

  editItemType.addEventListener("change", updateEditItemOptions);
  editItemSelect.addEventListener("change", () => {
    renderEditItemPreview(true);
  });

  editItemPreviewDetailButton.addEventListener("click", () => {
    const itemId = editItemPreviewDetailButton.dataset.itemId;
    const itemType = editItemPreviewDetailButton.dataset.itemType;

    if (!itemId || !itemType) {
      return;
    }

    closeScheduleEditModal();
    openDetailModal(itemId, itemType);
  });
  scheduleEditForm.addEventListener("submit", saveScheduleEdit);

  resetScheduleButton.addEventListener("click", resetSavedPlanner);

  printScheduleButton.addEventListener("click", printCurrentSchedule);
  shareScheduleButton.addEventListener("click", shareCurrentSchedule);
  previewSharedPlanButton.addEventListener("click", previewSharedPlan);
  saveSharedPlanButton.addEventListener("click", saveSharedPlan);
  cancelSharedPlanButton.addEventListener("click", closeSharedPlanModal);
  sharedPlanModal
    .querySelector(".shared-plan-backdrop")
    .addEventListener("click", closeSharedPlanModal);

  travelLibrarySearch.addEventListener("input", renderTravelLibraryCards);

  travelTypeFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-travel-type]");

    if (!button) {
      return;
    }

    activeTravelType = button.dataset.travelType;
    renderTravelLibrary();
  });

  travelDistrictFilters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-travel-district]");

    if (!button) {
      return;
    }

    activeTravelDistrict = button.dataset.travelDistrict;
    renderTravelLibrary();
  });

  travelLibraryGrid.addEventListener("click", (event) => {
    const detailButton = event.target.closest("[data-travel-detail]");
    const addButton = event.target.closest("[data-travel-add]");
    const card = event.target.closest("[data-travel-card]");

    const itemId =
      detailButton?.dataset.travelDetail ||
      addButton?.dataset.travelAdd ||
      card?.dataset.travelCard;

    const itemType =
      detailButton?.dataset.itemType ||
      addButton?.dataset.itemType ||
      card?.dataset.itemType;

    if (!itemId || !itemType) {
      return;
    }

    if (addButton) {
      addTravelLibraryItem(itemId, itemType);
      return;
    }

    openDetailModal(itemId, itemType);
  });

  guideSearchInput.addEventListener("input", renderTravelGuideCards);
  guideFilterList.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-guide-category]");

    if (!trigger) {
      return;
    }

    activeGuideCategory = trigger.dataset.guideCategory;
    renderTravelGuide();
  });

  guideCardGrid.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-guide-id]");

    if (trigger) {
      openTravelGuide(trigger.dataset.guideId);
    }
  });

  travelGuideClose.addEventListener("click", closeTravelGuide);
  travelGuideModal
    .querySelector(".travel-guide-backdrop")
    .addEventListener("click", closeTravelGuide);
  copyGuideButton.addEventListener("click", copyActiveGuide);

  [arrivalInput, arrivalTimeInput, departureInput, departureTimeInput].forEach(
    (input) => {
      input.addEventListener("change", () => {
        savePlannerState({ clearRenderedSchedule: true });
      });
    }
  );

  customSelector.addEventListener("change", (event) => {
    if (event.target.matches("input[type='checkbox']")) {
      savePlannerState({ clearRenderedSchedule: true });
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (detailModal.classList.contains("open")) {
      closeDetailModal();
    }

    if (scheduleEditModal.classList.contains("open")) {
      closeScheduleEditModal();
    }
  });


  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPlannerMode(button.dataset.mode);
    });
  });

  selectAllPlacesButton.addEventListener("click", () => {
    toggleAllChoices("place-choice", selectAllPlacesButton);
  });

  selectAllRestaurantsButton.addEventListener("click", () => {
    toggleAllChoices("restaurant-choice", selectAllRestaurantsButton);
  });
}

function initializeRevealAnimation() {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
}

function setPlannerMode(mode) {
  plannerMode = mode;

  modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  const isCustom = mode === "custom";
  customSelector.hidden = !isCustom;
  createButton.textContent = isCustom
    ? "선택한 장소로 일정 만들기"
    : "추천 일정 만들기";

  savePlannerState({ clearRenderedSchedule: true });
}

function renderChoices() {
  placeChoices.innerHTML = PLACE_OPTIONS.map((place) =>
    createChoiceCard(place, "place-choice")
  ).join("");

  restaurantChoices.innerHTML = RESTAURANT_OPTIONS.map((restaurant) =>
    createChoiceCard(restaurant, "restaurant-choice")
  ).join("");
}

function createChoiceCard(item, inputClass) {
  const rawImage =
    item.images?.[0] || "images/places/default-place.svg";
  const thumbnail = resolveAssetUrl(rawImage);
  const isPlaceholder = isPlaceholderImage(rawImage);

  return `
    <label class="choice-card">
      <input
        class="${inputClass}"
        type="checkbox"
        value="${item.id}"
      >
      <span class="choice-image-wrap">
        <img
          class="choice-image"
          src="${thumbnail}"
          alt="${item.name} 사진"
          loading="lazy"
          onerror="handleChoiceImageError(this)"
        >
        ${isPlaceholder
          ? `<span class="choice-photo-status">사진 준비 중</span>`
          : ""}
      </span>
      <span class="choice-check">✓</span>
      <span class="choice-content">
        <strong>${item.name}</strong>
        <small>${getDistrictLabel(item.district)} · ${item.category}</small>
        <em>${formatDuration(item.duration)}</em>
      </span>
    </label>
  `;
}

function isPlaceholderImage(path) {
  return (
    !path ||
    path.endsWith(".svg") ||
    path.includes("default-place")
  );
}

function handleChoiceImageError(image) {
  image.onerror = null;
  image.src = resolveAssetUrl(
    "images/places/default-place.svg"
  );

  const wrap = image.closest(".choice-image-wrap");

  if (wrap && !wrap.querySelector(".choice-photo-status")) {
    wrap.insertAdjacentHTML(
      "beforeend",
      '<span class="choice-photo-status">사진 준비 중</span>'
    );
  }
}

function toggleAllChoices(className, button) {
  const checkboxes = [...document.querySelectorAll(`.${className}`)];
  const shouldSelectAll = checkboxes.some((checkbox) => !checkbox.checked);

  checkboxes.forEach((checkbox) => {
    checkbox.checked = shouldSelectAll;
  });

  button.textContent = shouldSelectAll ? "전체 해제" : "전체 선택";
  savePlannerState({ clearRenderedSchedule: true });
}

function createSchedule() {
  const arrivalDate = parseDate(arrivalInput.value);
  const departureDate = parseDate(departureInput.value);
  const arrivalTime = arrivalTimeInput.value;
  const departureTime = departureTimeInput.value;

  if (!arrivalDate || !departureDate || !arrivalTime || !departureTime) {
    showMessage("도착·출국 날짜와 시간을 모두 선택해주세요.");
    return;
  }

  if (arrivalDate > departureDate) {
    showMessage("출국일은 도착일보다 늦어야 합니다.");
    return;
  }

  if (!isDateWithinRange(WEDDING_DATE, arrivalDate, departureDate)) {
    showMessage("선택한 일정에는 2026년 11월 14일 결혼식이 포함되어야 합니다.");
    return;
  }

  const selectedPlaces = plannerMode === "custom"
    ? getSelectedItems("place-choice", PLACES)
    : [];

  const selectedRestaurants = plannerMode === "custom"
    ? getSelectedItems("restaurant-choice", RESTAURANTS)
    : [];

  if (
    plannerMode === "custom" &&
    selectedPlaces.length === 0 &&
    selectedRestaurants.length === 0
  ) {
    showMessage("가고 싶은 여행지나 식사를 한 개 이상 선택해주세요.");
    return;
  }

  const dates = enumerateDates(arrivalDate, departureDate);
  const context = {
    arrivalDate,
    departureDate,
    arrivalTime,
    departureTime,
    dates,
    selectedPlaces,
    selectedRestaurants
  };

  const schedule = plannerMode === "recommended"
    ? buildRecommendedSchedule(context)
    : buildCustomSchedule(context);

  context.excludedItems =
    plannerMode === "custom"
      ? findExcludedSelectedItems(
          schedule,
          selectedPlaces,
          selectedRestaurants
        )
      : [];

  renderSchedule(schedule, context);
}

function findExcludedSelectedItems(
  schedule,
  selectedPlaces,
  selectedRestaurants
) {
  const scheduledIds = new Set();

  schedule.forEach((day) => {
    day.items.forEach((item) => {
      if (item.id) {
        scheduledIds.add(item.id);
      }
    });
  });

  return [
    ...selectedPlaces.map((item) => ({
      ...item,
      itemType: "관광지"
    })),
    ...selectedRestaurants.map((item) => ({
      ...item,
      itemType: "식사"
    }))
  ]
    .filter((item) => !scheduledIds.has(item.id))
    .map((item) => ({
      id: item.id,
      name: item.name,
      itemType: item.itemType,
      reason: getExclusionReason(item)
    }));
}

function getExclusionReason(item) {
  if (item.duration >= 360) {
    return "하루에 가까운 시간이 필요해 남은 시간에 배치하지 못했습니다.";
  }

  if (item.openTime && item.closeTime) {
    return "운영시간과 이용 가능한 시간이 맞지 않거나 일정 시간이 부족합니다.";
  }

  return "선택한 전체 일정을 배치하기에 이용 가능한 시간이 부족합니다.";
}

function buildRecommendedSchedule(context) {
  const pool = createRecommendedPool();
  return buildScheduleFromPool(context, pool);
}

function buildCustomSchedule(context) {
  const pool = {
    places: [...context.selectedPlaces],
    restaurants: [...context.selectedRestaurants]
  };

  return buildScheduleFromPool(context, pool);
}

function createRecommendedPool() {
  const places = [];
  const restaurants = [];

  RECOMMENDED_DISTRICT_ORDER.forEach((district) => {
    (RECOMMENDED_PLACE_IDS[district] || []).forEach((id) => {
      if (PLACES[id]) {
        places.push(PLACES[id]);
      }
    });

    (RECOMMENDED_RESTAURANT_IDS[district] || []).forEach((id) => {
      if (RESTAURANTS[id]) {
        restaurants.push(RESTAURANTS[id]);
      }
    });
  });

  return { places, restaurants };
}

function buildScheduleFromPool(context, pool) {
  const remainingPlaces = [...pool.places];
  const remainingRestaurants = [...pool.restaurants];

  return context.dates.map((date, index) => {
    const isArrivalDay = index === 0;
    const isDepartureDay = index === context.dates.length - 1;
    const isWeddingDay = isSameDate(date, WEDDING_DATE);

    if (isWeddingDay) {
      return buildWeddingDay(date, index);
    }

    const dayWindow = getAvailableDayWindow({
      isArrivalDay,
      isDepartureDay,
      arrivalTime: context.arrivalTime,
      departureTime: context.departureTime
    });

    const items = [];

    if (isArrivalDay) {
      const airportArrival = timeToMinutes(context.arrivalTime);
      items.push({
        start: airportArrival,
        end: airportArrival + 45,
        title: PLACES.airport.name,
        detail: PLACES.airport.note,
        tag: "입국",
        type: "transport"
      });

      items.push({
        start: airportArrival + 45,
        end: airportArrival + 45 + SCHEDULE_RULES.airportToHotelMinutes,
        title: "W Guangzhou 이동 및 체크인",
        detail: "공항에서 호텔로 이동한 뒤 체크인합니다.",
        tag: "이동",
        type: "transport"
      });
    }

    const availableStart = isArrivalDay
      ? Math.max(dayWindow.start, timeToMinutes(context.arrivalTime) + 135)
      : dayWindow.start;

    const availableEnd = isDepartureDay
      ? Math.min(
          dayWindow.end,
          timeToMinutes(context.departureTime) -
            SCHEDULE_RULES.airportBufferMinutes -
            SCHEDULE_RULES.hotelToAirportMinutes
        )
      : dayWindow.end;

    if (availableEnd - availableStart >= 60) {
      const preferredDistrict = chooseBestDistrict(
        remainingPlaces,
        remainingRestaurants,
        availableStart,
        availableEnd
      );

      const dayItems = planDayByDistrict({
        district: preferredDistrict,
        start: availableStart,
        end: availableEnd,
        places: remainingPlaces,
        restaurants: remainingRestaurants
      });

      items.push(...dayItems);
      removeScheduledItems(dayItems, remainingPlaces, remainingRestaurants);
    }

    if (isDepartureDay) {
      const airportDepartureStart =
        timeToMinutes(context.departureTime) -
        SCHEDULE_RULES.airportBufferMinutes -
        SCHEDULE_RULES.hotelToAirportMinutes;

      items.push({
        start: airportDepartureStart,
        end: airportDepartureStart + SCHEDULE_RULES.hotelToAirportMinutes,
        title: "호텔 체크아웃 및 공항 이동",
        detail: "출발 2시간 전 공항 도착을 기준으로 이동합니다.",
        tag: "출국",
        type: "transport"
      });

      items.push({
        start: airportDepartureStart + SCHEDULE_RULES.hotelToAirportMinutes,
        end: timeToMinutes(context.departureTime),
        title: "출국 수속",
        detail: "수하물 위탁과 보안검색 후 탑승을 준비합니다.",
        tag: "공항",
        type: "transport"
      });
    }

    return {
      date,
      index,
      title: getDayTitle({ isArrivalDay, isDepartureDay }),
      items: normalizeItems(items)
    };
  });
}

function buildWeddingDay(date, index) {
  return {
    date,
    index,
    title: "Wedding Day",
    items: [
      {
        start: 8 * 60,
        end: 10 * 60,
        title: "아침 식사 및 휴식",
        detail: "호텔에서 여유롭게 아침을 보내고 예식을 준비합니다.",
        tag: "준비"
      },
      {
        start: 10 * 60,
        end: 14 * 60,
        title: "개인 준비 시간",
        detail: "의상과 이동 준비를 위한 여유 시간입니다.",
        tag: "준비"
      },
      {
        start: 14 * 60,
        end: 17 * 60,
        title: PLACES.weddingHotel.name,
        detail: PLACES.weddingHotel.note,
        tag: "Wedding",
        isWeddingEvent: true
      },
      {
        start: 17 * 60,
        end: 20 * 60,
        title: "피로연 및 저녁 식사",
        detail: "결혼식 후 하객들과 함께하는 저녁 일정입니다.",
        tag: "Wedding"
      },
      {
        start: 20 * 60,
        end: 24 * 60,
        title: "자유 일정",
        detail: "호텔에서 휴식하거나 가까운 지역에서 자유롭게 시간을 보냅니다.",
        tag: "휴식"
      }
    ]
  };
}

function getAvailableDayWindow({
  isArrivalDay,
  isDepartureDay,
  arrivalTime,
  departureTime
}) {
  let start = timeToMinutes(SCHEDULE_RULES.dayStart);
  let end = timeToMinutes(SCHEDULE_RULES.dayEnd);

  if (isArrivalDay) {
    start = Math.max(start, timeToMinutes(arrivalTime));
  }

  if (isDepartureDay) {
    end = Math.min(end, timeToMinutes(departureTime));
  }

  return { start, end };
}

function chooseBestDistrict(places, restaurants, start, end) {
  const availableMinutes = end - start;

  const districtScores = RECOMMENDED_DISTRICT_ORDER.map((district) => {
    const districtPlaces = places.filter((item) => item.district === district);
    const districtRestaurants = restaurants.filter(
      (item) => item.district === district
    );

    const score =
      districtPlaces.reduce((sum, item) => sum + (item.priority || 1), 0) +
      districtRestaurants.reduce((sum, item) => sum + (item.priority || 1), 0);

    const totalDuration =
      districtPlaces.reduce((sum, item) => sum + item.duration, 0) +
      districtRestaurants.reduce((sum, item) => sum + item.duration, 0);

    return {
      district,
      score,
      fits: totalDuration <= availableMinutes + 180,
      itemCount: districtPlaces.length + districtRestaurants.length
    };
  });

  const best = districtScores
    .filter((item) => item.itemCount > 0)
    .sort((a, b) => {
      if (a.fits !== b.fits) {
        return Number(b.fits) - Number(a.fits);
      }
      return b.score - a.score;
    })[0];

  return best?.district || places[0]?.district || restaurants[0]?.district || "zhujiang";
}

function planDayByDistrict({
  district,
  start,
  end,
  places,
  restaurants
}) {
  const districtPlaces = places
    .filter((item) => item.district === district)
    .sort((a, b) => {
      const aNight = (a.recommendedTime || []).includes("night");
      const bNight = (b.recommendedTime || []).includes("night");

      if (aNight !== bNight) {
        return Number(aNight) - Number(bNight);
      }

      return (b.priority || 0) - (a.priority || 0);
    });

  const districtRestaurants = restaurants
    .filter((item) => item.district === district)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));

  const items = [];
  let cursor = start;
  let previousDistrict = district;
  let lunchAdded = false;
  let dinnerAdded = false;

  for (const place of districtPlaces) {
    if (!lunchAdded && cursor >= 11 * 60 && cursor < 14 * 60) {
      const lunch = findMeal(districtRestaurants, "lunch", cursor, end);

      if (lunch) {
        const mealItem = createScheduledItem(lunch, cursor, "restaurant");
        items.push(mealItem);
        cursor = mealItem.end + 15;
        lunchAdded = true;
      }
    }

    if (!dinnerAdded && cursor >= 17 * 60 && cursor < 21 * 60) {
      const dinner = findMeal(districtRestaurants, "dinner", cursor, end);

      if (dinner) {
        const mealItem = createScheduledItem(dinner, cursor, "restaurant");
        items.push(mealItem);
        cursor = mealItem.end + 15;
        dinnerAdded = true;
      }
    }

    const travelMinutes = getTravelMinutes(previousDistrict, place.district);
    const placeStart = Math.max(cursor + travelMinutes, timeToMinutes(place.openTime));
    const placeEnd = placeStart + place.duration;

    if (
      placeEnd > end ||
      placeEnd > timeToMinutes(place.closeTime)
    ) {
      continue;
    }

    if (travelMinutes > 0) {
      items.push({
        start: cursor,
        end: cursor + travelMinutes,
        title: `${place.name} 이동`,
        detail: `${getDistrictLabel(place.district)} 지역 내 이동`,
        tag: "이동",
        type: "transport"
      });
    }

    items.push(createScheduledItem(place, placeStart, "place"));
    cursor = placeEnd;
    previousDistrict = place.district;
  }

  if (!lunchAdded && cursor < 15 * 60) {
    const lunch = findMeal(districtRestaurants, "lunch", cursor, end);

    if (lunch) {
      items.push(createScheduledItem(lunch, cursor, "restaurant"));
      cursor += lunch.duration;
    }
  }

  if (!dinnerAdded && cursor < end - 60) {
    const dinner = findMeal(districtRestaurants, "dinner", Math.max(cursor, 17 * 60), end);

    if (dinner) {
      const dinnerStart = Math.max(cursor, 17 * 60);
      items.push(createScheduledItem(dinner, dinnerStart, "restaurant"));
    }
  }

  return items;
}

function findMeal(restaurants, mealType, cursor, end) {
  return restaurants.find((restaurant) => {
    const canServeMeal = restaurant.mealTypes.includes(mealType);
    const start = Math.max(cursor, timeToMinutes(restaurant.openTime));
    const finish = start + restaurant.duration;

    return (
      canServeMeal &&
      finish <= end &&
      finish <= timeToMinutes(restaurant.closeTime)
    );
  });
}

function createScheduledItem(item, start, sourceType) {
  return {
    id: item.id,
    sourceType,
    start,
    end: start + item.duration,
    title: item.name,
    detail: item.note,
    tag: item.category,
    district: item.district
  };
}

function removeScheduledItems(items, places, restaurants) {
  const scheduledPlaceIds = new Set(
    items
      .filter((item) => item.sourceType === "place")
      .map((item) => item.id)
  );

  const scheduledRestaurantIds = new Set(
    items
      .filter((item) => item.sourceType === "restaurant")
      .map((item) => item.id)
  );

  removeByIds(places, scheduledPlaceIds);
  removeByIds(restaurants, scheduledRestaurantIds);
}

function removeByIds(items, ids) {
  for (let index = items.length - 1; index >= 0; index -= 1) {
    if (ids.has(items[index].id)) {
      items.splice(index, 1);
    }
  }
}

function normalizeItems(items) {
  return items
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start);
}

function renderSchedule(schedule, context, options = {}) {
  currentSchedule = schedule;
  currentContext = context;

  const nights = Math.max(context.dates.length - 1, 0);
  const selectedLabel = plannerMode === "recommended"
    ? "동선을 고려한 추천 일정"
    : "선택한 장소 중심 일정";

  scheduleResult.innerHTML = `
    <div class="schedule-header">
      <p class="eyebrow">${selectedLabel.toUpperCase()}</p>
      <h3>${nights}박 ${context.dates.length}일 일정</h3>
      <p>
        ${formatDate(context.arrivalDate)} ${context.arrivalTime}
        도착 · ${formatDate(context.departureDate)}
        ${context.departureTime} 출국
      </p>
    </div>

    ${createOverallRouteNotice(schedule)}

    <div class="schedule-list">
      ${schedule.map((day, dayIndex) => createScheduleCard(day, dayIndex)).join("")}
    </div>

    ${createExcludedItemsSection(context.excludedItems || [])}
  `;

  scheduleShareTools.hidden = false;

  savePlannerState({
    renderedScheduleHtml: scheduleResult.innerHTML
  });

  if (!options.skipScroll) {
    scheduleResult.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

function createOverallRouteNotice(schedule) {
  const warningDays = schedule.filter(
    (day) => getDayRouteWarnings(day).length > 0
  );

  if (warningDays.length === 0) {
    return "";
  }

  return `
    <div class="route-overall-notice">
      <strong>동선 확인이 필요한 일정이 있습니다.</strong>
      <p>
        지역을 반복해서 이동하는 날짜가 표시되었습니다.
        저장은 가능하지만 실제 이동시간을 확인해주세요.
      </p>
    </div>
  `;
}

function createDayRouteWarning(day) {
  const warnings = getDayRouteWarnings(day);

  if (warnings.length === 0) {
    return "";
  }

  return `
    <div class="day-route-warning">
      <strong>동선 확인</strong>
      <span>${warnings.join(" ")}</span>
    </div>
  `;
}

function getDayRouteWarnings(day) {
  const districtItems = day.items.filter(
    (item) =>
      item.district &&
      item.sourceType !== "transport" &&
      item.type !== "transport"
  );

  if (districtItems.length < 3) {
    return [];
  }

  const sequence = districtItems.map((item) => item.district);
  const compact = sequence.filter(
    (district, index) =>
      index === 0 || district !== sequence[index - 1]
  );

  const warnings = [];
  const visited = new Set();
  let repeatedDistrict = false;

  compact.forEach((district) => {
    if (visited.has(district)) {
      repeatedDistrict = true;
    }
    visited.add(district);
  });

  if (repeatedDistrict) {
    warnings.push(
      "이미 방문한 지역으로 다시 돌아가는 일정입니다."
    );
  }

  if (compact.length >= 4) {
    warnings.push(
      `지역 이동이 ${compact.length - 1}회 포함되어 있습니다.`
    );
  }

  return warnings;
}

function createExcludedItemsSection(items) {
  if (!items || items.length === 0) {
    return "";
  }

  return `
    <section class="excluded-section">
      <div class="excluded-heading">
        <p class="eyebrow">NOT INCLUDED</p>
        <h4>일정에 포함되지 않은 선택 항목</h4>
        <p>
          시간이 부족하거나 운영시간과 맞지 않아 자동 일정에
          넣지 못했습니다. 날짜별 일정 추가 버튼으로 직접 넣을 수 있습니다.
        </p>
      </div>

      <div class="excluded-list">
        ${items.map((item) => `
          <div class="excluded-item">
            <div>
              <strong>${item.name}</strong>
              <span>${item.itemType}</span>
            </div>
            <p>${item.reason}</p>
          </div>
        `).join("")}
      </div>
    </section>
  `;
}

function createScheduleCard(day, dayIndex) {
  const totalDuration = calculateDayDuration(day.items);

  return `
    <article class="schedule-card">
      <div class="schedule-card-top">
        <div>
          <div class="date-label">
            DAY ${day.index + 1}<br>
            ${formatShortDate(new Date(day.date))}
          </div>
          <div class="day-duration">전체 일정 ${totalDuration}</div>
        </div>

        <h4>${day.title}</h4>
      </div>

      ${createDayRouteWarning(day)}

      <div class="timeline">
        ${day.items.length > 0
          ? day.items
              .map((item, itemIndex) =>
                createTimelineItem(item, dayIndex, itemIndex)
              )
              .join("")
          : `
            <div class="timeline-empty">
              이용 가능한 시간이 부족해 별도 일정이 없습니다.
            </div>
          `}
      </div>

      <button
        class="add-schedule-button"
        type="button"
        data-add-day="${dayIndex}"
      >
        + 이 날짜에 일정 추가
      </button>
    </article>
  `;
}

function createTimelineItem(item, dayIndex, itemIndex) {
  const weddingEventClass = item.isWeddingEvent ? "wedding-event" : "";
  const weddingBadge = item.isWeddingEvent
    ? `<span class="wedding-event-label">WEDDING CEREMONY</span>`
    : "";

  const locked = item.isWeddingEvent;
  const sourceItem = getScheduleSourceItem(item);
  const isTransport =
    item.sourceType === "transport" ||
    item.type === "transport";

  const rawImage =
    sourceItem?.images?.[0] ||
    (item.isWeddingEvent
      ? PLACES.weddingHotel?.images?.[0]
      : "");

  const imageMarkup =
    rawImage && !isTransport
      ? `
        <button
          class="timeline-thumbnail"
          type="button"
          ${item.id
            ? `data-detail-id="${item.id}" data-detail-type="${item.sourceType || "place"}"`
            : ""}
          aria-label="${escapeHtml(item.title)} 상세보기"
        >
          <img
            src="${resolveAssetUrl(rawImage)}"
            alt="${escapeHtml(item.title)} 대표 사진"
            loading="lazy"
            onerror="handleTimelineImageError(this)"
          >
        </button>
      `
      : "";

  const chineseName = sourceItem?.chineseName
    ? `<span class="timeline-chinese-name">${escapeHtml(sourceItem.chineseName)}</span>`
    : "";

  const shortDescription = sourceItem?.note || item.detail || "";
  const tip = sourceItem?.tips || "";

  const detailAction = item.id
    ? `
      <button
        class="detail-button"
        type="button"
        data-detail-id="${item.id}"
        data-detail-type="${item.sourceType || "place"}"
      >상세보기</button>
    `
    : "";

  const actionButtons = locked
    ? `
      <div class="timeline-edit-actions">
        ${detailAction}
        <span class="locked-schedule-label">필수 일정 · 변경 불가</span>
      </div>
    `
    : `
      <div class="timeline-edit-actions">
        ${detailAction}
        <button
          class="timeline-edit-button"
          type="button"
          data-edit-item
          data-day-index="${dayIndex}"
          data-item-index="${itemIndex}"
        >편집</button>
        <button
          class="timeline-delete-button"
          type="button"
          data-delete-item
          data-day-index="${dayIndex}"
          data-item-index="${itemIndex}"
        >삭제</button>
      </div>
    `;

  const draggableAttributes = locked
    ? ""
    : `draggable="true"
       data-draggable-item
       data-day-index="${dayIndex}"
       data-item-index="${itemIndex}"`;

  const reorderControls = locked
    ? ""
    : `
      <div class="timeline-reorder-controls">
        <button
          class="timeline-drag-handle"
          type="button"
          aria-label="${escapeHtml(item.title)} 일정 순서 변경"
          title="드래그해서 순서 변경"
          data-drag-handle
        >
          <span></span><span></span><span></span>
        </button>
        <div class="timeline-step-buttons">
          <button
            type="button"
            aria-label="위로 이동"
            data-move-item="-1"
            data-day-index="${dayIndex}"
            data-item-index="${itemIndex}"
            ${itemIndex === 0 ? "disabled" : ""}
          >↑</button>
          <button
            type="button"
            aria-label="아래로 이동"
            data-move-item="1"
            data-day-index="${dayIndex}"
            data-item-index="${itemIndex}"
          >↓</button>
        </div>
      </div>
    `;

  const transportBody = isTransport
    ? `
      <div class="transport-route-visual">
        <span>${escapeHtml(item.transportFrom || "출발지")}</span>
        <i>↓</i>
        <strong>${escapeHtml(item.transportTo || "도착지")}</strong>
      </div>
      <p class="timeline-detail">
        ${escapeHtml(item.transportMode || "이동")} ·
        ${formatDuration(item.end - item.start)}
      </p>
    `
    : `
      <div class="timeline-title-row">
        <p class="timeline-title">${escapeHtml(item.title)}</p>
        ${chineseName}
      </div>
      <p class="timeline-detail">
        ${escapeHtml(shortDescription)}
      </p>
      ${tip
        ? `<p class="timeline-tip">TIP · ${escapeHtml(tip)}</p>`
        : ""}
    `;

  return `
    <div
      class="timeline-item ${weddingEventClass} ${isTransport ? "transport-event" : "place-event"}"
      ${draggableAttributes}
      data-day-index="${dayIndex}"
      data-item-index="${itemIndex}"
    >
      ${reorderControls}

      <div class="timeline-time">
        <span>${formatTime(item.start)}</span>
        <small>${formatTime(item.end)}</small>
      </div>

      <div class="timeline-content">
        ${weddingBadge}

        <div class="timeline-card-layout">
          ${imageMarkup}
          <div class="timeline-card-copy">
            ${transportBody}

            <div class="timeline-meta">
              ${sourceItem?.district
                ? `<span class="district-tag">${escapeHtml(getDistrictLabel(sourceItem.district))}</span>`
                : ""}
              <span class="place-tag">${escapeHtml(item.tag)}</span>
              <span class="duration-tag">
                소요시간 ${formatDuration(item.end - item.start)}
              </span>
            </div>

            ${actionButtons}
          </div>
        </div>
      </div>
    </div>
  `;
}

function getScheduleSourceItem(item) {
  if (!item?.id) {
    return null;
  }

  if (item.sourceType === "restaurant") {
    return RESTAURANTS[item.id] || null;
  }

  return PLACES[item.id] || RESTAURANTS[item.id] || null;
}

function handleTimelineImageError(image) {
  image.onerror = null;
  image.src = resolveAssetUrl(
    "images/places/default-place.svg"
  );
}

function bindScheduleDragEvents() {
  scheduleResult.addEventListener("dragstart", handleScheduleDragStart);
  scheduleResult.addEventListener("dragover", handleScheduleDragOver);
  scheduleResult.addEventListener("drop", handleScheduleDrop);
  scheduleResult.addEventListener("dragend", clearScheduleDragState);

  scheduleResult.addEventListener("pointerdown", handlePointerDragStart);
  window.addEventListener("pointermove", handlePointerDragMove);
  window.addEventListener("pointerup", handlePointerDragEnd);
  window.addEventListener("pointercancel", handlePointerDragEnd);
}

function handleScheduleDragStart(event) {
  const itemElement = event.target.closest("[data-draggable-item]");

  if (!itemElement || event.target.closest("button:not([data-drag-handle])")) {
    event.preventDefault();
    return;
  }

  dragState = {
    dayIndex: Number(itemElement.dataset.dayIndex),
    itemIndex: Number(itemElement.dataset.itemIndex),
    element: itemElement
  };

  itemElement.classList.add("is-dragging");
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", "schedule-item");
}

function handleScheduleDragOver(event) {
  if (!dragState) {
    return;
  }

  const target = event.target.closest("[data-draggable-item]");

  if (
    !target ||
    Number(target.dataset.dayIndex) !== dragState.dayIndex
  ) {
    return;
  }

  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  const timeline = target.closest(".timeline");
  const dragging = dragState.element;

  if (!timeline || !dragging || target === dragging) {
    return;
  }

  const rect = target.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;

  timeline.insertBefore(
    dragging,
    insertAfter ? target.nextSibling : target
  );
}

function handleScheduleDrop(event) {
  if (!dragState) {
    return;
  }

  event.preventDefault();
  commitDomScheduleOrder(dragState.dayIndex);
  clearScheduleDragState();
}

function clearScheduleDragState() {
  if (dragState?.element) {
    dragState.element.classList.remove("is-dragging");
  }

  dragState = null;
}

function handlePointerDragStart(event) {
  const handle = event.target.closest("[data-drag-handle]");

  if (!handle || event.pointerType === "mouse") {
    return;
  }

  const itemElement = handle.closest("[data-draggable-item]");

  if (!itemElement) {
    return;
  }

  event.preventDefault();
  handle.setPointerCapture?.(event.pointerId);

  pointerDragState = {
    pointerId: event.pointerId,
    dayIndex: Number(itemElement.dataset.dayIndex),
    element: itemElement,
    startY: event.clientY,
    moved: false
  };

  itemElement.classList.add("is-pointer-dragging");
  document.body.classList.add("schedule-drag-active");
}

function handlePointerDragMove(event) {
  if (
    !pointerDragState ||
    event.pointerId !== pointerDragState.pointerId
  ) {
    return;
  }

  event.preventDefault();

  if (Math.abs(event.clientY - pointerDragState.startY) > 5) {
    pointerDragState.moved = true;
  }

  const target = document
    .elementFromPoint(event.clientX, event.clientY)
    ?.closest("[data-draggable-item]");

  if (
    !target ||
    target === pointerDragState.element ||
    Number(target.dataset.dayIndex) !== pointerDragState.dayIndex
  ) {
    return;
  }

  const timeline = target.closest(".timeline");
  const rect = target.getBoundingClientRect();
  const insertAfter = event.clientY > rect.top + rect.height / 2;

  timeline.insertBefore(
    pointerDragState.element,
    insertAfter ? target.nextSibling : target
  );

  const edge = 80;

  if (event.clientY < edge) {
    window.scrollBy(0, -12);
  } else if (event.clientY > window.innerHeight - edge) {
    window.scrollBy(0, 12);
  }
}

function handlePointerDragEnd(event) {
  if (
    !pointerDragState ||
    event.pointerId !== pointerDragState.pointerId
  ) {
    return;
  }

  const { dayIndex, element, moved } = pointerDragState;

  element.classList.remove("is-pointer-dragging");
  document.body.classList.remove("schedule-drag-active");
  pointerDragState = null;

  if (moved) {
    commitDomScheduleOrder(dayIndex);
  }
}

function commitDomScheduleOrder(dayIndex) {
  const day = currentSchedule[dayIndex];

  if (!day) {
    return;
  }

  const card = scheduleResult.querySelectorAll(".schedule-card")[dayIndex];
  const itemElements = card
    ? [...card.querySelectorAll("[data-draggable-item], .wedding-event")]
    : [];

  if (itemElements.length !== day.items.length) {
    renderSchedule(currentSchedule, currentContext, { skipScroll: true });
    return;
  }

  const oldItems = day.items.map((item) => ({ ...item }));
  const reordered = itemElements.map((element) => {
    const originalIndex = Number(element.dataset.itemIndex);
    return { ...oldItems[originalIndex] };
  });

  const result = reflowOrderedDayItems(reordered);

  if (!result.ok) {
    renderSchedule(currentSchedule, currentContext, { skipScroll: true });
    showStorageStatus(result.message);
    return;
  }

  day.items = result.items;
  renderSchedule(currentSchedule, currentContext, { skipScroll: true });

  const transportWarning = findTransportOrderWarning(day.items);
  const routeWarnings = getDayRouteWarnings(day);

  showStorageStatus(
    transportWarning ||
    (routeWarnings.length > 0
      ? "순서를 변경했습니다. 동선을 다시 확인해주세요."
      : "일정 순서와 시간이 자동으로 변경되었습니다.")
  );
}

function moveScheduleItemByStep(dayIndex, itemIndex, step) {
  const day = currentSchedule[dayIndex];
  const targetIndex = itemIndex + step;

  if (
    !day ||
    targetIndex < 0 ||
    targetIndex >= day.items.length
  ) {
    return;
  }

  if (
    day.items[itemIndex]?.isWeddingEvent ||
    day.items[targetIndex]?.isWeddingEvent
  ) {
    showStorageStatus("결혼식 일정은 위치를 변경할 수 없습니다.");
    return;
  }

  const reordered = day.items.map((item) => ({ ...item }));
  const [moved] = reordered.splice(itemIndex, 1);
  reordered.splice(targetIndex, 0, moved);

  const result = reflowOrderedDayItems(reordered);

  if (!result.ok) {
    showStorageStatus(result.message);
    return;
  }

  day.items = result.items;
  renderSchedule(currentSchedule, currentContext, { skipScroll: true });
  showStorageStatus(
    findTransportOrderWarning(day.items) ||
    "일정 순서와 시간이 자동으로 변경되었습니다."
  );
}

function reflowOrderedDayItems(items) {
  const ordered = items.map((item) => ({ ...item }));
  const weddingIndex = ordered.findIndex((item) => item.isWeddingEvent);
  const dayStart = Math.max(
    8 * 60,
    Math.min(...ordered.map((item) => item.start))
  );

  if (weddingIndex === -1) {
    let cursor = dayStart;

    for (const item of ordered) {
      const duration = item.end - item.start;
      item.start = cursor;
      item.end = cursor + duration;
      cursor = item.end;

      if (item.end > 24 * 60) {
        return {
          ok: false,
          message: "순서를 변경하면 일정이 24시를 넘습니다."
        };
      }
    }

    return { ok: true, items: ordered };
  }

  const wedding = ordered[weddingIndex];
  let cursor = dayStart;

  for (let index = 0; index < weddingIndex; index += 1) {
    const item = ordered[index];
    const duration = item.end - item.start;
    item.start = cursor;
    item.end = cursor + duration;
    cursor = item.end;

    if (item.end > wedding.start) {
      return {
        ok: false,
        message: "변경한 순서로는 결혼식 시작 전 일정을 모두 배치할 수 없습니다."
      };
    }
  }

  cursor = wedding.end;

  for (let index = weddingIndex + 1; index < ordered.length; index += 1) {
    const item = ordered[index];
    const duration = item.end - item.start;
    item.start = cursor;
    item.end = cursor + duration;
    cursor = item.end;

    if (item.end > 24 * 60) {
      return {
        ok: false,
        message: "변경한 순서로는 결혼식 이후 일정이 24시를 넘습니다."
      };
    }
  }

  return { ok: true, items: ordered };
}

function findTransportOrderWarning(items) {
  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];

    if (
      item.sourceType !== "transport" &&
      item.type !== "transport"
    ) {
      continue;
    }

    if (!item.transportFrom || !item.transportTo) {
      continue;
    }

    const previous = items[index - 1];
    const next = items[index + 1];

    if (
      (previous && !item.title.includes(previous.title)) ||
      (next && !item.title.includes(next.title))
    ) {
      return "순서는 변경됐지만 이동 일정의 출발지·도착지를 확인해주세요.";
    }
  }

  return "";
}

function calculateDayDuration(items) {
  return formatDuration(
    items.reduce((sum, item) => sum + (item.end - item.start), 0)
  );
}

function getSelectedItems(className, sourceObject) {
  return [...document.querySelectorAll(`.${className}:checked`)]
    .map((input) => sourceObject[input.value])
    .filter(Boolean);
}

function getTravelMinutes(fromDistrict, toDistrict) {
  if (!fromDistrict || !toDistrict) {
    return SCHEDULE_RULES.defaultTravelMinutes;
  }

  if (fromDistrict === toDistrict) {
    return SCHEDULE_RULES.districtTravelMinutes[
      `${fromDistrict}-${toDistrict}`
    ] || 15;
  }

  return SCHEDULE_RULES.districtTravelMinutes[
    `${fromDistrict}-${toDistrict}`
  ] || SCHEDULE_RULES.defaultTravelMinutes;
}

function getDayTitle({ isArrivalDay, isDepartureDay }) {
  if (isArrivalDay && isDepartureDay) {
    return "광저우 당일 일정";
  }

  if (isArrivalDay) {
    return "광저우 도착";
  }

  if (isDepartureDay) {
    return "귀국하는 날";
  }

  return "광저우 여행";
}

function getDistrictLabel(district) {
  const labels = {
    liwan: "리완",
    yuexiu: "웨슈",
    zhujiang: "주장신청",
    panyu: "판위",
    airport: "바이윈공항"
  };

  return labels[district] || "광저우";
}

function enumerateDates(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function isDateWithinRange(date, start, end) {
  return date >= start && date <= end;
}

function isSameDate(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function parseDate(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function timeToMinutes(value) {
  if (value === "24:00") {
    return 24 * 60;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  if (minutes >= 24 * 60) {
    return "24:00";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "시간 미정";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `약 ${hours}시간 ${remainingMinutes}분`;
  }

  if (hours > 0) {
    return `약 ${hours}시간`;
  }

  return `약 ${remainingMinutes}분`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short"
  }).format(date);
}



function openScheduleEditModal(target) {
  if (!currentSchedule[target.dayIndex]) {
    return;
  }

  editTarget = target;
  editFormMessage.textContent = "";

  if (target.mode === "edit") {
    const item = currentSchedule[target.dayIndex].items[target.itemIndex];

    if (!item || item.isWeddingEvent) {
      return;
    }

    scheduleEditTitle.textContent = "일정 편집";
    editItemType.value = item.sourceType || item.type || "custom";
    updateEditItemOptions();

    if (item.id) {
      editItemSelect.value = item.id;
    }

    editCustomTitle.value =
      item.sourceType === "custom" || (!item.sourceType && !item.type)
        ? item.title
        : "";

    editTransportFrom.value = item.transportFrom || "";
    editTransportTo.value = item.transportTo || "";
    editTransportMode.value = item.transportMode || "도보";

    editStartTime.value = formatTime(item.start);
    setDurationValue(item.end - item.start);
  } else {
    scheduleEditTitle.textContent = "일정 추가";
    editItemType.value = target.itemType || "place";
    updateEditItemOptions();

    if (target.itemId) {
      editItemSelect.value = target.itemId;

      if (editItemSelect.value !== target.itemId) {
        editFormMessage.textContent =
          "선택한 장소를 일정 목록에서 찾지 못했습니다.";
      }
    }

    editCustomTitle.value = "";
    editTransportFrom.value = "";
    editTransportTo.value = "";
    editTransportMode.value = "도보";
    editStartTime.value = findSuggestedStartTime(target.dayIndex);
    editDuration.value = String(target.duration || 90);
  }

  renderEditItemPreview(false);

  scheduleEditModal.classList.add("open");
  scheduleEditModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeScheduleEditModal() {
  scheduleEditModal.classList.remove("open");
  scheduleEditModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  editTarget = null;
}

function updateEditItemOptions() {
  const type = editItemType.value;
  const isCustom = type === "custom";
  const isTransport = type === "transport";
  const usesSelect = type === "place" || type === "restaurant";

  editItemSelectField.hidden = !usesSelect;
  editCustomTitleField.hidden = !isCustom;
  editTransportFields.hidden = !isTransport;
  editItemPreview.hidden = !usesSelect;

  if (!usesSelect) {
    editItemSelect.innerHTML = "";
    clearEditItemPreview();
    return;
  }

  const items =
    type === "restaurant"
      ? RESTAURANT_OPTIONS
      : PLACE_OPTIONS;

  editItemSelect.innerHTML = items
    .map(
      (item) => `
        <option value="${item.id}">
          ${item.name} · ${getDistrictLabel(item.district)} · ${item.category || ""}
        </option>
      `
    )
    .join("");

  renderEditItemPreview(false);
}

function getEditSelectedItem() {
  const type = editItemType.value;
  const itemId = editItemSelect.value;

  if (type === "restaurant") {
    return RESTAURANTS[itemId] || null;
  }

  if (type === "place") {
    return PLACES[itemId] || null;
  }

  return null;
}

function clearEditItemPreview() {
  editItemPreview.hidden = true;
  editItemPreviewImage.removeAttribute("src");
  editItemPreviewTags.innerHTML = "";
  editItemPreviewDescription.textContent = "";
}

function renderEditItemPreview(updateDuration = false) {
  const item = getEditSelectedItem();

  if (!item) {
    clearEditItemPreview();
    return;
  }

  const itemType = editItemType.value;
  const rawImage =
    item.images?.[0] || "images/places/default-place.svg";

  editItemPreview.hidden = false;
  editItemPreviewImage.onerror = () => {
    editItemPreviewImage.onerror = null;
    editItemPreviewImage.src = resolveAssetUrl(
      "images/places/default-place.svg"
    );
    editItemPreviewStatus.hidden = false;
  };

  editItemPreviewImage.src = resolveAssetUrl(rawImage);
  editItemPreviewImage.alt = `${item.name} 대표 사진`;
  editItemPreviewStatus.hidden = !isPlaceholderImage(rawImage);

  setText(editItemPreviewName, item.name);
  setText(editItemPreviewChinese, item.chineseName || "");
  setText(
    editItemPreviewDescription,
    item.note || item.tips || "상세 설명을 준비 중입니다."
  );
  setText(editItemPreviewAddress, item.addressZh || "주소 준비 중");
  setText(
    editItemPreviewDuration,
    formatDuration(item.duration || 90)
  );
  setText(
    editItemPreviewHours,
    item.hours || formatOpeningHours(item)
  );

  const tags = [
    getDistrictLabel(item.district),
    item.category,
    ...(item.tags || []).slice(0, 2)
  ].filter(Boolean);

  editItemPreviewTags.innerHTML = tags
    .map((tag) => `<span>${escapeHtml(tag)}</span>`)
    .join("");

  editItemPreviewDetailButton.dataset.itemId = item.id;
  editItemPreviewDetailButton.dataset.itemType = itemType;

  if (updateDuration && item.duration) {
    editDuration.value = String(item.duration);
  }
}

function saveScheduleEdit(event) {
  event.preventDefault();

  if (!editTarget || !currentSchedule[editTarget.dayIndex]) {
    return;
  }

  const type = editItemType.value;
  const start = timeToMinutes(editStartTime.value);
  const duration = Number(editDuration.value);
  let newItem;

  if (
    !editStartTime.value ||
    !Number.isFinite(duration) ||
    duration < 5 ||
    duration > 960
  ) {
    showEditError(
      "시작시간과 소요시간을 확인해주세요. 소요시간은 5~960분 사이로 입력할 수 있습니다."
    );
    return;
  }

  if (type === "transport") {
    const transportFrom = editTransportFrom.value.trim();
    const transportTo = editTransportTo.value.trim();
    const transportMode = editTransportMode.value;

    if (!transportFrom || !transportTo) {
      showEditError("이동 일정의 출발지와 도착지를 입력해주세요.");
      return;
    }

    newItem = {
      start,
      end: start + duration,
      title: `${transportFrom} → ${transportTo}`,
      detail: `${transportMode} 이동 · 직접 입력한 이동시간`,
      tag: "이동",
      type: "transport",
      sourceType: "transport",
      transportFrom,
      transportTo,
      transportMode
    };
  } else if (type === "custom") {
    const title = editCustomTitle.value.trim();

    if (!title) {
      showEditError("직접 입력할 일정 이름을 적어주세요.");
      return;
    }

    newItem = {
      start,
      end: start + duration,
      title,
      detail: "사용자가 직접 추가한 일정입니다.",
      tag: "개인 일정",
      sourceType: "custom"
    };
  } else {
    const source = type === "restaurant" ? RESTAURANTS : PLACES;
    const selected = source[editItemSelect.value];

    if (!selected) {
      showEditError("장소 또는 식사를 선택해주세요.");
      return;
    }

    newItem = {
      id: selected.id,
      sourceType: type,
      start,
      end: start + duration,
      title: selected.name,
      detail: selected.note,
      tag: selected.category,
      district: selected.district
    };
  }

  const day = currentSchedule[editTarget.dayIndex];
  const candidateItems = day.items.map((item) => ({ ...item }));

  if (editTarget.mode === "edit") {
    candidateItems[editTarget.itemIndex] = newItem;
  } else {
    candidateItems.push(newItem);
  }

  const result = reflowDayItems(candidateItems);

  if (!result.ok) {
    showEditError(result.message);
    return;
  }

  day.items = result.items;
  renderSchedule(currentSchedule, currentContext, { skipScroll: true });
  closeScheduleEditModal();

  const routeWarnings = getDayRouteWarnings(day);

  showStorageStatus(
    routeWarnings.length > 0
      ? "일정은 저장됐지만 동선 확인이 필요합니다."
      : "수정한 일정이 자동 저장되었습니다."
  );
}

function deleteScheduleItem(dayIndex, itemIndex) {
  const day = currentSchedule[dayIndex];
  const item = day?.items[itemIndex];

  if (!item || item.isWeddingEvent) {
    return;
  }

  const confirmed = window.confirm(`“${item.title}” 일정을 삭제할까요?`);

  if (!confirmed) {
    return;
  }

  day.items.splice(itemIndex, 1);
  renderSchedule(currentSchedule, currentContext, { skipScroll: true });
  showStorageStatus("일정을 삭제하고 자동 저장했습니다.");
}

function reflowDayItems(items) {
  const sorted = items
    .filter((item) => item.end > item.start)
    .sort((a, b) => a.start - b.start)
    .map((item) => ({ ...item }));

  for (let index = 0; index < sorted.length; index += 1) {
    const current = sorted[index];
    const duration = current.end - current.start;

    if (current.start < 8 * 60 && !isTransportOrAirportItem(current)) {
      current.start = 8 * 60;
      current.end = current.start + duration;
    }

    if (index > 0) {
      const previous = sorted[index - 1];

      if (current.start < previous.end) {
        if (current.isWeddingEvent) {
          return {
            ok: false,
            message: "변경한 일정이 결혼식 시간과 겹칩니다. 시작시간이나 소요시간을 줄여주세요."
          };
        }

        current.start = previous.end;
        current.end = current.start + duration;
      }
    }

    if (current.end > 24 * 60) {
      return {
        ok: false,
        message: "뒤 일정을 이동하면 24시를 넘습니다. 시작시간이나 소요시간을 줄여주세요."
      };
    }
  }

  return { ok: true, items: sorted };
}

function isTransportOrAirportItem(item) {
  return item.type === "transport" || item.sourceType === "transport";
}

function findSuggestedStartTime(dayIndex) {
  const items = currentSchedule[dayIndex]?.items || [];
  const lastEnd = items.reduce(
    (latest, item) => Math.max(latest, item.end),
    8 * 60
  );
  return formatTime(Math.min(lastEnd, 22 * 60));
}

function setDurationValue(duration) {
  const normalized = Math.max(
    5,
    Math.min(960, Math.round(duration / 5) * 5)
  );

  editDuration.value = String(normalized);
}

function showEditError(message) {
  editFormMessage.textContent = message;
}

function serializeSchedule(schedule) {
  return schedule.map((day) => ({
    ...day,
    date: new Date(day.date).toISOString(),
    items: day.items.map((item) => ({ ...item }))
  }));
}

function deserializeSchedule(schedule) {
  return schedule.map((day) => ({
    ...day,
    date: new Date(day.date),
    items: day.items.map((item) => ({ ...item }))
  }));
}

function serializeContext(context) {
  if (!context) {
    return null;
  }

  return {
    ...context,
    arrivalDate: new Date(context.arrivalDate).toISOString(),
    departureDate: new Date(context.departureDate).toISOString(),
    dates: context.dates.map((date) => new Date(date).toISOString()),
    selectedPlaces: (context.selectedPlaces || []).map((item) => item.id),
    selectedRestaurants: (context.selectedRestaurants || []).map((item) => item.id)
  };
}

function deserializeContext(context) {
  return {
    ...context,
    arrivalDate: new Date(context.arrivalDate),
    departureDate: new Date(context.departureDate),
    dates: context.dates.map((date) => new Date(date)),
    selectedPlaces: (context.selectedPlaces || []).map((id) => PLACES[id]).filter(Boolean),
    selectedRestaurants: (context.selectedRestaurants || []).map((id) => RESTAURANTS[id]).filter(Boolean)
  };
}

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

  travelLibraryCount.textContent =
    `${items.length}개 장소`;

  if (items.length === 0) {
    travelLibraryGrid.innerHTML = `
      <div class="travel-library-empty">
        <strong>검색 결과가 없습니다.</strong>
        <p>다른 검색어나 지역을 선택해주세요.</p>
      </div>
    `;
    return;
  }

  travelLibraryGrid.innerHTML = items
    .map(createTravelLibraryCard)
    .join("");
}

function createTravelLibraryCard(item) {
  const rawImage =
    item.images?.[0] ||
    "images/places/default-place.svg";

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
        <img
          src="${resolveAssetUrl(rawImage)}"
          alt="${escapeHtml(item.name)} 대표 사진"
          loading="lazy"
          onerror="handleChoiceImageError(this)"
        >
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

function createSharePayload() {
  if (!currentSchedule.length || !currentContext) {
    return null;
  }

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    context: {
      arrivalDate: currentContext.arrivalDate,
      arrivalTime: currentContext.arrivalTime,
      departureDate: currentContext.departureDate,
      departureTime: currentContext.departureTime,
      weddingDate: currentContext.weddingDate
    },
    schedule: currentSchedule
  };
}

function encodeSharePayload(payload) {
  const bytes = new TextEncoder().encode(
    JSON.stringify(payload)
  );
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeSharePayload(encoded) {
  const normalized = encoded
    .replaceAll("-", "+")
    .replaceAll("_", "/");

  const padded =
    normalized +
    "=".repeat((4 - (normalized.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(
    binary,
    (character) => character.charCodeAt(0)
  );

  return JSON.parse(
    new TextDecoder().decode(bytes)
  );
}

function createShareUrl() {
  const payload = createSharePayload();

  if (!payload) {
    return "";
  }

  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(
    "plan",
    encodeSharePayload(payload)
  );

  return url.toString();
}

async function shareCurrentSchedule() {
  const shareUrl = createShareUrl();

  if (!shareUrl) {
    showShareStatus("먼저 일정을 만들어주세요.", true);
    return;
  }

  const travelPeriod = currentContext
    ? `${currentContext.arrivalDate} ~ ${currentContext.departureDate}`
    : "광저우 여행 일정";

  const shareData = {
    title: "광저우 결혼식 여행 일정",
    text: `광저우 결혼식 여행 일정입니다. ${travelPeriod}`,
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showShareStatus(
        "공유창이 열렸습니다. 카카오톡을 선택해주세요."
      );
      return;
    }

    await copyTextToClipboard(shareUrl);
    showShareStatus(
      "공유 링크를 복사했습니다. 카카오톡 대화창에 붙여넣어 주세요."
    );
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    try {
      await copyTextToClipboard(shareUrl);
      showShareStatus(
        "공유 링크를 복사했습니다. 카카오톡 대화창에 붙여넣어 주세요."
      );
    } catch (copyError) {
      console.error(copyError);
      showShareStatus(
        "공유 링크를 복사하지 못했습니다.",
        true
      );
    }
  }
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopyText(text);
}

function showShareStatus(message, isError = false) {
  shareStatus.textContent = message;
  shareStatus.classList.toggle("error", isError);
  shareStatus.classList.add("visible");

  window.setTimeout(() => {
    shareStatus.classList.remove("visible");
  }, 4500);
}

function readSharedPlanFromUrl() {
  const encodedPlan = new URL(
    window.location.href
  ).searchParams.get("plan");

  if (!encodedPlan) {
    return;
  }

  try {
    const payload = decodeSharePayload(encodedPlan);

    if (
      !payload ||
      !Array.isArray(payload.schedule) ||
      payload.schedule.length === 0
    ) {
      throw new Error("공유 일정 데이터가 없습니다.");
    }

    pendingSharedPlan = payload;
    renderSharedPlanSummary(payload);
    openSharedPlanModal();
  } catch (error) {
    console.error("공유 일정 해석 실패:", error);
    showShareStatus(
      "공유받은 일정 링크를 읽을 수 없습니다.",
      true
    );
  }
}

function renderSharedPlanSummary(payload) {
  const context = payload.context || {};
  const totalItems = payload.schedule.reduce(
    (sum, day) => sum + (day.items?.length || 0),
    0
  );

  sharedPlanSummary.innerHTML = `
    <div>
      <span>여행 기간</span>
      <strong>
        ${escapeHtml(context.arrivalDate || "-")}
        ~
        ${escapeHtml(context.departureDate || "-")}
      </strong>
    </div>
    <div>
      <span>일정</span>
      <strong>
        ${payload.schedule.length}일 · ${totalItems}개 항목
      </strong>
    </div>
  `;
}

function openSharedPlanModal() {
  sharedPlanModal.classList.add("open");
  sharedPlanModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSharedPlanModal() {
  sharedPlanModal.classList.remove("open");
  sharedPlanModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function previewSharedPlan() {
  if (!pendingSharedPlan) {
    return;
  }

  applySharedPlan(pendingSharedPlan, false);
  closeSharedPlanModal();
  showShareStatus(
    "공유받은 일정을 미리보기로 불러왔습니다."
  );
}

function saveSharedPlan() {
  if (!pendingSharedPlan) {
    return;
  }

  applySharedPlan(pendingSharedPlan, true);
  closeSharedPlanModal();
  showStorageStatus(
    "공유받은 일정을 내 일정으로 저장했습니다."
  );

  const url = new URL(window.location.href);
  url.searchParams.delete("plan");
  window.history.replaceState(
    {},
    "",
    url.pathname + url.search + url.hash
  );
}

function applySharedPlan(payload, persist) {
  const context = payload.context || {};

  currentContext = {
    ...context
  };

  currentSchedule = JSON.parse(
    JSON.stringify(payload.schedule)
  );

  arrivalInput.value =
    context.arrivalDate || arrivalInput.value;
  arrivalTimeInput.value =
    context.arrivalTime || arrivalTimeInput.value;
  departureInput.value =
    context.departureDate || departureInput.value;
  departureTimeInput.value =
    context.departureTime || departureTimeInput.value;

  renderSchedule(currentSchedule, currentContext);

  if (!persist) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function printCurrentSchedule() {
  if (!currentSchedule.length) {
    showShareStatus("먼저 일정을 만들어주세요.", true);
    return;
  }

  document.body.classList.add("printing-schedule");

  window.setTimeout(() => {
    window.print();

    window.setTimeout(() => {
      document.body.classList.remove(
        "printing-schedule"
      );
    }, 300);
  }, 50);
}

function savePlannerState(options = {}) {
  try {
    const previousState = getSavedPlannerState();

    let renderedScheduleHtml =
      options.renderedScheduleHtml ??
      previousState?.renderedScheduleHtml ??
      "";

    if (options.clearRenderedSchedule) {
      renderedScheduleHtml = "";
    }

    const state = {
      plannerMode,
      arrivalDate: arrivalInput.value,
      arrivalTime: arrivalTimeInput.value,
      departureDate: departureInput.value,
      departureTime: departureTimeInput.value,
      selectedPlaceIds: getCheckedValues("place-choice"),
      selectedRestaurantIds: getCheckedValues("restaurant-choice"),
      renderedScheduleHtml,
      scheduleData: serializeSchedule(currentSchedule),
      contextData: serializeContext(currentContext),
      savedAt: new Date().toISOString()
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));

    if (!options.silent) {
      showStorageStatus("입력 내용이 이 브라우저에 자동 저장되었습니다.");
    }
  } catch (error) {
    console.error("일정 저장 실패:", error);
    showStorageStatus("브라우저 저장 기능을 사용할 수 없습니다.", true);
  }
}

function restorePlannerState() {
  const state = getSavedPlannerState();

  if (!state) {
    return;
  }

  arrivalInput.value = state.arrivalDate || arrivalInput.value;
  arrivalTimeInput.value = state.arrivalTime || arrivalTimeInput.value;
  departureInput.value = state.departureDate || departureInput.value;
  departureTimeInput.value = state.departureTime || departureTimeInput.value;

  setPlannerModeWithoutSaving(state.plannerMode || "recommended");

  restoreCheckedValues("place-choice", state.selectedPlaceIds || []);
  restoreCheckedValues(
    "restaurant-choice",
    state.selectedRestaurantIds || []
  );

  updateSelectAllButton(
    "place-choice",
    selectAllPlacesButton
  );

  updateSelectAllButton(
    "restaurant-choice",
    selectAllRestaurantsButton
  );

  if (state.scheduleData && state.contextData) {
    currentSchedule = deserializeSchedule(state.scheduleData);
    currentContext = deserializeContext(state.contextData);
    renderSchedule(currentSchedule, currentContext, { skipScroll: true });
  } else if (state.renderedScheduleHtml) {
    scheduleResult.innerHTML = state.renderedScheduleHtml;
  }

  showStorageStatus("이전에 저장된 일정을 불러왔습니다.");
}

function getSavedPlannerState() {
  try {
    const savedState = localStorage.getItem(STORAGE_KEY);

    if (!savedState) {
      return null;
    }

    return JSON.parse(savedState);
  } catch (error) {
    console.error("저장된 일정 읽기 실패:", error);
    return null;
  }
}

function resetSavedPlanner() {
  const confirmed = window.confirm(
    "저장된 날짜, 선택 항목, 생성된 일정을 모두 초기화할까요?"
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);
  currentSchedule = [];
  currentContext = null;

  arrivalInput.value = "2026-11-13";
  arrivalTimeInput.value = "14:30";
  departureInput.value = "2026-11-16";
  departureTimeInput.value = "18:30";

  setPlannerModeWithoutSaving("recommended");

  document
    .querySelectorAll(".place-choice, .restaurant-choice")
    .forEach((checkbox) => {
      checkbox.checked = false;
    });

  updateSelectAllButton("place-choice", selectAllPlacesButton);
  updateSelectAllButton(
    "restaurant-choice",
    selectAllRestaurantsButton
  );

  scheduleShareTools.hidden = true;
  shareStatus.textContent = "";

  scheduleResult.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">READY WHEN YOU ARE</p>
      <h3>여행 방식을 선택하고 일정을 만들어보세요.</h3>
      <p>일반 일정은 08:00부터 24:00까지 구성됩니다.</p>
    </div>
  `;

  showStorageStatus("저장된 일정을 초기화했습니다.");
}

function setPlannerModeWithoutSaving(mode) {
  plannerMode = mode;

  modeButtons.forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.mode === mode
    );
  });

  const isCustom = mode === "custom";
  customSelector.hidden = !isCustom;

  createButton.textContent = isCustom
    ? "선택한 장소로 일정 만들기"
    : "추천 일정 만들기";
}

function getCheckedValues(className) {
  return [
    ...document.querySelectorAll(`.${className}:checked`)
  ].map((input) => input.value);
}

function restoreCheckedValues(className, selectedIds) {
  const selectedIdSet = new Set(selectedIds);

  document
    .querySelectorAll(`.${className}`)
    .forEach((checkbox) => {
      checkbox.checked = selectedIdSet.has(checkbox.value);
    });
}

function updateSelectAllButton(className, button) {
  const checkboxes = [
    ...document.querySelectorAll(`.${className}`)
  ];

  const allSelected =
    checkboxes.length > 0 &&
    checkboxes.every((checkbox) => checkbox.checked);

  button.textContent = allSelected
    ? "전체 해제"
    : "전체 선택";
}

function showStorageStatus(message, isError = false) {
  if (!storageStatus) {
    return;
  }

  window.clearTimeout(storageStatusTimer);

  storageStatus.textContent = message;
  storageStatus.classList.toggle("error", isError);
  storageStatus.classList.add("visible");

  storageStatusTimer = window.setTimeout(() => {
    storageStatus.classList.remove("visible");
  }, 3500);
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function resolveAssetUrl(path) {
  try {
    return new URL(path, document.baseURI).href;
  } catch (error) {
    console.error("이미지 경로 변환 실패:", path, error);
    return path;
  }
}

function openDetailModal(itemId, itemType) {
  const source = itemType === "restaurant" ? RESTAURANTS : PLACES;
  const item = source[itemId];

  if (!item) {
    return;
  }

  activeDetailItem = item;

  setText(detailModalCategory,
    itemType === "restaurant" ? "FOOD DETAIL" : "PLACE DETAIL");
  setText(detailModalTitle, item.name);
  setText(detailModalChinese, item.chineseName || "중국어 명칭 준비 중");
  setText(detailModalAddress, item.addressZh || "중국어 주소 준비 중");
  setText(detailModalDuration, formatDuration(item.duration));
  setText(detailModalDescription, item.note || "");
  setText(detailModalHours, item.hours || formatOpeningHours(item));
  setText(detailModalPrice, item.price || "정보 준비 중");
  setText(detailModalBestTime, item.bestTime || "일정에 맞춰 방문");
  setText(
    detailModalTip,
    item.tips || "편한 신발과 충분한 이동 시간을 준비하세요."
  );
  setText(copyFeedback, "");

  renderRestaurantDetail(item, itemType);
  renderNearbyItems(item);
  renderDetailAddControls(item, itemType);

  activeGalleryImages =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ["images/places/default-place.svg"];

  activeGalleryIndex = 0;
  renderGalleryDots();
  showGalleryImage(0);

  openAmapButton.href = createAmapMarkerUrl(item);

  if (!detailModal) {
    console.error("상세창 요소를 찾을 수 없습니다.");
    return;
  }

  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (detailModalPanel) {
    detailModalPanel.scrollTop = 0;

    window.requestAnimationFrame(() => {
      detailModalPanel.scrollTo({
        top: 0,
        behavior: "auto"
      });
    });
  }
}


function renderRestaurantDetail(item, itemType) {
  const isRestaurant = itemType === "restaurant";

  detailRestaurantInfo.hidden = !isRestaurant;

  if (!isRestaurant) {
    detailRecommendedMenu.innerHTML = "";
    detailMenuBlock.hidden = true;
    return;
  }

  setText(
    detailReservation,
    item.reservation || "방문 전 확인"
  );

  const costText = item.averageCostCny
    ? `1인 약 ${item.averageCostCny}위안`
    : item.price || "정보 준비 중";

  setText(detailAverageCost, costText);

  const menus = Array.isArray(item.recommendedMenu)
    ? item.recommendedMenu
    : [];

  detailMenuBlock.hidden = menus.length === 0;
  detailRecommendedMenu.innerHTML = menus
    .map((menu) => `<span>${escapeHtml(menu)}</span>`)
    .join("");
}

function renderNearbyItems(item) {
  const nearbyPlaceItems = (item.nearbyPlaces || [])
    .map((id) => PLACES[id])
    .filter(Boolean);

  const nearbyRestaurantItems =
    (item.nearbyRestaurants || [])
      .map((id) => RESTAURANTS[id])
      .filter(Boolean);

  nearbyPlacesSection.hidden =
    nearbyPlaceItems.length === 0;
  nearbyRestaurantsSection.hidden =
    nearbyRestaurantItems.length === 0;

  nearbyPlacesList.innerHTML = nearbyPlaceItems
    .map((nearby) =>
      createNearbyCard(nearby, "place")
    )
    .join("");

  nearbyRestaurantsList.innerHTML =
    nearbyRestaurantItems
      .map((nearby) =>
        createNearbyCard(nearby, "restaurant")
      )
      .join("");
}

function createNearbyCard(item, itemType) {
  const image =
    item.images?.[0] ||
    "images/places/default-place.svg";

  return `
    <button
      class="nearby-card"
      type="button"
      data-nearby-id="${item.id}"
      data-nearby-type="${itemType}"
    >
      <img
        src="${resolveAssetUrl(image)}"
        alt="${escapeHtml(item.name)} 사진"
        loading="lazy"
        onerror="handleChoiceImageError(this)"
      >
      <span>
        <strong>${escapeHtml(item.name)}</strong>
        <small>
          ${getDistrictLabel(item.district)}
          · ${escapeHtml(item.category || "")}
        </small>
      </span>
      <em>→</em>
    </button>
  `;
}

function renderDetailAddControls(item, itemType) {
  const hasSchedule =
    currentSchedule.length > 0 &&
    currentContext;

  detailAddButton.disabled = !hasSchedule;
  detailAddDaySelect.disabled = !hasSchedule;

  if (!hasSchedule) {
    detailAddDaySelect.innerHTML =
      '<option>일정을 먼저 생성해주세요</option>';
    setText(
      detailAddGuide,
      "추천 일정 또는 직접 선택 일정을 만든 뒤 이 장소를 원하는 날짜에 추가할 수 있습니다."
    );
    return;
  }

  detailAddDaySelect.innerHTML =
    currentSchedule
      .map((day, index) => `
        <option value="${index}">
          DAY ${index + 1} · ${formatShortDate(day.date)}
        </option>
      `)
      .join("");

  setText(
    detailAddGuide,
    `${item.name}을 선택한 날짜의 일정에 추가합니다. 시작시간과 소요시간은 다음 화면에서 조정할 수 있습니다.`
  );

  detailAddButton.dataset.itemType = itemType;
  detailAddButton.dataset.itemId = item.id;
}

function addActiveDetailToSchedule() {
  if (
    !activeDetailItem ||
    currentSchedule.length === 0
  ) {
    setText(
      copyFeedback,
      "먼저 여행 일정을 생성해주세요."
    );
    return;
  }

  const dayIndex = Number(detailAddDaySelect.value);
  const itemType =
    detailAddButton.dataset.itemType || "place";
  const itemId = activeDetailItem.id;
  const duration = activeDetailItem.duration || 90;

  if (
    !Number.isInteger(dayIndex) ||
    !currentSchedule[dayIndex] ||
    !itemId
  ) {
    setText(
      copyFeedback,
      "추가할 날짜 또는 장소 정보를 확인해주세요."
    );
    return;
  }

  closeDetailModal();

  window.requestAnimationFrame(() => {
    openScheduleEditModal({
      mode: "add",
      dayIndex,
      itemType,
      itemId,
      duration
    });
  });
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function showGalleryImage(index) {
  if (activeGalleryImages.length === 0) {
    return;
  }

  activeGalleryIndex =
    (index + activeGalleryImages.length) %
    activeGalleryImages.length;

  const selectedImage =
    activeGalleryImages[activeGalleryIndex] ||
    "images/places/default-place.svg";

  if (detailPhotoStatus) {
    detailPhotoStatus.hidden = !isPlaceholderImage(selectedImage);
  }

  detailModalImage.onerror = () => {
    detailModalImage.onerror = null;
    detailModalImage.src = resolveAssetUrl(
      "images/places/default-place.svg"
    );

    if (detailPhotoStatus) {
      detailPhotoStatus.hidden = false;
    }
  };

  detailModalImage.src = resolveAssetUrl(selectedImage);
  detailModalImage.alt =
    `${activeDetailItem?.name || "장소"} 사진 ${activeGalleryIndex + 1}`;

  [...galleryDots.children].forEach((dot, dotIndex) => {
    dot.classList.toggle(
      "active",
      dotIndex === activeGalleryIndex
    );
  });

  const showButtons = activeGalleryImages.length > 1;
  galleryPrevButton.hidden = !showButtons;
  galleryNextButton.hidden = !showButtons;
}

function renderGalleryDots() {
  galleryDots.innerHTML = activeGalleryImages
    .map(
      (_, index) => `
        <button
          class="gallery-dot ${index === 0 ? "active" : ""}"
          type="button"
          aria-label="${index + 1}번째 사진"
          data-gallery-index="${index}"
        ></button>
      `
    )
    .join("");

  galleryDots
    .querySelectorAll("[data-gallery-index]")
    .forEach((button) => {
      button.addEventListener("click", () => {
        showGalleryImage(
          Number(button.dataset.galleryIndex)
        );
      });
    });
}

function formatOpeningHours(item) {
  if (item.openTime && item.closeTime) {
    return `${item.openTime}~${item.closeTime}`;
  }

  return "정보 준비 중";
}

function closeDetailModal() {
  detailModal.classList.remove("open");
  detailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeDetailItem = null;
}

async function copyActiveAddress() {
  if (!activeDetailItem) {
    return;
  }

  const copyText = [
    activeDetailItem.chineseName || activeDetailItem.name,
    activeDetailItem.addressZh || ""
  ]
    .filter(Boolean)
    .join("\n");

  try {
    await navigator.clipboard.writeText(copyText);
    copyFeedback.textContent = "중국어 장소명과 주소를 복사했습니다.";
  } catch (error) {
    fallbackCopyText(copyText);
    copyFeedback.textContent = "중국어 장소명과 주소를 복사했습니다.";
  }
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function createAmapMarkerUrl(item) {
  const name = encodeURIComponent(item.chineseName || item.name);
  const longitude = item.longitude;
  const latitude = item.latitude;

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${name}&src=wedding-guide&coordinate=gaode&callnative=1`;
  }

  return `https://www.amap.com/search?query=${name}`;
}

function showMessage(message) {
  scheduleResult.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">CHECK YOUR PLAN</p>
      <h3>${message}</h3>
    </div>
  `;
}

const WEDDING_DATE = new Date("2026-11-14T00:00:00");

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

const STORAGE_KEY = "guangzhouWeddingPlannerStateV2";
let storageStatusTimer = null;

const scheduleEditModal = document.querySelector("#scheduleEditModal");
const scheduleEditForm = document.querySelector("#scheduleEditForm");
const scheduleEditTitle = document.querySelector("#scheduleEditTitle");
const editItemType = document.querySelector("#editItemType");
const editItemSelect = document.querySelector("#editItemSelect");
const editItemSelectField = document.querySelector("#editItemSelectField");
const editCustomTitle = document.querySelector("#editCustomTitle");
const editCustomTitleField = document.querySelector("#editCustomTitleField");
const editStartTime = document.querySelector("#editStartTime");
const editDuration = document.querySelector("#editDuration");
const editFormMessage = document.querySelector("#editFormMessage");

let currentSchedule = [];
let currentContext = null;
let editTarget = null;

let activeDetailItem = null;


let plannerMode = "recommended";

initialize();

function initialize() {
  renderChoices();
  bindEvents();
  initializeRevealAnimation();
  restorePlannerState();
}

function bindEvents() {
  createButton.addEventListener("click", createSchedule);

  scheduleResult.addEventListener("click", (event) => {
    const detailTrigger = event.target.closest("[data-detail-id]");
    const editTrigger = event.target.closest("[data-edit-item]");
    const deleteTrigger = event.target.closest("[data-delete-item]");
    const addTrigger = event.target.closest("[data-add-day]");

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

    if (addTrigger) {
      openScheduleEditModal({
        mode: "add",
        dayIndex: Number(addTrigger.dataset.addDay)
      });
    }
  });

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

  document.querySelectorAll("[data-close-edit-modal]").forEach((element) => {
    element.addEventListener("click", closeScheduleEditModal);
  });

  editItemType.addEventListener("change", updateEditItemOptions);
  scheduleEditForm.addEventListener("submit", saveScheduleEdit);

  resetScheduleButton.addEventListener("click", resetSavedPlanner);

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
  return `
    <label class="choice-card">
      <input
        class="${inputClass}"
        type="checkbox"
        value="${item.id}"
      >
      <span class="choice-check">✓</span>
      <span class="choice-content">
        <strong>${item.name}</strong>
        <small>${getDistrictLabel(item.district)} · ${item.category}</small>
        <em>${formatDuration(item.duration)}</em>
      </span>
    </label>
  `;
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

  renderSchedule(schedule, context);
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

    <div class="schedule-list">
      ${schedule.map((day, dayIndex) => createScheduleCard(day, dayIndex)).join("")}
    </div>
  `;

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
  const actionButtons = locked
    ? `<span class="locked-schedule-label">필수 일정 · 변경 불가</span>`
    : `
      <div class="timeline-edit-actions">
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

  return `
    <div class="timeline-item ${weddingEventClass}">
      <div class="timeline-time">
        <span>${formatTime(item.start)}</span>
        <small>${formatTime(item.end)}</small>
      </div>

      <div class="timeline-content">
        ${weddingBadge}
        <div class="timeline-title-row">
          <p class="timeline-title">${item.title}</p>
          ${item.id
            ? `<button
                 class="detail-button"
                 type="button"
                 data-detail-id="${item.id}"
                 data-detail-type="${item.sourceType || "place"}"
               >상세보기</button>`
            : ""}
        </div>
        <p class="timeline-detail">${item.detail}</p>

        <div class="timeline-meta">
          <span class="place-tag">${item.tag}</span>
          <span class="duration-tag">
            소요시간 ${formatDuration(item.end - item.start)}
          </span>
        </div>

        ${actionButtons}
      </div>
    </div>
  `;
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
    editItemType.value = item.sourceType || "custom";
    updateEditItemOptions();

    if (item.id) {
      editItemSelect.value = item.id;
    }

    editCustomTitle.value = item.sourceType ? "" : item.title;
    editStartTime.value = formatTime(item.start);
    setDurationValue(item.end - item.start);
  } else {
    scheduleEditTitle.textContent = "일정 추가";
    editItemType.value = "place";
    updateEditItemOptions();
    editCustomTitle.value = "";
    editStartTime.value = findSuggestedStartTime(target.dayIndex);
    editDuration.value = "90";
  }

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

  editItemSelectField.hidden = isCustom;
  editCustomTitleField.hidden = !isCustom;

  if (isCustom) {
    editItemSelect.innerHTML = "";
    return;
  }

  const items = type === "restaurant" ? RESTAURANT_OPTIONS : PLACE_OPTIONS;
  editItemSelect.innerHTML = items
    .map(
      (item) => `
        <option value="${item.id}">
          ${item.name} · ${getDistrictLabel(item.district)}
        </option>
      `
    )
    .join("");
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

  if (!editStartTime.value || !Number.isFinite(duration)) {
    showEditError("시작시간과 소요시간을 확인해주세요.");
    return;
  }

  if (type === "custom") {
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
  showStorageStatus("수정한 일정이 자동 저장되었습니다.");
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
  const allowed = [30, 60, 90, 120, 150, 180, 240, 480];
  const closest = allowed.reduce((best, value) =>
    Math.abs(value - duration) < Math.abs(best - duration) ? value : best
  );
  editDuration.value = String(closest);
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

function openDetailModal(itemId, itemType) {
  const source = itemType === "restaurant" ? RESTAURANTS : PLACES;
  const item = source[itemId];

  if (!item) {
    return;
  }

  activeDetailItem = item;

  detailModalCategory.textContent =
    itemType === "restaurant" ? "FOOD DETAIL" : "PLACE DETAIL";
  detailModalTitle.textContent = item.name;
  detailModalChinese.textContent = item.chineseName || "중국어 명칭 준비 중";
  detailModalAddress.textContent = item.addressZh || "중국어 주소 준비 중";
  detailModalDuration.textContent = formatDuration(item.duration);
  detailModalDescription.textContent = item.note || "";
  detailModalHours.textContent = item.hours || formatOpeningHours(item);
  detailModalPrice.textContent = item.price || "정보 준비 중";
  detailModalBestTime.textContent = item.bestTime || "일정에 맞춰 방문";
  detailModalTip.textContent = item.tips || "편한 신발과 충분한 이동 시간을 준비하세요.";
  copyFeedback.textContent = "";

  activeGalleryImages =
    Array.isArray(item.images) && item.images.length > 0
      ? item.images
      : ["images/places/default-place.svg"];

  activeGalleryIndex = 0;
  renderGalleryDots();
  showGalleryImage(0);

  openAmapButton.href = createAmapMarkerUrl(item);

  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}


function showGalleryImage(index) {
  if (activeGalleryImages.length === 0) {
    return;
  }

  activeGalleryIndex =
    (index + activeGalleryImages.length) %
    activeGalleryImages.length;

  detailModalImage.src =
    activeGalleryImages[activeGalleryIndex];

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

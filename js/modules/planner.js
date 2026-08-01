/* Sprint 1-2 planner module. Classic scripts preserve existing global behavior. */

function renderChoices() {
  placeChoices.innerHTML = PLACE_OPTIONS.map((place) =>
    createChoiceCard(place, "place-choice")
  ).join("");

  restaurantChoices.innerHTML = RESTAURANT_OPTIONS.map((restaurant) =>
    createChoiceCard(restaurant, "restaurant-choice")
  ).join("");
}

function createChoiceCard(item, inputClass) {
  const rawImage = getThumbnailImage(item);
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
        ${createLazyImageMarkup({
          src: rawImage,
          alt: `${item.name} 사진`,
          className: "choice-image",
          fallbackType: "choice"
        })}
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

  const selectedPlaces = [];
  const selectedRestaurants = [];

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

  context.excludedItems = [];

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
  return context.dates.map((date, index) => {
    const isArrivalDay = index === 0;
    const isDepartureDay = index === context.dates.length - 1;
    const isWeddingDay = isSameDate(date, WEDDING_DATE);

    if (isWeddingDay) {
      return buildCustomWeddingDay(date, index);
    }

    const items = [];

    if (isArrivalDay) {
      const arrivalStart = timeToMinutes(context.arrivalTime);

      items.push({
        start: arrivalStart,
        end: arrivalStart + 60,
        title: "광저우 도착",
        detail: "도착 후 필요한 준비를 진행하세요.",
        tag: "도착",
        type: "transport",
        sourceType: "transport",
        transportFrom: "공항",
        transportTo: "광저우"
      });
    }

    if (isDepartureDay) {
      const departureEnd = timeToMinutes(context.departureTime);
      const departureStart = Math.max(departureEnd - 60, 0);

      items.push({
        start: departureStart,
        end: departureEnd,
        title: "광저우 출발",
        detail: "출국 전 이동 및 탑승 준비를 진행하세요.",
        tag: "출발",
        type: "transport",
        sourceType: "transport",
        transportFrom: "광저우",
        transportTo: "공항"
      });
    }

    return {
      date,
      index,
      title: getDayTitle({ isArrivalDay, isDepartureDay }),
      items
    };
  });
}

function buildCustomWeddingDay(date, index) {
  return {
    date,
    index,
    title: "Wedding Day",
    items: [
      {
        start: 14 * 60,
        end: 17 * 60,
        title: PLACES.weddingHotel.name,
        detail: PLACES.weddingHotel.note,
        tag: "Wedding",
        isWeddingEvent: true
      }
    ]
  };
}

function buildEmptyCustomDayItems(dayWindow) {
  const safeStart = Math.max(timeToMinutes(SCHEDULE_RULES.dayStart), dayWindow.start);
  const safeEnd = Math.min(timeToMinutes(SCHEDULE_RULES.dayEnd), dayWindow.end);
  const windowMinutes = Math.max(safeEnd - safeStart, 30);

  const slotCount =
    windowMinutes >= 180
      ? 3
      : windowMinutes >= 90
        ? 2
        : 1;

  const rawSlotDuration = Math.floor((windowMinutes / slotCount) / 5) * 5;
  const slotDuration = Math.max(rawSlotDuration, 30);
  const step = slotCount > 1
    ? Math.max(Math.floor(((windowMinutes - slotDuration) / (slotCount - 1)) / 5) * 5, 5)
    : 0;

  const items = [];

  for (let slotIndex = 0; slotIndex < slotCount; slotIndex += 1) {
    const start = safeStart + (step * slotIndex);
    const end = Math.min(start + slotDuration, safeEnd);

    if (end <= start) {
      continue;
    }

    items.push({
      start,
      end,
      title: `빈 일정 ${slotIndex + 1}`,
      detail: "원하는 관광지, 식사, 이동, 개인 일정을 직접 채워주세요.",
      tag: "직접 작성",
      sourceType: "custom"
    });
  }

  return items;
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
      items: compactDayItems(items)
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

function compactDayItems(items) {
  const normalized = normalizeItems(items).map((item) => ({ ...item }));

  if (normalized.length === 0) {
    return normalized;
  }

  let cursor = Math.max(normalized[0].start, 8 * 60);

  for (const item of normalized) {
    if (item.isWeddingEvent) {
      cursor = item.end;
      continue;
    }

    const duration = item.end - item.start;
    const source = getScheduleSourceItem(item);
    let nextStart = cursor;

    if (source?.openTime) {
      nextStart = Math.max(nextStart, timeToMinutes(source.openTime));
    }

    item.start = nextStart;
    item.end = nextStart + duration;
    cursor = item.end;
  }

  return normalized;
}

function ensureActiveScheduleDayIndex(schedule) {
  if (!Array.isArray(schedule) || schedule.length === 0) {
    activeScheduleDayIndex = 0;
    return;
  }

  activeScheduleDayIndex = Math.max(
    0,
    Math.min(activeScheduleDayIndex, schedule.length - 1)
  );
}

function createScheduleDayTabs(schedule) {
  if (!schedule || schedule.length === 0) {
    return "";
  }

  return `
    <nav class="schedule-day-tabs" aria-label="일정 날짜 탭">
      ${schedule
        .map((day, dayIndex) => `
          <button
            type="button"
            class="schedule-day-tab ${dayIndex === activeScheduleDayIndex ? "active" : ""}"
            data-day-tab="${dayIndex}"
            aria-selected="${dayIndex === activeScheduleDayIndex ? "true" : "false"}"
          >
            DAY ${day.index + 1}
          </button>
        `)
        .join("")}
    </nav>
  `;
}

function applyActiveScheduleDay(index) {
  const cards = [...scheduleResult.querySelectorAll("[data-day-card]")];
  const tabs = [...scheduleResult.querySelectorAll("[data-day-tab]")];

  if (cards.length === 0) {
    return;
  }

  const safeIndex = Math.max(0, Math.min(index, cards.length - 1));
  activeScheduleDayIndex = safeIndex;

  cards.forEach((card, cardIndex) => {
    const isActive = cardIndex === safeIndex;
    card.hidden = !isActive;
    card.classList.toggle("active", isActive);
  });

  tabs.forEach((tab, tabIndex) => {
    const isActive = tabIndex === safeIndex;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
  });

  const activeTab = tabs[safeIndex];
  activeTab?.scrollIntoView({
    block: "nearest",
    inline: "center"
  });
}

function moveScheduleDayByStep(step) {
  const cards = scheduleResult.querySelectorAll("[data-day-card]");

  if (!cards.length) {
    return;
  }

  applyActiveScheduleDay(activeScheduleDayIndex + step);
}

function renderSchedule(schedule, context, options = {}) {
  ensureActiveScheduleDayIndex(schedule);
  if (!options.preserveMoveIndicator) {
    recentScheduleMove = null;
  }
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

    <section class="schedule-day-shell" aria-label="일정 일자별 보기">
      <div class="schedule-day-shell-header">
        ${createScheduleDayTabs(schedule)}
        <p class="schedule-quick-guide">
          DAY 탭 또는 좌우 스와이프로 날짜를 이동하고, 순서는 위/아래 버튼으로 바꿀 수 있습니다.
        </p>
      </div>

      <div class="schedule-list schedule-day-scroll" id="scheduleDayPanels">
        ${schedule
          .map((day, dayIndex) =>
            createScheduleCard(
              day,
              dayIndex,
              dayIndex === activeScheduleDayIndex
            )
          )
          .join("")}
      </div>
    </section>

    ${createExcludedItemsSection(context.excludedItems || [])}
  `;

  scheduleShareTools.hidden = false;
  initializeLazyImages(scheduleResult);
  applyActiveScheduleDay(activeScheduleDayIndex);

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

function createDayRouteWarning(day) {
  return "";
}

function getDayRouteWarnings(day) {
  return [];
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

function createScheduleCard(day, dayIndex, isActive) {
  const totalDuration = calculateDayDuration(day.items);

  return `
    <article
      class="schedule-card schedule-day-card ${isActive ? "active" : ""}"
      data-day-card="${dayIndex}"
      ${isActive ? "" : "hidden"}
    >
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
        + 일정 추가
      </button>
    </article>
  `;
}

function createTimelineItem(item, dayIndex, itemIndex) {
  const weddingEventClass = item.isWeddingEvent ? "wedding-event" : "";
  const locked = item.isWeddingEvent;
  const isRecentlyMoved =
    recentScheduleMove?.dayIndex === dayIndex &&
    recentScheduleMove?.itemIndex === itemIndex;
  const sourceItem = getScheduleSourceItem(item);
  const isTransport =
    item.sourceType === "transport" ||
    item.type === "transport";

  const itemType =
    item.sourceType === "restaurant"
      ? "restaurant"
      : "place";

  const dayItemCount = currentSchedule[dayIndex]?.items?.length || 0;

  const cardLayoutClass = "timeline-card-layout no-thumbnail";

  const chineseName = sourceItem?.chineseName
    ? `<span class="timeline-chinese-name">${escapeHtml(sourceItem.chineseName)}</span>`
    : "";

  const desktopActions = locked
    ? `
      <div class="timeline-edit-actions desktop-card-actions">
        <span class="locked-schedule-label">필수 일정</span>
      </div>
    `
    : `
      <div class="timeline-edit-actions desktop-card-actions">
        <button
          class="timeline-insert-button"
          type="button"
          data-add-after-item
          data-day-index="${dayIndex}"
          data-item-index="${itemIndex}"
          data-item-type="${itemType}"
        >+ 추가</button>
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

  const mobileInlineActions = locked
    ? ""
    : `
      <div class="timeline-mobile-inline-actions" aria-label="모바일 일정 편집 버튼">
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

  const mobileMenuButton = locked
    ? ""
    : `
      <button
        class="timeline-inline-add"
        type="button"
        aria-label="${escapeHtml(item.title)} 뒤에 일정 추가"
        data-add-after-item
        data-day-index="${dayIndex}"
        data-item-index="${itemIndex}"
        data-item-type="${itemType}"
      >
        +
      </button>
    `;

  const mobileMoveButtons = locked
    ? ""
    : `
      <div class="timeline-mobile-move-buttons" aria-label="모바일 순서 변경 버튼">
        <button
          class="timeline-mobile-move"
          type="button"
          aria-label="위로 이동"
          data-move-item="-1"
          data-day-index="${dayIndex}"
          data-item-index="${itemIndex}"
          ${itemIndex === 0 ? "disabled" : ""}
        >↑</button>
        <button
          class="timeline-mobile-move"
          type="button"
          aria-label="아래로 이동"
          data-move-item="1"
          data-day-index="${dayIndex}"
          data-item-index="${itemIndex}"
          ${itemIndex === dayItemCount - 1 ? "disabled" : ""}
        >↓</button>
      </div>
    `;

  const reorderControls = locked
    ? ""
    : `
      <div class="timeline-reorder-controls">
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
          ${itemIndex === dayItemCount - 1 ? "disabled" : ""}
        >↓</button>
      </div>
    `;

  const compactMeta = [
    isRecentlyMoved
      ? `<span class="timeline-move-badge">변경됨</span>`
      : "",
    sourceItem?.district
      ? `<span class="district-tag">${escapeHtml(getDistrictLabel(sourceItem.district))}</span>`
      : "",
    `<span class="place-tag">${escapeHtml(item.tag)}</span>`,
    `<span class="duration-tag">⏱ ${formatDuration(item.end - item.start)}</span>`
  ].filter(Boolean).join("");

  const transportBody = isTransport
    ? `
      <div class="transport-route-visual">
        <span>${escapeHtml(item.transportFrom || "출발지")}</span>
        <i aria-hidden="true">↓</i>
        <strong>${escapeHtml(item.transportTo || "도착지")}</strong>
      </div>
      <p class="timeline-transport-mode">${escapeHtml(item.transportMode || "이동")}</p>
    `
    : `
      <div class="timeline-title-row">
        <p class="timeline-title" title="${escapeHtml(item.title)}">
          ${escapeHtml(item.title)}
        </p>
        ${chineseName}
      </div>
    `;

  const weddingBody = item.isWeddingEvent
    ? `
      <div class="wedding-mobile-heading">
        <span class="wedding-event-label">WEDDING DAY</span>
        <strong title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</strong>
        ${chineseName}
      </div>
    `
    : transportBody;

  return `
    <article
      class="timeline-item ${weddingEventClass} ${isTransport ? "transport-event" : "place-event"} ${isRecentlyMoved ? "recently-moved" : ""}"
      data-day-index="${dayIndex}"
      data-item-index="${itemIndex}"
    >
      ${reorderControls}
      ${mobileMenuButton}
      ${mobileMoveButtons}

      <div class="timeline-time">
        <span>${formatTime(item.start)}</span>
        <small>${formatTime(item.end)}</small>
      </div>

      <div class="timeline-content">
        <div class="${cardLayoutClass}">
          <div
            class="timeline-card-copy"
            ${item.id && !isTransport
              ? `data-open-item-detail data-detail-id="${item.id}" data-detail-type="${itemType}" role="button" tabindex="0" aria-label="${escapeHtml(item.title)} 상세보기 열기"`
              : ""}
          >
            ${weddingBody}

            <div class="timeline-meta">
              ${compactMeta}
            </div>

            ${mobileInlineActions}

            ${desktopActions}
          </div>
        </div>
      </div>
    </article>
  `;
}

function openScheduleActionSheet(dayIndex, itemIndex) {
  const day = currentSchedule[dayIndex];
  const item = day?.items?.[itemIndex];

  if (!item || item.isWeddingEvent) {
    return;
  }

  activeScheduleAction = {
    dayIndex,
    itemIndex
  };

  scheduleActionTitle.textContent = item.title;
  scheduleActionSheet.classList.add("open");
  scheduleActionSheet.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  const detailButton =
    scheduleActionSheet.querySelector('[data-sheet-action="detail"]');

  detailButton.hidden = !item.id;
}

function closeScheduleActionSheet() {
  scheduleActionSheet.classList.remove("open");
  scheduleActionSheet.setAttribute("aria-hidden", "true");
  activeScheduleAction = null;

  if (
    !detailModal.classList.contains("open") &&
    !scheduleEditModal.classList.contains("open") &&
    !sharedPlanModal.classList.contains("open") &&
    !travelGuideModal.classList.contains("open")
  ) {
    document.body.classList.remove("modal-open");
  }
}

function handleScheduleSheetAction(action) {
  if (!activeScheduleAction) {
    return;
  }

  const { dayIndex, itemIndex } = activeScheduleAction;
  const item = currentSchedule[dayIndex]?.items?.[itemIndex];

  if (!item) {
    closeScheduleActionSheet();
    return;
  }

  closeScheduleActionSheet();

  if (action === "detail" && item.id) {
    openDetailModal(
      item.id,
      item.sourceType === "restaurant"
        ? "restaurant"
        : "place"
    );
    return;
  }

  if (action === "edit") {
    openScheduleEditModal({
      mode: "edit",
      dayIndex,
      itemIndex
    });
    return;
  }

  if (action === "delete") {
    deleteScheduleItem(dayIndex, itemIndex);
    return;
  }

  if (action === "move-up") {
    moveScheduleItemByStep(dayIndex, itemIndex, -1);
    return;
  }

  if (action === "move-down") {
    moveScheduleItemByStep(dayIndex, itemIndex, 1);
  }
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
  recentScheduleMove = {
    dayIndex,
    itemIndex: targetIndex,
    changedAt: Date.now()
  };
  renderSchedule(currentSchedule, currentContext, {
    skipScroll: true,
    preserveMoveIndicator: true
  });
  showStorageStatus("일정 순서와 시간이 자동으로 변경되었습니다.");
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

function openScheduleEditModal(target) {
  if (!currentSchedule[target.dayIndex]) {
    return;
  }

  editTarget = target;
  editFormMessage.textContent = "";
  editPickerSearch.value = "";
  activeEditPicker = "recommended";

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

    setEditStartTimeFromMinutes(item.start);
    setDurationValue(item.end - item.start);
  } else {
    scheduleEditTitle.textContent = "일정 추가";
    editItemType.value = target.itemType || "place";

    if (editItemType.value === "restaurant") {
      activeEditPicker = "food";
    } else if (editItemType.value === "place") {
      activeEditPicker = "tour";
    }

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
    setEditStartTimeFromMinutes(
      findSuggestedStartTime(
        target.dayIndex,
        target.insertAfterIndex
      )
    );
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
  editPickerControls.hidden = true;
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

  renderEditItemSelectOptions(items, type);
  renderEditItemPreview(false);
}

function renderEditItemSelectOptions(items, type) {
  const filteredItems = [...items];

  editItemSelect.innerHTML = filteredItems
    .map(
      (item) => `
        <option value="${item.id}">
          ${item.name} · ${getDistrictLabel(item.district)} · ${item.category || ""}
        </option>
      `
    )
    .join("");

  if (filteredItems.length === 0) {
    editItemSelect.innerHTML = "<option value=''>검색 결과가 없습니다.</option>";
    clearEditItemPreview();
    return;
  }

  if (!filteredItems.some((item) => item.id === editItemSelect.value)) {
    editItemSelect.value = filteredItems[0].id;
  }
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
  const rawImage = getThumbnailImage(item);

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
  const start = getEditStartMinutes();
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
  const insertAfterIndex = Number.isInteger(editTarget.insertAfterIndex)
    ? editTarget.insertAfterIndex
    : null;

  if (editTarget.mode === "edit") {
    candidateItems[editTarget.itemIndex] = newItem;
  } else {
    if (
      insertAfterIndex !== null &&
      insertAfterIndex >= -1 &&
      insertAfterIndex < candidateItems.length
    ) {
      candidateItems.splice(insertAfterIndex + 1, 0, newItem);
    } else {
      candidateItems.push(newItem);
    }
  }

  const result = editTarget.mode === "edit"
    ? reflowDayItems(candidateItems)
    : reflowOrderedDayItems(candidateItems);

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
  }

  return { ok: true, items: sorted };
}

function isTransportOrAirportItem(item) {
  return item.type === "transport" || item.sourceType === "transport";
}

function findSuggestedStartTime(dayIndex, insertAfterIndex) {
  const items = currentSchedule[dayIndex]?.items || [];

  if (
    Number.isInteger(insertAfterIndex) &&
    insertAfterIndex >= 0 &&
    insertAfterIndex < items.length
  ) {
    return items[insertAfterIndex].end;
  }

  return items.reduce(
    (latest, item) => Math.max(latest, item.end),
    8 * 60
  );
}

function setEditStartTimeFromMinutes(minutes) {
  const safeMinutes = Number.isFinite(minutes)
    ? Math.max(0, Math.round(minutes))
    : 8 * 60;

  editStartTime.value = formatTimeForInput(safeMinutes);
  editStartTime.dataset.dayOffset = String(
    Math.floor(safeMinutes / (24 * 60))
  );
}

function getEditStartMinutes() {
  const base = timeToMinutes(editStartTime.value);
  const dayOffset = Number(editStartTime.dataset.dayOffset || "0");

  if (!Number.isFinite(base)) {
    return NaN;
  }

  return base + (Math.max(0, dayOffset) * 24 * 60);
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

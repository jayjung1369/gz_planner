/* Sprint 1-2 storage module. Classic scripts preserve existing global behavior. */

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

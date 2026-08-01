/* Sprint 1-2 events module. Classic scripts preserve existing global behavior. */

function bindEvents() {
  createButton.addEventListener("click", createSchedule);

  scheduleResult.addEventListener("click", (event) => {
    const detailTrigger = event.target.closest("[data-detail-id]");
    const editTrigger = event.target.closest("[data-edit-item]");
    const deleteTrigger = event.target.closest("[data-delete-item]");
    const addTrigger = event.target.closest("[data-add-day]");
    const moveTrigger = event.target.closest("[data-move-item]");
    const sheetTrigger = event.target.closest("[data-open-action-sheet]");

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

    if (sheetTrigger) {
      openScheduleActionSheet(
        Number(sheetTrigger.dataset.dayIndex),
        Number(sheetTrigger.dataset.itemIndex)
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

  scheduleActionSheet.addEventListener("click", (event) => {
    const closeTrigger =
      event.target.closest("[data-close-action-sheet]");
    const actionTrigger =
      event.target.closest("[data-sheet-action]");

    if (closeTrigger) {
      closeScheduleActionSheet();
      return;
    }

    if (actionTrigger) {
      handleScheduleSheetAction(
        actionTrigger.dataset.sheetAction
      );
    }
  });

  printScheduleButton.addEventListener("click", printCurrentSchedule);
  shareScheduleButton.addEventListener("click", shareCurrentSchedule);
  previewSharedPlanButton.addEventListener("click", previewSharedPlan);
  saveSharedPlanButton.addEventListener("click", saveSharedPlan);
  cancelSharedPlanButton.addEventListener("click", closeSharedPlanModal);
  sharedPlanModal
    .querySelector(".shared-plan-backdrop")
    .addEventListener("click", closeSharedPlanModal);

  travelLibrarySearch.addEventListener("input", () => {
    travelVisibleCount = TRAVEL_BATCH_SIZE;
    renderTravelLibraryCards();
  });

  travelLoadMoreButton.addEventListener(
    "click",
    loadMoreTravelItems
  );

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

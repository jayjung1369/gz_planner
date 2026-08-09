/* Sprint 1-2 events module. Classic scripts preserve existing global behavior. */

function bindEvents() {
  if (createButton) {
    createButton.addEventListener("click", createSchedule);
  }

  if (!scheduleResult) {
    return;
  }

  scheduleResult.addEventListener("click", (event) => {
    const dayTabTrigger = event.target.closest("[data-day-tab]");
    const detailTrigger = event.target.closest("[data-detail-id]");
    const itemDetailTrigger = event.target.closest("[data-open-item-detail]");

    if (dayTabTrigger) {
      applyActiveScheduleDay(Number(dayTabTrigger.dataset.dayTab));
      return;
    }

    if (detailTrigger) {
      openDetailModal(
        detailTrigger.dataset.detailId,
        detailTrigger.dataset.detailType
      );
      return;
    }

    if (itemDetailTrigger) {
      openDetailModal(
        itemDetailTrigger.dataset.detailId,
        itemDetailTrigger.dataset.detailType
      );
      return;
    }
  });

  scheduleResult.addEventListener("touchstart", (event) => {
    const scroller = event.target.closest(".schedule-day-scroll");

    if (!scroller || scroller.scrollHeight <= scroller.clientHeight) {
      scheduleInnerScrollState = null;
      return;
    }

    const touch = event.changedTouches?.[0];

    if (!touch) {
      return;
    }

    scheduleInnerScrollState = {
      scroller,
      startX: touch.clientX,
      startY: touch.clientY,
      startTop: scroller.scrollTop
    };
  }, { passive: true });

  scheduleResult.addEventListener("touchmove", (event) => {
    if (!scheduleInnerScrollState) {
      return;
    }

    const touch = event.changedTouches?.[0];

    if (!touch) {
      return;
    }

    const deltaX = touch.clientX - scheduleInnerScrollState.startX;
    const deltaY = touch.clientY - scheduleInnerScrollState.startY;

    if (Math.abs(deltaX) > Math.abs(deltaY) + 8) {
      return;
    }

    event.preventDefault();
    scheduleInnerScrollState.scroller.scrollTop =
      scheduleInnerScrollState.startTop - deltaY;
  }, { passive: false });

  scheduleResult.addEventListener("touchcancel", () => {
    scheduleInnerScrollState = null;
  }, { passive: true });

  scheduleResult.addEventListener("touchstart", (event) => {
    const activeCard = event.target.closest("[data-day-card].active");

    if (!activeCard) {
      scheduleSwipeState = null;
      return;
    }

    const touch = event.changedTouches?.[0];

    if (!touch) {
      return;
    }

    scheduleSwipeState = {
      startX: touch.clientX,
      startY: touch.clientY
    };
  }, { passive: true });

  scheduleResult.addEventListener("touchend", (event) => {
    if (!scheduleSwipeState) {
      return;
    }

    const touch = event.changedTouches?.[0];

    if (!touch) {
      scheduleSwipeState = null;
      return;
    }

    const deltaX = touch.clientX - scheduleSwipeState.startX;
    const deltaY = touch.clientY - scheduleSwipeState.startY;

    scheduleSwipeState = null;

    if (Math.abs(deltaX) < 42 || Math.abs(deltaY) > 34) {
      return;
    }

    moveScheduleDayByStep(deltaX < 0 ? 1 : -1);
  }, { passive: true });

  scheduleResult.addEventListener("touchend", () => {
    scheduleInnerScrollState = null;
  }, { passive: true });

  scheduleResult.addEventListener("keydown", (event) => {
    const itemDetailTrigger = event.target.closest("[data-open-item-detail]");

    if (!itemDetailTrigger) {
      return;
    }

    if (event.key !== "Enter" && event.key !== " ") {
      return;
    }

    event.preventDefault();
    openDetailModal(
      itemDetailTrigger.dataset.detailId,
      itemDetailTrigger.dataset.detailType
    );
  });

  document.querySelectorAll("[data-close-modal]").forEach((element) => {
    element.addEventListener("click", closeDetailModal);
  });

  copyAddressButton.addEventListener("click", copyActiveAddress);
  detailModalShareButton.addEventListener("click", shareActiveDetail);

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

  window.addEventListener("resize", () => {
    if (!detailModal?.classList.contains("open")) {
      return;
    }

    if (!activeGalleryImages.length) {
      return;
    }

    showGalleryImage(activeGalleryIndex);
  });

  previewSharedPlanButton.addEventListener("click", previewSharedPlan);
  saveSharedPlanButton.addEventListener("click", saveSharedPlan);
  cancelSharedPlanButton.addEventListener("click", closeSharedPlanModal);
  sharedPlanModal
    .querySelector(".shared-plan-backdrop")
    .addEventListener("click", closeSharedPlanModal);

  travelLibrarySearch.addEventListener("input", () => {
    if (travelLibrarySearch.value.trim()) {
      activeTravelFacet = "search";
    }
    travelVisibleCount = TRAVEL_BATCH_SIZE;
    renderTravelLibraryCards();
  });

  travelSortSelect.addEventListener("change", () => {
    activeTravelSort = travelSortSelect.value;
    travelVisibleCount = TRAVEL_BATCH_SIZE;
    renderTravelLibraryCards();
  });

  travelResetButton.addEventListener(
    "click",
    resetTravelLibraryFilters
  );

  travelLoadMoreButton.addEventListener(
    "click",
    loadMoreTravelItems
  );

  travelTypeFilters.addEventListener("click", (event) => {
    const facetButton = event.target.closest("[data-travel-facet]");

    if (facetButton) {
      activeTravelFacet = facetButton.dataset.travelFacet;

      if (activeTravelFacet === "district") {
        travelDistrictFilters.scrollIntoView({
          behavior: "smooth",
          block: "nearest"
        });
      }

      if (activeTravelFacet === "search") {
        travelLibrarySearch.focus();
      }

      if (activeTravelFacet === "tour") {
        activeTravelType = "place";
      } else if (activeTravelFacet === "food") {
        activeTravelType = "restaurant";
      } else {
        activeTravelType = "all";
      }

      travelVisibleCount = TRAVEL_BATCH_SIZE;
      renderTravelLibrary();
      return;
    }

    const button = event.target.closest("[data-travel-type]");

    if (!button) {
      return;
    }

    activeTravelType = button.dataset.travelType;
    activeTravelFacet =
      activeTravelType === "place"
        ? "tour"
        : activeTravelType === "restaurant"
          ? "food"
          : "recommended";
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
    const resetButton =
      event.target.closest("[data-reset-travel-library]");

    if (resetButton) {
      resetTravelLibraryFilters();
      return;
    }

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

  if (customSelector) {
    customSelector.addEventListener("change", (event) => {
      if (event.target.matches("input[type='checkbox']")) {
        savePlannerState({ clearRenderedSchedule: true });
      }
    });
  }

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    if (detailModal.classList.contains("open")) {
      closeDetailModal();
    }
  });


  modeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setPlannerMode(button.dataset.mode);
    });
  });

  if (selectAllPlacesButton) {
    selectAllPlacesButton.addEventListener("click", () => {
      toggleAllChoices("place-choice", selectAllPlacesButton);
    });
  }

  // Map selection menu event listeners
  const detailModalMapButton = document.getElementById("detailModalMapButton");
  if (detailModalMapButton) {
    detailModalMapButton.addEventListener("click", openMapSelectionMenu);
  }

  const detailMobileMapButton = document.getElementById("detailMobileMapButton");
  if (detailMobileMapButton) {
    detailMobileMapButton.addEventListener("click", openMapSelectionMenu);
  }

  // Map selection close buttons and backdrop
  document.querySelectorAll("[data-close-map-menu]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMapSelectionMenu();
    });
  });

  // Map selection options
  document.querySelectorAll(".map-option").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const mapType = btn.dataset.map;
      if (mapType) {
        handleMapSelection(mapType);
      }
    });
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

  if (customSelector) {
    customSelector.hidden = true;
  }

  createButton.textContent = "일정 등록";

  savePlannerState({ clearRenderedSchedule: true });
}

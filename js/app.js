/* Sprint 1-2 application bootstrap. */

initialize();

async function initialize() {
  try {
    await loadPlannerData();
    renderChoices();
    renderTravelLibrary();
    renderTravelGuide();
    bindEvents();
    initializeTravelInfiniteScroll();
    initializeRevealAnimation();
    restorePlannerState();
    readSharedPlanFromUrl();
  } catch (error) {
    console.error("플래너 데이터 로딩 실패:", error);
    showDataLoadError(error);
  }
}

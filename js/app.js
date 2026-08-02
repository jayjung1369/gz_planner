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
    ensureTopEntryView();
    autoGenerateRecommendedSchedule();
  } catch (error) {
    console.error("플래너 데이터 로딩 실패:", error);
    showDataLoadError(error);
  }
}

function autoGenerateRecommendedSchedule() {
  // Auto-generate 4 fixed recommended schedules without user selection
  try {
    createSchedule();
  } catch (error) {
    console.warn("일정 자동 생성 실패:", error);
  }
}

function ensureTopEntryView() {
  const url = new URL(window.location.href);
  const hasSharedPlan = url.searchParams.has("sharedPlan");

  if (hasSharedPlan) {
    return;
  }

  if (window.location.hash && window.location.hash !== "#home") {
    window.history.replaceState(
      null,
      "",
      `${window.location.pathname}${window.location.search}#home`
    );
  }

  window.requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

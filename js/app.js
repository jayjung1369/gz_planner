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
    startWeddingCountdown();
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

function startWeddingCountdown() {
  // Wedding time: November 14, 2026 at 15:30 (3:30 PM) Beijing Time
  const weddingTime = new Date("2026-11-14T15:30:00+08:00").getTime();
  
  function updateCountdown() {
    const now = new Date().getTime();
    const diff = weddingTime - now;
    
    if (diff < 0) {
      // Wedding is over
      document.getElementById("daysCount").textContent = "00";
      document.getElementById("hoursCount").textContent = "00";
      document.getElementById("minutesCount").textContent = "00";
      return;
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    const daysEl = document.getElementById("daysCount");
    const hoursEl = document.getElementById("hoursCount");
    const minutesEl = document.getElementById("minutesCount");
    
    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
  }
  
  // Update immediately
  updateCountdown();
  
  // Update every second
  setInterval(updateCountdown, 1000);
}

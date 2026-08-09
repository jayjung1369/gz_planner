/* Sprint 1-2 data module. Classic scripts preserve existing global behavior. */

async function loadPlannerData() {
  try {
    // 각 JSON 파일을 대기하지 말고, 개별적으로 로드해서 실패해도 계속 진행되도록 함
    const [
      placesData,
      rulesData,
      travelGuideData
    ] = await Promise.all([
      loadJson("data/places.json").catch(err => {
        console.error("places.json 로드 실패:", err);
        return { items: {} };
      }),
      loadJson("data/scheduleRules.json").catch(err => {
        console.error("scheduleRules.json 로드 실패:", err);
        return { rules: {}, recommendedDistrictOrder: [], recommendedPlaceIds: {} };
      }),
      loadJson("data/travelGuide.json").catch(err => {
        console.error("travelGuide.json 로드 실패:", err);
        return { items: [], notice: "" };
      })
    ]).catch(err => {
      console.error("전체 데이터 로드 실패:", err);
      throw new Error("필수 데이터 파일을 하나 이상 불러올 수 없습니다.");
    });

    PLACES = placesData.items || {};
    TRAVEL_GUIDE = travelGuideData.items || [];
    TRAVEL_GUIDE_NOTICE = travelGuideData.notice || "";
    
    console.log("🏷️ PLACES 로드됨:", Object.keys(PLACES).length, "개 항목 (식당 포함)");

    // 이미지 설정 (places.json에서 모든 항목に images 사용)
    Object.entries(PLACES).forEach(([id, item]) => {
      if (!item.images || item.images.length === 0) {
        item.images = ["images/places/default-place.svg"];
      }
      applyOptimizedImages(item, id);
    });

    PLACE_OPTIONS = Object.values(PLACES).filter(
      (place) => !["airport", "weddingHotel"].includes(place.id)
    );

    SCHEDULE_RULES = rulesData.rules || {};
    RECOMMENDED_DISTRICT_ORDER =
      rulesData.recommendedDistrictOrder || [];
    RECOMMENDED_PLACE_IDS = rulesData.recommendedPlaceIds || {};

    if (rulesData.weddingDate) {
      WEDDING_DATE = new Date(`${rulesData.weddingDate}T00:00:00`);
    }

    console.log("✅ 플래너 데이터 로드 완료");
  } catch (error) {
    console.error("❌ 플래너 데이터 로드 실패:", error);
    throw error;
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

  if (!scheduleResult) {
    console.error("scheduleResult element not found. Error:", error?.message || "알 수 없는 오류");
    alert(`${message}\n\n${error?.message || "알 수 없는 오류"}`);
    return;
  }

  scheduleResult.innerHTML = `
    <div class="empty-state data-load-error">
      <p class="eyebrow">DATA LOAD ERROR</p>
      <h3>${message}</h3>
      <p>${error?.message || "알 수 없는 오류"}</p>
    </div>
  `;
}

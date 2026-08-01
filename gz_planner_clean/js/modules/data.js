/* Sprint 1-2 data module. Classic scripts preserve existing global behavior. */

async function loadPlannerData() {
  const [
    placesData,
    restaurantsData,
    photosData,
    rulesData,
    travelGuideData,
    imageManifestData
  ] = await Promise.all([
    loadJson("data/places.json"),
    loadJson("data/restaurants.json"),
    loadJson("data/photos.json"),
    loadJson("data/scheduleRules.json"),
    loadJson("data/travelGuide.json"),
    loadJson("data/imageManifest.json")
  ]);

  PLACES = placesData.items || {};
  RESTAURANTS = restaurantsData.items || {};
  PHOTO_LIBRARY = photosData.items || {};
  IMAGE_MANIFEST = imageManifestData.items || {};
  TRAVEL_GUIDE = travelGuideData.items || [];
  TRAVEL_GUIDE_NOTICE = travelGuideData.notice || "";

  Object.entries(PLACES).forEach(([id, item]) => {
    item.images = PHOTO_LIBRARY[id] || ["images/places/default-place.svg"];
    applyOptimizedImages(item, id);
  });

  Object.entries(RESTAURANTS).forEach(([id, item]) => {
    item.images = PHOTO_LIBRARY[id] || ["images/places/default-place.svg"];
    applyOptimizedImages(item, id);
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

/* Sprint 1-2 detail module. Classic scripts preserve existing global behavior. */

const detailGalleryPreloadCache = new Set();

function openDetailModal(itemId, itemType, options = {}) {
  if (!options.returnToEdit) {
    detailReturnToEditContext = null;
  }

  const source = itemType === "restaurant" ? RESTAURANTS : PLACES;
  const item = source[itemId];

  if (!item) {
    return;
  }

  activeDetailItem = item;

  setText(detailModalCategory,
    itemType === "restaurant" ? "FOOD DETAIL" : "PLACE DETAIL");
  setText(detailModalTitle, item.name);
  setText(detailModalChinese, item.chineseName || "중국어 명칭 준비 중");

  setText(
    detailMobileDistrict,
    getDistrictLabel(item.district)
  );
  setText(
    detailMobileCategory,
    item.category || (itemType === "restaurant" ? "맛집" : "관광지")
  );
  setText(
    detailMobileDuration,
    `⏱ ${formatDuration(item.duration || 90)}`
  );
  setText(detailModalAddress, item.addressZh || "중국어 주소 준비 중");
  setText(detailModalDuration, formatDuration(item.duration));
  setText(detailModalDescription, item.note || "");
  setText(detailModalHours, item.hours || formatOpeningHours(item));
  setText(detailModalPrice, item.price || "정보 준비 중");
  setText(detailModalBestTime, item.bestTime || "일정에 맞춰 방문");
  setText(
    detailModalTip,
    item.tips || "편한 신발과 충분한 이동 시간을 준비하세요."
  );
  setText(copyFeedback, "");

  renderRestaurantDetail(item, itemType);
  renderNearbyItems(item);
  // renderDetailAddControls(item, itemType);

  activeGalleryImages = getFullImages(item);
  preloadDetailGalleryImages(activeGalleryImages, 4);

  activeGalleryIndex = 0;
  renderGalleryDots();
  showGalleryImage(0);

  if (!detailModal) {
    console.error("상세창 요소를 찾을 수 없습니다.");
    return;
  }

  detailModal.classList.add("open");
  detailModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  if (detailModalPanel) {
    detailModalPanel.scrollTop = 0;

    window.requestAnimationFrame(() => {
      detailModalPanel.scrollTo({
        top: 0,
        behavior: "auto"
      });
    });
  }
}

function renderRestaurantDetail(item, itemType) {
  const isRestaurant = itemType === "restaurant";

  detailRestaurantInfo.hidden = !isRestaurant;

  if (!isRestaurant) {
    detailRecommendedMenu.innerHTML = "";
    detailMenuBlock.hidden = true;
    return;
  }

  setText(
    detailReservation,
    item.reservation || "방문 전 확인"
  );

  const costText = item.averageCostCny
    ? `1인 약 ${item.averageCostCny}위안`
    : item.price || "정보 준비 중";

  setText(detailAverageCost, costText);

  const menus = Array.isArray(item.recommendedMenu)
    ? item.recommendedMenu
    : [];

  detailMenuBlock.hidden = menus.length === 0;
  detailRecommendedMenu.innerHTML = menus
    .map((menu) => `<span>${escapeHtml(menu)}</span>`)
    .join("");
}

function renderNearbyItems(item) {
  const nearbyPlaceItems = (item.nearbyPlaces || [])
    .map((id) => PLACES[id])
    .filter(Boolean);

  const nearbyRestaurantItems =
    (item.nearbyRestaurants || [])
      .map((id) => RESTAURANTS[id])
      .filter(Boolean);

  nearbyPlacesSection.hidden =
    nearbyPlaceItems.length === 0;
  nearbyRestaurantsSection.hidden =
    nearbyRestaurantItems.length === 0;

  nearbyPlacesList.innerHTML = nearbyPlaceItems
    .map((nearby) =>
      createNearbyCard(nearby, "place")
    )
    .join("");

  nearbyRestaurantsList.innerHTML =
    nearbyRestaurantItems
      .map((nearby) =>
        createNearbyCard(nearby, "restaurant")
      )
      .join("");

  initializeLazyImages(nearbyPlacesList);
  initializeLazyImages(nearbyRestaurantsList);
}

function createNearbyCard(item, itemType) {
  const image = getThumbnailImage(item);

  return `
    <button
      class="nearby-card"
      type="button"
      data-nearby-id="${item.id}"
      data-nearby-type="${itemType}"
    >
      ${createLazyImageMarkup({
        src: image,
        alt: `${item.name} 사진`,
        className: "nearby-card-image",
        fallbackType: "nearby"
      })}
      <span>
        <strong>${escapeHtml(item.name)}</strong>
        <small>
          ${getDistrictLabel(item.district)}
          · ${escapeHtml(item.category || "")}
        </small>
      </span>
      <em>→</em>
    </button>
  `;
}


function showGalleryImage(index) {
  if (activeGalleryImages.length === 0) {
    return;
  }

  activeGalleryIndex =
    (index + activeGalleryImages.length) %
    activeGalleryImages.length;

  const selectedImage =
    activeGalleryImages[activeGalleryIndex] ||
    "images/places/default-place.svg";

  preloadGalleryNeighbors(activeGalleryIndex, 2);

  const galleryWrapper = detailModalImage.closest(".detail-gallery");
  const loader = galleryWrapper?.querySelector(".image-loader");

  if (detailPhotoStatus) {
    detailPhotoStatus.hidden = !isPlaceholderImage(selectedImage);
  }

  if (loader) {
    loader.style.display = "flex";
  }

  detailModalImage.onerror = () => {
    if (loader) {
      loader.style.display = "none";
    }
    detailModalImage.onerror = null;
    detailModalImage.src = resolveAssetUrl(
      "images/places/default-place.svg"
    );

    if (detailPhotoStatus) {
      detailPhotoStatus.hidden = false;
    }
  };

  detailModalImage.onload = () => {
    if (loader) {
      loader.style.display = "none";
    }
  };

  detailModalImage.style.display = "block";
  detailModalImage.style.visibility = "visible";
  detailModalImage.style.opacity = "1";
  detailModalImage.src = resolveAssetUrl(selectedImage);
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

function preloadGalleryNeighbors(index, distance = 1) {
  if (activeGalleryImages.length <= 1) {
    return;
  }

  for (let offset = 1; offset <= distance; offset += 1) {
    const nextIndex = (index + offset) % activeGalleryImages.length;
    const prevIndex =
      (index - offset + activeGalleryImages.length) %
      activeGalleryImages.length;

    preloadDetailImage(activeGalleryImages[nextIndex]);
    preloadDetailImage(activeGalleryImages[prevIndex]);
  }
}

function preloadDetailGalleryImages(images, limit = 4) {
  (images || []).slice(0, limit).forEach((image) => {
    preloadDetailImage(image);
  });
}

function preloadDetailImage(source) {
  if (!source) {
    return;
  }

  const resolved = resolveAssetUrl(source);
  if (detailGalleryPreloadCache.has(resolved)) {
    return;
  }

  detailGalleryPreloadCache.add(resolved);
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = resolved;
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

async function shareActiveDetail() {
  if (!activeDetailItem) {
    return;
  }

  const shareText = [
    activeDetailItem.name,
    activeDetailItem.chineseName || "",
    activeDetailItem.addressZh || "",
    activeDetailItem.note || ""
  ]
    .filter(Boolean)
    .join("\n");

  try {
    if (navigator.share) {
      await navigator.share({
        title: activeDetailItem.name,
        text: shareText
      });
      return;
    }

    await copyTextToClipboard(shareText);
    setText(copyFeedback, "장소 정보를 복사했습니다.");
  } catch (error) {
    if (error?.name !== "AbortError") {
      console.error(error);
      setText(copyFeedback, "장소 정보를 공유하지 못했습니다.");
    }
  }
}

function openActiveDetailMap() {
  if (!activeDetailItem) {
    return;
  }

  const mapUrl = createAmapMarkerUrl(activeDetailItem);

  if (mapUrl) {
    window.open(mapUrl, "_blank", "noopener");
  }
}



function closeDetailModal() {
  const returnContext = detailReturnToEditContext;

  detailModal.classList.remove("open");
  detailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeDetailItem = null;
  detailReturnToEditContext = null;

  if (!returnContext?.target) {
    return;
  }

  openScheduleEditModal(returnContext.target);

  if (!returnContext.draft) {
    return;
  }

  editItemType.value = returnContext.draft.type || editItemType.value;
  updateEditItemOptions();

  if (returnContext.draft.selectedItemId) {
    editItemSelect.value = returnContext.draft.selectedItemId;
  }

  editCustomTitle.value = returnContext.draft.customTitle || "";
  editTransportFrom.value = returnContext.draft.transportFrom || "";
  editTransportTo.value = returnContext.draft.transportTo || "";
  editTransportMode.value = returnContext.draft.transportMode || "도보";
  editStartTime.value = returnContext.draft.startTime || editStartTime.value;

  if (returnContext.draft.duration) {
    setDurationValue(Number(returnContext.draft.duration));
  }

  renderEditItemPreview(false);
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

function createAmapMarkerUrl(item) {
  const name = encodeURIComponent(item.chineseName || item.name);
  const longitude = item.longitude;
  const latitude = item.latitude;

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    return `https://uri.amap.com/marker?position=${longitude},${latitude}&name=${name}&src=wedding-guide&coordinate=gaode&callnative=1`;
  }

  return `https://www.amap.com/search?query=${name}`;
}

function isAppleDevice() {
  return /iPhone|iPad|iPod|Mac/.test(navigator.userAgent);
}

function createAppleMapsUrl(item) {
  const lat = item.latitude;
  const lng = item.longitude;
  const chineseName = encodeURIComponent(item.chineseName || item.name);
  
  // iOS/Mac: 애플맵 앱으로 열기 (fallback으로 웹 버전)
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    // iOS에서는 maps:// 스킴 사용
    if (/iPhone|iPad|iPod/.test(navigator.userAgent)) {
      return `maps://maps.apple.com/?ll=${lat},${lng}&q=${chineseName}`;
    }
    // Mac/웹: https 사용
    return `https://maps.apple.com/?ll=${lat},${lng}&q=${chineseName}`;
  }
  
  // 좌표 없으면 검색으로 대체
  return `https://maps.apple.com/?q=${chineseName}`;
}

function createBaiduMapsUrl(item) {
  const name = encodeURIComponent(item.chineseName || item.name);
  const longitude = item.longitude;
  const latitude = item.latitude;

  if (Number.isFinite(longitude) && Number.isFinite(latitude)) {
    // 바이두 지도는 좌표 형식: ?center=lng,lat&zoom=18&title=name
    return `https://api.map.baidu.com/?newmap=1&s=&type=&from=webmap&biz_forward=&umd=js&utm_source=webmap&c=${latitude},${longitude}&title=${name}&content=&autoOpen=true&searchType=simplemix&lang=zh_CN`;
  }

  // 좌표 없으면 검색으로 대체
  return `https://map.baidu.com/search/${name}/`;
}

function openMapSelectionMenu() {
  const mapSelectionModal = document.getElementById("mapSelectionModal");
  if (mapSelectionModal) {
    mapSelectionModal.classList.add("open");
    mapSelectionModal.setAttribute("aria-hidden", "false");
  }
}

function closeMapSelectionMenu() {
  const mapSelectionModal = document.getElementById("mapSelectionModal");
  if (mapSelectionModal) {
    mapSelectionModal.classList.remove("open");
    mapSelectionModal.setAttribute("aria-hidden", "true");
  }
}

function handleMapSelection(mapType) {
  if (!activeDetailItem) {
    return;
  }

  let mapUrl = "";

  switch (mapType) {
    case "amap":
      mapUrl = createAmapMarkerUrl(activeDetailItem);
      break;
    case "baidu":
      mapUrl = createBaiduMapsUrl(activeDetailItem);
      break;
    case "apple":
      if (!isAppleDevice()) {
        alert("애플 지도는 iOS 기기에서만 지원합니다.");
        return;
      }
      mapUrl = createAppleMapsUrl(activeDetailItem);
      break;
    default:
      return;
  }

  closeMapSelectionMenu();

  if (mapUrl) {
    window.open(mapUrl, "_blank", "noopener");
  }
}

// Initialize event listeners for map selection menu
function initMapSelectionMenuListeners() {
  // Detail modal map buttons
  const detailModalMapButton = document.getElementById("detailModalMapButton");
  if (detailModalMapButton) {
    detailModalMapButton.addEventListener("click", openMapSelectionMenu);
  }

  const detailModalCloseButton = document.getElementById("detailModalCloseButton");
  if (detailModalCloseButton) {
    detailModalCloseButton.addEventListener("click", closeDetailModal);
  }

  const detailMobileMapButton = document.getElementById("detailMobileMapButton");
  if (detailMobileMapButton) {
    detailMobileMapButton.addEventListener("click", openMapSelectionMenu);
  }

  // Map selection close buttons and backdrop
  const closeButtons = document.querySelectorAll("[data-close-map-menu]");
  closeButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      closeMapSelectionMenu();
    });
  });

  // Map selection options
  const mapOptions = document.querySelectorAll(".map-option");
  mapOptions.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const mapType = btn.dataset.map;
      if (mapType) {
        handleMapSelection(mapType);
      }
    });
  });

  // Close menu on backdrop click
  const mapSelectionBackdrop = document.querySelector(".map-selection-backdrop");
  if (mapSelectionBackdrop) {
    mapSelectionBackdrop.addEventListener("click", closeMapSelectionMenu);
  }
}

// Initialize when DOM is ready or already loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initMapSelectionMenuListeners);
} else {
  // DOM already loaded - initialize immediately
  setTimeout(initMapSelectionMenuListeners, 0);
}

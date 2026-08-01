/* Sprint 1-2 detail module. Classic scripts preserve existing global behavior. */

function openDetailModal(itemId, itemType) {
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
  renderDetailAddControls(item, itemType);

  activeGalleryImages = getFullImages(item);

  activeGalleryIndex = 0;
  renderGalleryDots();
  showGalleryImage(0);

  openAmapButton.href = createAmapMarkerUrl(item);

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

function renderDetailAddControls(item, itemType) {
  const hasSchedule =
    currentSchedule.length > 0 &&
    currentContext;

  detailAddButton.disabled = !hasSchedule;
  detailAddDaySelect.disabled = !hasSchedule;

  if (!hasSchedule) {
    detailAddDaySelect.innerHTML =
      '<option>일정을 먼저 생성해주세요</option>';
    setText(
      detailAddGuide,
      "추천 일정 또는 직접 선택 일정을 만든 뒤 이 장소를 원하는 날짜에 추가할 수 있습니다."
    );
    return;
  }

  detailAddDaySelect.innerHTML =
    currentSchedule
      .map((day, index) => `
        <option value="${index}">
          DAY ${index + 1} · ${formatShortDate(day.date)}
        </option>
      `)
      .join("");

  setText(
    detailAddGuide,
    `${item.name}을 선택한 날짜의 일정에 추가합니다. 시작시간과 소요시간은 다음 화면에서 조정할 수 있습니다.`
  );

  detailAddButton.dataset.itemType = itemType;
  detailAddButton.dataset.itemId = item.id;
}

function addActiveDetailToSchedule() {
  if (
    !activeDetailItem ||
    currentSchedule.length === 0
  ) {
    setText(
      copyFeedback,
      "먼저 여행 일정을 생성해주세요."
    );
    return;
  }

  const dayIndex = Number(detailAddDaySelect.value);
  const itemType =
    detailAddButton.dataset.itemType || "place";
  const itemId = activeDetailItem.id;
  const duration = activeDetailItem.duration || 90;

  if (
    !Number.isInteger(dayIndex) ||
    !currentSchedule[dayIndex] ||
    !itemId
  ) {
    setText(
      copyFeedback,
      "추가할 날짜 또는 장소 정보를 확인해주세요."
    );
    return;
  }

  closeDetailModal();

  window.requestAnimationFrame(() => {
    openScheduleEditModal({
      mode: "add",
      dayIndex,
      itemType,
      itemId,
      duration
    });
  });
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

  if (detailPhotoStatus) {
    detailPhotoStatus.hidden = !isPlaceholderImage(selectedImage);
  }

  detailModalImage.onerror = () => {
    detailModalImage.onerror = null;
    detailModalImage.src = resolveAssetUrl(
      "images/places/default-place.svg"
    );

    if (detailPhotoStatus) {
      detailPhotoStatus.hidden = false;
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

function closeDetailModal() {
  detailModal.classList.remove("open");
  detailModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  activeDetailItem = null;
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

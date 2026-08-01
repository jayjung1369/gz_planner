/* Sprint 1-2 share module. Classic scripts preserve existing global behavior. */

function createSharePayload() {
  if (!currentSchedule.length || !currentContext) {
    return null;
  }

  return {
    version: 1,
    createdAt: new Date().toISOString(),
    context: {
      arrivalDate: currentContext.arrivalDate,
      arrivalTime: currentContext.arrivalTime,
      departureDate: currentContext.departureDate,
      departureTime: currentContext.departureTime,
      weddingDate: currentContext.weddingDate
    },
    schedule: currentSchedule
  };
}

function encodeSharePayload(payload) {
  const bytes = new TextEncoder().encode(
    JSON.stringify(payload)
  );
  let binary = "";

  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "");
}

function decodeSharePayload(encoded) {
  const normalized = encoded
    .replaceAll("-", "+")
    .replaceAll("_", "/");

  const padded =
    normalized +
    "=".repeat((4 - (normalized.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(
    binary,
    (character) => character.charCodeAt(0)
  );

  return JSON.parse(
    new TextDecoder().decode(bytes)
  );
}

function createShareUrl() {
  const payload = createSharePayload();

  if (!payload) {
    return "";
  }

  const url = new URL(window.location.href);
  url.search = "";
  url.hash = "";
  url.searchParams.set(
    "plan",
    encodeSharePayload(payload)
  );

  return url.toString();
}

async function shareCurrentSchedule() {
  const shareUrl = createShareUrl();

  if (!shareUrl) {
    showShareStatus("먼저 일정을 만들어주세요.", true);
    return;
  }

  const travelPeriod = currentContext
    ? `${currentContext.arrivalDate} ~ ${currentContext.departureDate}`
    : "광저우 여행 일정";

  const shareData = {
    title: "광저우 결혼식 여행 일정",
    text: `광저우 결혼식 여행 일정입니다. ${travelPeriod}`,
    url: shareUrl
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      showShareStatus(
        "공유창이 열렸습니다. 카카오톡을 선택해주세요."
      );
      return;
    }

    await copyTextToClipboard(shareUrl);
    showShareStatus(
      "공유 링크를 복사했습니다. 카카오톡 대화창에 붙여넣어 주세요."
    );
  } catch (error) {
    if (error?.name === "AbortError") {
      return;
    }

    try {
      await copyTextToClipboard(shareUrl);
      showShareStatus(
        "공유 링크를 복사했습니다. 카카오톡 대화창에 붙여넣어 주세요."
      );
    } catch (copyError) {
      console.error(copyError);
      showShareStatus(
        "공유 링크를 복사하지 못했습니다.",
        true
      );
    }
  }
}

function showShareStatus(message, isError = false) {
  shareStatus.textContent = message;
  shareStatus.classList.toggle("error", isError);
  shareStatus.classList.add("visible");

  window.setTimeout(() => {
    shareStatus.classList.remove("visible");
  }, 4500);
}

function readSharedPlanFromUrl() {
  const encodedPlan = new URL(
    window.location.href
  ).searchParams.get("plan");

  if (!encodedPlan) {
    return;
  }

  try {
    const payload = decodeSharePayload(encodedPlan);

    if (
      !payload ||
      !Array.isArray(payload.schedule) ||
      payload.schedule.length === 0
    ) {
      throw new Error("공유 일정 데이터가 없습니다.");
    }

    pendingSharedPlan = payload;
    renderSharedPlanSummary(payload);
    openSharedPlanModal();
  } catch (error) {
    console.error("공유 일정 해석 실패:", error);
    showShareStatus(
      "공유받은 일정 링크를 읽을 수 없습니다.",
      true
    );
  }
}

function renderSharedPlanSummary(payload) {
  const context = payload.context || {};
  const totalItems = payload.schedule.reduce(
    (sum, day) => sum + (day.items?.length || 0),
    0
  );

  sharedPlanSummary.innerHTML = `
    <div>
      <span>여행 기간</span>
      <strong>
        ${escapeHtml(context.arrivalDate || "-")}
        ~
        ${escapeHtml(context.departureDate || "-")}
      </strong>
    </div>
    <div>
      <span>일정</span>
      <strong>
        ${payload.schedule.length}일 · ${totalItems}개 항목
      </strong>
    </div>
  `;
}

function openSharedPlanModal() {
  sharedPlanModal.classList.add("open");
  sharedPlanModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeSharedPlanModal() {
  sharedPlanModal.classList.remove("open");
  sharedPlanModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
}

function previewSharedPlan() {
  if (!pendingSharedPlan) {
    return;
  }

  applySharedPlan(pendingSharedPlan, false);
  closeSharedPlanModal();
  showShareStatus(
    "공유받은 일정을 미리보기로 불러왔습니다."
  );
}

function saveSharedPlan() {
  if (!pendingSharedPlan) {
    return;
  }

  applySharedPlan(pendingSharedPlan, true);
  closeSharedPlanModal();
  showStorageStatus(
    "공유받은 일정을 내 일정으로 저장했습니다."
  );

  const url = new URL(window.location.href);
  url.searchParams.delete("plan");
  window.history.replaceState(
    {},
    "",
    url.pathname + url.search + url.hash
  );
}

function applySharedPlan(payload, persist) {
  const context = payload.context || {};

  currentContext = {
    ...context
  };

  currentSchedule = JSON.parse(
    JSON.stringify(payload.schedule)
  );

  arrivalInput.value =
    context.arrivalDate || arrivalInput.value;
  arrivalTimeInput.value =
    context.arrivalTime || arrivalTimeInput.value;
  departureInput.value =
    context.departureDate || departureInput.value;
  departureTimeInput.value =
    context.departureTime || departureTimeInput.value;

  renderSchedule(currentSchedule, currentContext);

  if (!persist) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function printCurrentSchedule() {
  if (!currentSchedule.length) {
    showShareStatus("먼저 일정을 만들어주세요.", true);
    return;
  }

  document.body.classList.add("printing-schedule");

  window.setTimeout(() => {
    window.print();

    window.setTimeout(() => {
      document.body.classList.remove(
        "printing-schedule"
      );
    }, 300);
  }, 50);
}

/* Sprint 1-2 utils module. Classic scripts preserve existing global behavior. */

function getTravelMinutes(fromDistrict, toDistrict) {
  if (!fromDistrict || !toDistrict) {
    return SCHEDULE_RULES.defaultTravelMinutes;
  }

  if (fromDistrict === toDistrict) {
    return SCHEDULE_RULES.districtTravelMinutes[
      `${fromDistrict}-${toDistrict}`
    ] || 15;
  }

  return SCHEDULE_RULES.districtTravelMinutes[
    `${fromDistrict}-${toDistrict}`
  ] || SCHEDULE_RULES.defaultTravelMinutes;
}

function getDayTitle({ isArrivalDay, isDepartureDay }) {
  if (isArrivalDay && isDepartureDay) {
    return "광저우 당일 일정";
  }

  if (isArrivalDay) {
    return "광저우 도착";
  }

  if (isDepartureDay) {
    return "귀국하는 날";
  }

  return "광저우 여행";
}

function getDistrictLabel(district) {
  const labels = {
    liwan: "리완",
    yuexiu: "웨슈",
    zhujiang: "주장신청",
    panyu: "판위",
    airport: "바이윈공항"
  };

  return labels[district] || "광저우";
}

function enumerateDates(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);

  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

function isDateWithinRange(date, start, end) {
  return date >= start && date <= end;
}

function isSameDate(firstDate, secondDate) {
  return (
    firstDate.getFullYear() === secondDate.getFullYear() &&
    firstDate.getMonth() === secondDate.getMonth() &&
    firstDate.getDate() === secondDate.getDate()
  );
}

function parseDate(value) {
  return value ? new Date(`${value}T00:00:00`) : null;
}

function timeToMinutes(value) {
  if (value === "24:00") {
    return 24 * 60;
  }

  const [hours, minutes] = value.split(":").map(Number);
  return hours * 60 + minutes;
}

function formatTime(minutes) {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const dayOffset = Math.floor(safeMinutes / (24 * 60));
  const clockMinutes = safeMinutes % (24 * 60);
  const hours = Math.floor(clockMinutes / 60);
  const remainingMinutes = clockMinutes % 60;
  const clockText = `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;

  if (dayOffset === 0) {
    return clockText;
  }

  if (dayOffset === 1) {
    return `${clockText}`;
  }

  return `${dayOffset}일 후 ${clockText}`;
}

function formatTimeForInput(minutes) {
  const safeMinutes = Math.max(0, Math.floor(minutes));
  const clockMinutes = safeMinutes % (24 * 60);
  const hours = Math.floor(clockMinutes / 60);
  const remainingMinutes = clockMinutes % 60;

  return `${String(hours).padStart(2, "0")}:${String(remainingMinutes).padStart(2, "0")}`;
}

function formatDuration(minutes) {
  if (!Number.isFinite(minutes) || minutes <= 0) {
    return "시간 미정";
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return `약 ${hours}시간 ${remainingMinutes}분`;
  }

  if (hours > 0) {
    return `약 ${hours}시간`;
  }

  return `약 ${remainingMinutes}분`;
}

function formatDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    weekday: "short"
  }).format(date);
}

function setText(element, value) {
  if (element) {
    element.textContent = value;
  }
}

function resolveAssetUrl(path) {
  try {
    return new URL(path, document.baseURI).href;
  } catch (error) {
    console.error("이미지 경로 변환 실패:", path, error);
    return path;
  }
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopyText(text);
}

function fallbackCopyText(text) {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

function showMessage(message) {
  scheduleResult.innerHTML = `
    <div class="empty-state">
      <p class="eyebrow">CHECK YOUR PLAN</p>
      <h3>${message}</h3>
    </div>
  `;
}

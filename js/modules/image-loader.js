/* Sprint 1-3 optimized image loading. */

const EAGER_IMAGE_COUNT = 8;
const IDLE_PREWARM_COUNT = 20;
const warmedImageSources = new Set();

function applyOptimizedImages(item, itemId) {
  // item.images를 기본 소스로 사용
  item.thumbnail = item.images?.[0] || "images/places/default-place.svg";

  item.thumbnailImages = item.images || ["images/places/default-place.svg"];

  item.fullImages = item.images || ["images/places/default-place.svg"];
}

function getThumbnailImage(item) {
  return (
    item?.thumbnail ||
    item?.thumbnailImages?.[0] ||
    item?.images?.[0] ||
    "images/places/default-place.svg"
  );
}

function getFullImages(item) {
  const images =
    item?.fullImages?.length
      ? item.fullImages
      : item?.images;

  return images?.length
    ? images
    : ["images/places/default-place.svg"];
}

function isPlaceholderImage(path) {
  return (
    !path ||
    path.endsWith(".svg") ||
    path.includes("default-place")
  );
}

function createLazyImageMarkup({
  src,
  alt,
  className = "",
  fallbackType = "choice"
}) {
  const safeSource = resolveAssetUrl(
    src || "images/places/default-place.svg"
  );

  return `
    <div style="position: relative; display: inline-block; width: 100%;">
      <img
        class="${className} lazy-image is-loading"
        src="${resolveAssetUrl("images/places/default-place.svg")}"
        data-src="${safeSource}"
        alt="${escapeHtml(alt || "")}"
        loading="lazy"
        decoding="async"
        data-fallback-type="${fallbackType}"
      >
      <div class="image-loader" style="display: none;"></div>
    </div>
  `;
}

function initializeLazyImages(root = document) {
  const images = [
    ...root.querySelectorAll("img.lazy-image[data-src]")
  ];

  if (images.length === 0) {
    return;
  }

  // Above-the-fold cards should be loaded immediately for faster first paint.
  images.slice(0, EAGER_IMAGE_COUNT).forEach((image) => {
    image.setAttribute("fetchpriority", "high");
    loadLazyImage(image);
  });

  scheduleIdlePrewarm(images);

  if (!("IntersectionObserver" in window)) {
    images.forEach(loadLazyImage);
    return;
  }

  if (!lazyImageObserver) {
    lazyImageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          loadLazyImage(entry.target);
          lazyImageObserver.unobserve(entry.target);
        });
      },
      {
        rootMargin: "1200px 0px",
        threshold: 0.01
      }
    );
  }

  images.forEach((image) => {
    if (!image.dataset.src) {
      return;
    }
    lazyImageObserver.observe(image);
  });
}

function scheduleIdlePrewarm(images) {
  const targets = images
    .filter((image) => image.dataset.src)
    .slice(0, IDLE_PREWARM_COUNT);

  if (targets.length === 0) {
    return;
  }

  const prewarm = () => {
    targets.forEach((image) => {
      warmImageSource(image.dataset.src);
    });
  };

  if (typeof window.requestIdleCallback === "function") {
    window.requestIdleCallback(prewarm, { timeout: 800 });
    return;
  }

  window.setTimeout(prewarm, 120);
}

function warmImageSource(source) {
  if (!source || warmedImageSources.has(source)) {
    return;
  }

  warmedImageSources.add(source);
  const img = new Image();
  img.decoding = "async";
  img.loading = "eager";
  img.src = source;
}

function loadLazyImage(image) {
  const source = image.dataset.src;

  if (!source || image.dataset.loadingStarted === "true") {
    return;
  }

  image.dataset.loadingStarted = "true";

  // Check for loader in new wrapper structure (from createLazyImageMarkup)
  let loader = image.parentElement?.querySelector(".image-loader");
  
  // Fallback to old structure for travel-library-image or gallery-wrapper
  if (!loader) {
    const wrapper = image.closest(".travel-library-image") || image.closest(".gallery-wrapper");
    loader = wrapper?.querySelector(".image-loader");
  }

  if (loader) {
    loader.style.display = "flex";
  }

  image.onload = () => {
    if (loader) {
      loader.style.display = "none";
    }
    delete image.dataset.loadingStarted;
    image.classList.remove("is-loading");
    image.classList.add("is-loaded");
    image.removeAttribute("data-src");
  };

  image.onerror = () => {
    if (loader) {
      loader.style.display = "none";
    }
    delete image.dataset.loadingStarted;
    handleLazyImageError(image);
  };

  image.src = source;
}

function handleLazyImageError(image) {
  image.onerror = null;
  image.src = resolveAssetUrl(
    "images/places/default-place.svg"
  );
  image.classList.remove("is-loading");
  image.classList.add("is-error");
  image.removeAttribute("data-src");

  const wrap =
    image.closest(".choice-image-wrap") ||
    image.closest(".edit-item-preview-image-wrap") ||
    image.closest(".travel-library-image"); // Travel 카드 추가

  if (wrap && !wrap.querySelector(".choice-photo-status")) {
    wrap.insertAdjacentHTML(
      "beforeend",
      '<span class="choice-photo-status">사진 준비 중</span>'
    );
  }
}

function handleChoiceImageError(image) {
  handleLazyImageError(image);
}

function handleTimelineImageError(image) {
  handleLazyImageError(image);
}

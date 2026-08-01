/* Sprint 1-3 optimized image loading. */

function applyOptimizedImages(item, itemId) {
  const optimized = IMAGE_MANIFEST[itemId];

  item.thumbnail =
    optimized?.thumbnail ||
    item.images?.[0] ||
    "images/places/default-place.svg";

  item.thumbnailImages =
    optimized?.thumbnails ||
    item.images ||
    ["images/places/default-place.svg"];

  item.fullImages =
    optimized?.full ||
    item.images ||
    ["images/places/default-place.svg"];
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
    <img
      class="${className} lazy-image is-loading"
      src="${resolveAssetUrl("images/places/default-place.svg")}"
      data-src="${safeSource}"
      alt="${escapeHtml(alt || "")}"
      loading="lazy"
      decoding="async"
      data-fallback-type="${fallbackType}"
    >
  `;
}

function initializeLazyImages(root = document) {
  const images = [
    ...root.querySelectorAll("img.lazy-image[data-src]")
  ];

  if (images.length === 0) {
    return;
  }

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
        rootMargin: "240px 0px",
        threshold: 0.01
      }
    );
  }

  images.forEach((image) => {
    lazyImageObserver.observe(image);
  });
}

function loadLazyImage(image) {
  const source = image.dataset.src;

  if (!source) {
    return;
  }

  image.onload = () => {
    image.classList.remove("is-loading");
    image.classList.add("is-loaded");
    image.removeAttribute("data-src");
  };

  image.onerror = () => {
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
    image.closest(".edit-item-preview-image-wrap");

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

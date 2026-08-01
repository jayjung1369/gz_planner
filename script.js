/*
  Compatibility JavaScript loader.

  The current index.html loads js/state.js, js/modules/*.js and js/app.js
  directly. This file is included for older deployment workflows expecting
  /script.js.

  Do not add <script src="script.js"></script> while the modular script tags
  are present in index.html, or the application will initialize twice.
*/

(function loadGuangzhouPlannerCompatibilityScripts() {
  "use strict";

  if (window.__GZ_PLANNER_COMPAT_LOADING__) {
    return;
  }

  window.__GZ_PLANNER_COMPAT_LOADING__ = true;

  const scripts = [
  "js/state.js?v=31",
  "js/modules/utils.js?v=31",
  "js/modules/image-loader.js?v=31",
  "js/modules/data.js?v=31",
  "js/modules/planner.js?v=31",
  "js/modules/travel.js?v=31",
  "js/modules/guide.js?v=31",
  "js/modules/detail.js?v=31",
  "js/modules/storage.js?v=31",
  "js/modules/share.js?v=31",
  "js/modules/events.js?v=31",
  "js/app.js?v=31"
];

  function loadNext(index) {
    if (index >= scripts.length) {
      return;
    }

    const script = document.createElement("script");
    script.src = scripts[index];
    script.async = false;
    script.onload = () => loadNext(index + 1);
    script.onerror = () => {
      console.error("스크립트를 불러오지 못했습니다:", scripts[index]);
    };
    document.head.appendChild(script);
  }

  loadNext(0);
})();

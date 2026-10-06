// SEI 9958 — placeholder hide-on-fill helper (REFERENCE ONLY)
//
// Do NOT paste into Grow Customize → Custom JavaScript for campaign 22815:
// that slot dumps the source as visible page text and does not execute it.
// Placeholders are restored via Custom CSS (opacity on .xSubLabel + hide on :focus).
//
// Keep this file if Grow later supports real script injection; wire .sei-filled then.
(function () {
  function isFilled(input) {
    var v = (input.value || "").replace(/^\s+|\s+$/g, "");
    return v.length > 0;
  }

  function sync(input) {
    if (!input || !input.tagName) return;
    var filled = isFilled(input);
    input.classList.toggle("sei-filled", filled);
    var wrap = input.parentElement;
    if (wrap && (wrap.classList.contains("xField") || wrap.classList.contains("select-container"))) {
      wrap.classList.toggle("sei-filled", filled);
    }
  }

  function syncAll(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var inputs = scope.querySelectorAll(
      ".xForm .xComponent.xEmail .xField input, .xForm .xComponent.xDate_of_birth .xField input, .xForm .xComponent.xDate_of_birth .select-container > input"
    );
    for (var i = 0; i < inputs.length; i++) sync(inputs[i]);
  }

  function onEvent(e) {
    var t = e.target;
    if (!t || t.tagName !== "INPUT") return;
    if (!t.closest(".xForm")) return;
    sync(t);
  }

  function start() {
    syncAll(document);
    document.addEventListener("input", onEvent, true);
    document.addEventListener("change", onEvent, true);
    document.addEventListener("blur", onEvent, true);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

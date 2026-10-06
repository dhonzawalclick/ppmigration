// SEI 9958 — placeholder hide-on-fill helper (REFERENCE ONLY — not used live)
//
// Live placeholders use Custom CSS (:focus opacity). If you paste Custom JS into
// Grow Customize, wrap it in <script>…</script> (see Scripting Guide) or it
// renders as page text. The live fromOnLoad gate is 9958-grow-fromonload-gate.js.
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

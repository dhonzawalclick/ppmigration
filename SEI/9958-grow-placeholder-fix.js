/* SEI 9958 — enable :placeholder-shown for Grow floating labels
 * Paste into Grow Customize → Custom JavaScript.
 *
 * Grow text/date fields use .xSubLabel as a fake placeholder and do not set
 * a real placeholder attribute, so CSS :not(:placeholder-shown) never matches.
 * A single space is invisible but lets the browser track empty vs filled.
 */
(function () {
  function enablePlaceholderShown(root) {
    var scope = root && root.querySelectorAll ? root : document;
    var inputs = scope.querySelectorAll(
      ".xForm .xField input, .xForm .select-container > input"
    );
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].hasAttribute("placeholder")) {
        inputs[i].setAttribute("placeholder", " ");
      }
    }
  }

  function start() {
    enablePlaceholderShown(document);
    if (typeof MutationObserver === "undefined") return;
    var obs = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          if (nodes[j].nodeType === 1) enablePlaceholderShown(nodes[j]);
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})();

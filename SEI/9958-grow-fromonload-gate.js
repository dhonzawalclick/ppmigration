<script>
/**
 * SEI 9958 — hide T&C + Sign up when fromOnLoad is False.
 * Paste into Grow Customize → Custom JavaScript (must include <script> tags).
 *
 * Uses NGX Custom classes API so classes survive Preact re-renders.
 * Companion CSS: .xCustomClass-sei-hide-cta on policy/submit modules.
 */
NGX.api('event:listen', 'page:ready', function () {
  var POLICY_ID = 'policy_1790353974879';
  var SUBMIT_ID = 'submit_1684917530454';
  var RADIO_ID = 'radio_1784640642802';
  var HIDE_CLASS = 'sei-hide-cta';

  function isFromOnLoadFalse() {
    var checked = document.querySelector('input[name="fromOnLoad"]:checked');
    return !checked || String(checked.value).toLowerCase() === 'false';
  }

  function syncCtaVisibility() {
    var method = isFromOnLoadFalse()
      ? 'module:add:custom:classes'
      : 'module:remove:custom:classes';
    NGX.api(method, { id: POLICY_ID, customClassNames: HIDE_CLASS });
    NGX.api(method, { id: SUBMIT_ID, customClassNames: HIDE_CLASS });
  }

  syncCtaVisibility();

  NGX.api('event:listen', 'module:component:didupdate', function (e) {
    if (e && e.id === RADIO_ID) syncCtaVisibility();
  });

  document.addEventListener(
    'change',
    function (e) {
      if (e.target && e.target.name === 'fromOnLoad') syncCtaVisibility();
    },
    true
  );
});
</script>

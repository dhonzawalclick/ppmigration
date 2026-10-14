<script>
/**
 * SEI 9958 — Custom JavaScript (single paste for Customize).
 *
 * Hide T&C + Sign up while fromOnLoad is false.
 * Companion CSS: .xCustomClass-sei-hide-cta on policy/submit modules.
 *
 * uid / email / fromOnLoad come from the On Load integration (server-side
 * decrypt). Do not put encryptionKey / AES in this script.
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

  // On Load fills fromOnLoad after page:ready; re-sync when the radio updates
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

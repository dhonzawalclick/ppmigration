<script>
/**
 * Campaign Customize JS.
 * Gate / UI only. No AES keys: On Load fills uid / email / fromOnLoad.
 *
 * Hides policy + submit while fromOnLoad is false. Module ids come from
 * the page with &debug. Companion CSS hides .xCustomClass-hide-cta.
 */
NGX.api('event:listen', 'page:ready', function () {
  var POLICY_ID = 'REPLACE_policy_id';
  var SUBMIT_ID = 'REPLACE_submit_id';
  var RADIO_ID = 'REPLACE_fromOnLoad_radio_id';
  var HIDE_CLASS = 'hide-cta';

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

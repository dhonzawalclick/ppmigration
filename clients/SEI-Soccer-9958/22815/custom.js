<script>
/**
 * SEI 9958 — Custom JavaScript (single paste for Customize).
 *
 * 1) Decrypt URL tokens → fill uid / email / fromOnLoad
 *    nc.ol_tok = AES(uid), nc.ol_tok2 = AES(email), or nc.ol = AES(JSON)
 * 2) Hide T&C + Sign up when fromOnLoad is False
 *    Companion CSS: .xCustomClass-sei-hide-cta on policy/submit modules
 *
 * Keep AES_KEY_HEX in sync with On Load encryptionKey.
 * Prefer server On Load in prod — key is visible in page source.
 */
NGX.api('event:listen', 'page:ready', function () {
  var POLICY_ID = 'policy_1790353974879';
  var SUBMIT_ID = 'submit_1684917530454';
  var RADIO_ID = 'radio_1784640642802';
  var HIDE_CLASS = 'sei-hide-cta';
  var AES_KEY_HEX = 'ba1accd01b6dec8daaf0cfd112d95913';

  // --- fromOnLoad gate (T&C / Sign up) ---

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

  // --- URL decrypt → email / uid / fromOnLoad ---

  function getParam(params, names) {
    for (var i = 0; i < names.length; i++) {
      var v = params.get(names[i]);
      if (v !== null && v !== '') return v;
    }
    return null;
  }

  function b64ToBytes(b64) {
    var bin = atob(b64.replace(/-/g, '+').replace(/_/g, '/').replace(/\s/g, ''));
    var out = new Uint8Array(bin.length);
    for (var i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }

  function pkcs7Unpad(bytes) {
    if (!bytes.length) return bytes;
    var pad = bytes[bytes.length - 1];
    if (pad < 1 || pad > 16) return bytes;
    return bytes.subarray(0, bytes.length - pad);
  }

  async function decryptAesCbc(b64Token) {
    var raw = b64ToBytes(decodeURIComponent(b64Token).replace(/ /g, '+'));
    if (raw.length < 17) throw new Error('token too short');
    var iv = raw.subarray(0, 16);
    var ct = raw.subarray(16);
    var key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(AES_KEY_HEX),
      { name: 'AES-CBC' },
      false,
      ['decrypt']
    );
    var pt = new Uint8Array(
      await crypto.subtle.decrypt({ name: 'AES-CBC', iv: iv }, key, ct)
    );
    return new TextDecoder().decode(pkcs7Unpad(pt));
  }

  function setInputValue(name, value) {
    if (value == null || value === '') return;
    var el = document.querySelector('input[name="' + name + '"]');
    if (!el) return;
    var desc = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value');
    if (desc && desc.set) desc.set.call(el, String(value));
    else el.value = String(value);
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setFromOnLoad(value) {
    var want = String(value).toLowerCase() === 'true' ? 'true' : 'false';
    var radio = document.querySelector('input[name="fromOnLoad"][value="' + want + '"]');
    if (!radio) return;
    radio.checked = true;
    radio.click();
    radio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function applyFields(uid, email, fromOnLoad) {
    setFromOnLoad(fromOnLoad);
    setInputValue('uid', uid);
    setInputValue('email', email);
    syncCtaVisibility();
  }

  async function fillFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var olTok = getParam(params, ['nc.ol_tok', '?nc.ol_tok', 'ol_tok']);
    var olTok2 = getParam(params, ['nc.ol_tok2', '?nc.ol_tok2', 'ol_tok2']);
    var ol = getParam(params, ['nc.ol', '?nc.ol', 'ol']);

    var uid = '';
    var email = '';
    var fromOnLoad = '';

    if (ol) {
      var data = JSON.parse(await decryptAesCbc(ol));
      uid = data.uid || '';
      email = data.email || '';
      fromOnLoad = data.fromOnLoad != null ? String(data.fromOnLoad) : '';
    }

    if (olTok) {
      try { uid = await decryptAesCbc(olTok); } catch (e) { console.warn('[sei-custom] ol_tok', e); }
    }
    if (olTok2) {
      try { email = await decryptAesCbc(olTok2); } catch (e) { console.warn('[sei-custom] ol_tok2', e); }
    }

    if (!uid && !email) return;

    var flag = fromOnLoad || (uid && email ? 'true' : 'false');
    applyFields(uid, email, flag);
    // Re-apply after radio re-render clears inputs; gate re-syncs each time
    setTimeout(function () { applyFields(uid, email, flag); }, 300);
    setTimeout(function () { applyFields(uid, email, flag); }, 1200);

    console.log('[sei-custom] filled', { uid: uid, email: email, fromOnLoad: flag });
  }

  fillFromUrl().catch(function (e) {
    console.error('[sei-custom]', e);
  });
});
</script>

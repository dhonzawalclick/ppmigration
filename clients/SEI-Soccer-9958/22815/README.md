# Campaign 22815: SEI preference center (staging)

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | [`custom.js`](custom.js) |
| Customize → Custom Styles | [`theme.css`](theme.css) |
| Integrations → On Load | [`onload.json`](onload.json) (set the real `encryptionKey` in Grow) |
| HTTP entry integrations | [`../templates/identify.json`](../templates/identify.json), [`../templates/activity.json`](../templates/activity.json) |

## How the page fills

1. Email link carries `nc.ol` (AES-encrypted JSON with `uid`, `email`, `fromOnLoad`).
2. On Load decrypts it server-side with `encryptionKey` and returns `uid`, `email`, `fromOnLoad` to the form.
3. `custom.js` only hides T&C and Sign up while `fromOnLoad` is false. It holds no key.

Module ids used by `custom.js`: policy `policy_1790353974879`, submit `submit_1684917530454`, `fromOnLoad` radio `radio_1784640642802`. Companion CSS for `.xCustomClass-sei-hide-cta` is in `theme.css`.

## Open items

- Rotate the AES key. The previous key shipped in Custom JS page source.
- Regenerate the sample `nc.ol` in `reference/onload-sample-input.json` with the new key.
- Retest On Load on staging: Network tab `/api/integration/d/onload`, or `&debug=6`.

## reference/

Not pasted into Grow.

| File | What |
| --- | --- |
| `onload-sample-input.json` | Sample plaintext and encrypted `nc.ol` for staging tests |
| `onload-dual-token-groovy.json` | Earlier `nc.ol_tok` / `nc.ol_tok2` Groovy decrypt. Returned 503 on staging. Do not paste. |
| `placeholder-fix.js` | Placeholder helper. Not live; CSS handles placeholders. |
| `activity-debug-probe.json` | Probe config that dumps `form.*` / `entry.*` to a capture URL |
| `pushplanet-9958-desktop.js` | Original PushPlanet script |

# Campaign: `_TEMPLATE-campaign-id`

Replace this folder name with the Grow campaign id (e.g. `22815`).

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | `custom.html` |
| Customize → Custom Styles | `theme.css` |
| Integrations → On Load | `onload-dual-token-zmp-get.json` (ZMP person). `onload.json` is decrypt-only, no GET |

Account-level ZMP HTTP templates live in `../templates/` (`identify.json`, `activity.json`).

Put originals (PushPlanet / Digioh script), samples, and retired attempts in `reference/`. Nothing there is pasted into Grow.

`onload-dual-token-zmp-get.json` is the On Load that returned a ZMP person on SEI 22904. Replace `REPLACE_WITH_AES_KEY_HEX` in both the Groovy `keyBytes` string and `encryptionKey`, plus Basic auth and `REPLACE_ZMP_SITE_ID`. The link is `nc.ol_tok` (AES of the uid string) and `nc.ol_tok2` (AES of the email string): AES-CBC, key = UTF-8 bytes of the hex string, 16-byte IV prepended, PKCS7, standard Base64, then URL-encode. Steps are decrypt, `when$` on uid, GET `/ver2/{site}/subscribers?uid=`, map the person in `eval$`, then `return$` copies `executionResults`. Change the checkbox `eval$` and `return$.data` keys to this form. `onload.json` only decrypts `nc.ol` and does not call ZMP.

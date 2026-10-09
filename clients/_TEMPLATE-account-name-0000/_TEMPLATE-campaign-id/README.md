# Campaign: `_TEMPLATE-campaign-id`

Replace this folder name with the Grow campaign id (e.g. `22815`).

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | `custom.js` |
| Customize → Custom Styles | `theme.css` |
| Integrations → On Load | `onload.json` |

Account-level ZMP HTTP templates live in `../templates/` (`identify.json`, `activity.json`).

Put originals (PushPlanet / Digioh script), samples, and retired attempts in `reference/`. Nothing there is pasted into Grow.

Set `encryptionKey` in Grow only. Keep `REPLACE_WITH_AES_KEY_HEX` in the repo. See [`GUIDE-secrets.md`](../../../GUIDE-secrets.md).

# Campaign: `_TEMPLATE-campaign-id`

Rename this folder to the Grow campaign id (e.g. `22815`).

| Field | Value |
| --- | --- |
| Grow campaign id | |
| Grow display id | |
| Staging preview | `https://us-displayx.wayin.com/preview/experience/<experience-uid>/<display-id>/details?stageMode=true&ptk=…` |

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom CSS | `custom.css` |
| Customize → Custom JavaScript | `custom.html` (may stay empty) |
| Integrations → On Load | `onload.json` |
| Integrations → HTTP entry (submit) | copy from [`/templates/`](../../../../templates/) |

`onload.json` and the submit integrations keep placeholders (`REPLACE_WITH_AES_KEY_HEX`, `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`, `REPLACE_ZMP_SITE_ID`). Keep the copies with real credentials next to them as `WIP*.json` (gitignored) and paste those into Grow.

## On Load (`onload.json`)

Dual-token ZMP person read: decrypt `nc.ol_tok` (uid) and `nc.ol_tok2` (email), GET `/ver2/{site}/subscribers?uid=`, map the person, `return$`. Change the person mapping and the `return$.data` keys to this form's field names. Steps and failure causes: [`readmes/sei-onload-integration.md`](../../../../readmes/sei-onload-integration.md).

`reference/onload-decrypt-only.json` decrypts one `nc.ol` blob and does not call ZMP. Nothing in `reference/` is pasted into Grow.

## Builder rules

- A module that gets more than one On Load value (Name: `name_Firstname` + `name_Lastname`) must not have a display condition. Grow keeps one prefilled value per hidden conditional module, so the second value overwrites the first. Hide it with `custom.css` instead.
- Hide `uid` / `email` with CSS, not a display condition. A field closed by a display condition does not post.
- Submit modules cannot take a display condition. `custom.css` hides T&C + submit while `fromOnLoad` is false.

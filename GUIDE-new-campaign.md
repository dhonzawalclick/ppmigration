# Guide: new migrated campaign

Source: [Notes Migration](https://zetaglobal.atlassian.net/wiki/spaces/PTGM/pages/2634121229/Notes+Migration) and SEI campaign 22815.

## 1. Folders

1. If the account is new, copy `clients/_TEMPLATE-0000-ACCOUNT/` to `clients/{grow_tenant_id}-{ACCOUNT}/` (e.g. `2353-SEI`) and fill its `README.md`. The tenant id is in the experience page source: `'tenant': { 'id': … }`.
2. Rename `_TEMPLATE-Account-0000/` to `{Account}-{PushPlanet experience id}` (e.g. `SEI-Soccer-9958`). Add one of these per migrated experience.
3. Rename `_TEMPLATE-campaign-id/` to the Grow campaign id.
4. Put the original PushPlanet / Digioh script in `{campaign_id}/reference/`.
5. Keep copies with real credentials as `WIP*.json` next to the placeholder files. `.gitignore` excludes them.

## 2. Form modules

Field names work like HTML `name`. On Load `return$.data.<name>` fills the field with that name, and integrations read it as `params.<name>` / `entry.<friendly_id>`.

| Field | Type | Setup |
| --- | --- | --- |
| `fromOnLoad` | Radio `true` / `false` | Class `hidden`, default `false` |
| `uid` | Text | Class `hidden`, not required, shown when `fromOnLoad` is true |
| `email` | Email | Class `hidden` if not user-editable. Place before any callout that shows it as a token. |
| Other On Load values (`bu`, `phone`, ...) | Text | Class `hidden`, not required, shown when `fromOnLoad` is true |
| Error callout | Callout | Class `defaultError`, shown when `fromOnLoad` is false |

- Hide `uid` / `email` with CSS, not a display condition. A field closed by a display condition does not post.
- A module that gets more than one On Load value (Name: `name_Firstname` + `name_Lastname`) must not have a display condition. Grow keeps one prefilled value per hidden conditional module, so the last value wins. Hide it with `custom.css` until `fromOnLoad` is true. Verified on SEI 22904.
- Checkbox fields take an array of choice ids from On Load (e.g. `"I_am_a": ["parent", "fan"]`).
- Do not name a field `campaignid`. It collides with Grow's `campaignId`. Use `campaign_id`.

## 3. On Load

Person prefill from ZMP uses the template `onload.json`. Verified on SEI campaign 22815 / display 22904. Step-by-step notes: [`readmes/sei-onload-integration.md`](readmes/sei-onload-integration.md).

- The URL must include `nc.ol_tok` and `nc.ol_tok2`, or On Load does not run. A param name has to start with `nc.ol`.
- `nc.ol_tok` is the AES ciphertext of the uid string. `nc.ol_tok2` is the AES ciphertext of the email string. AES-CBC, key = UTF-8 bytes of the hex string, random 16-byte IV prepended, PKCS7, standard Base64, then URL-encode. The same key goes in `encryptionKey` and in the Groovy `keyBytes` string.
- Step order: three `eval$` decrypts, `when$` on the uid, `http$` GET `/ver2/{site}/subscribers?uid=`, one `eval$` that reads the person, `return$` that copies `executionResults`.
- `http$` keys that ran: `header$`, `url$`, `params$`, `queryParams$`, `verb$`, `httpResponseAsJsonVar$`, `requestType$`. The uid sent to ZMP is `${executionResults.uid}`.
- A GET that read `encryptedTokenMapping` from `nc.ol` and mapped the person inside `return$` came back `{}` on this account.
- `reference/onload-decrypt-only.json` is decrypt-only `nc.ol` with no ZMP call.
- Generate a key with `openssl rand -hex 16`. The repo keeps `REPLACE_WITH_AES_KEY_HEX`. Use `&nc.ol_tok=`, never `&?nc.ol_tok=`.

## 4. Customize (`custom.css`, `custom.html`)

- The `fromOnLoad` gate is CSS: `custom.css` hides the radios, hides T&C + submit while `fromOnLoad` is false, and hides multi-value modules (Name) until it is true. Replace the `REPLACE_` module ids with the ones on the live page.
- The submit module cannot take a display condition, which is why the gate is in CSS.
- `custom.html` may stay empty. If used, it must be wrapped in `<script>` tags. Use it for copying non-`nc.` URL params into hidden fields on `page:ready`. Do not decrypt tokens in JS.
- On Load values arrive after `page:ready` and `form:ready`. JS must react to the `fromOnLoad` radio changing instead of reading it once.

## 5. ZMP integrations (`/templates/`)

- Copy `activity.json` (and `identify.json` / `get-contact.json` if needed) from the repo-level `templates/`. They hold SEI's site ids and field names: change `url` / `stageUrl` and the `entry.*` / `params.*` keys to this form's fields. If the experience needs its own variants (e.g. a dual CTA), keep them in `{Account}-{pushplanet_id}/templates/`.
- Keep `paramsType: "mapped"`, `ignoreEmpty: true`, `required: ["email"]`.
- Point `stageUrl` at a capture endpoint (webhook.site, ngrok) first, then at ZMP.

## 6. Test

| Check | How |
| --- | --- |
| On Load answer | Network tab `/api/integration/d/onload`, or `&debug=6` |
| Good link | `fromOnLoad` true, `uid` / `email` filled, Sign up visible |
| No / bad link | Error copy shown, Sign up hidden |
| Submit | Integration Debug tab shows each request; ZMP profile and event updated |

Staging URL shape: `?stageMode=true&ptk=...&nc.ol_tok=...&nc.ol_tok2=...&debug=6`.

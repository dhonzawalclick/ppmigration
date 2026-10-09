# Guide: new migrated campaign

Source: [Notes Migration](https://zetaglobal.atlassian.net/wiki/spaces/PTGM/pages/2634121229/Notes+Migration) and SEI campaign 22815.

## 1. Folders

1. If the account is new, copy `clients/_TEMPLATE-account-name-0000/` to `clients/{acc.name}-{account.number}/` and fill its `README.md`.
2. Rename `_TEMPLATE-campaign-id/` to the Grow campaign id.
3. Put the original PushPlanet / Digioh script in `{campaign_id}/reference/`.

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
- Do not name a field `campaignid`. It collides with Grow's `campaignId`. Use `campaign_id`.

## 3. On Load (`onload.json`)

- The URL must carry at least one `nc.` param or On Load does not run.
- Encrypt a JSON blob (`uid`, `email`, `fromOnLoad`) and pass it as `nc.ol`. Grow decrypts it with `encryptionKey` into `encryptedTokenMapping.*`.
- Return `fromOnLoad` as the string `"true"`.
- Generate a key: `openssl rand -hex 16` (or `-hex 32`). Enter it in Grow only; keep `REPLACE_WITH_AES_KEY_HEX` in the repo.
- Link pipeline: encrypt → `base64_encode | strip_newlines | url_encode`. Use `&nc.ol=`, never `&?nc.ol=`.

## 4. Customize (`custom.js`, `theme.css`)

- `custom.js` must be wrapped in `<script>` tags.
- Use JS for UI and for copying non-`nc.` URL params into hidden fields on `page:ready`. Do not decrypt tokens in JS.
- On Load values arrive after `page:ready` and `form:ready`. React to the `fromOnLoad` radio changing instead of reading it once.
- The submit module cannot take a display condition. Hide it with CSS or a custom class until `fromOnLoad` is true.

## 5. ZMP integrations (`templates/`)

- Copy `identify.json` / `activity.json` from the account `templates/`. Adjust the `entry.*` keys to the form's Friendly IDs.
- Keep `paramsType: "mapped"`, `ignoreEmpty: true`, `required: ["email"]`.
- Point `stageUrl` at a capture endpoint (webhook.site, ngrok) first, then at ZMP.

## 6. Test

| Check | How |
| --- | --- |
| On Load answer | Network tab `/api/integration/d/onload`, or `&debug=6` |
| Good link | `fromOnLoad` true, `uid` / `email` filled, Sign up visible |
| No / bad link | Error copy shown, Sign up hidden |
| Submit | Integration Debug tab shows each request; ZMP profile and event updated |

Staging URL shape: `?stageMode=true&ptk=...&nc.ol=...&debug=6`.

# Prompt: Custom JS → Grow ZMP JSON configs

**How to use:** Mention this file (e.g. “follow `readmes/grow-json-from-custom-js.md`”) and attach or point at the custom JS. The agent must follow the instructions below.

---

## Copy-paste prompt

```
Follow readmes/grow-json-from-custom-js.md.

Here is the custom JS (or path): <PASTE OR PATH>

Produce Grow “Other Data Integration” JSON config file(s) that replicate the ZMP writes this script performs via Push Planet / Digioh helpers. Do not rewrite the experience logic as JS. Credentials stay as placeholders.
```

---

## Agent instructions (follow exactly)

### Goal

From Push Planet / Digioh **custom JS**, detect which **LPO / ZMP helper functions** are called and emit the matching **Grow JSON integration config(s)** that hit the equivalent ZMP REST endpoints.

Do **not** create a JS “Grow replica” of form/UI logic. Output is Grow JSON only (plus brief notes if needed).

### Required reading (in this order)

1. The custom JS the user provided (path or paste).
2. [`lpo-api-documentation.md`](./lpo-api-documentation.md) — Push Planet / Digioh function signatures and payload shapes.
3. [`readme.md`](./readme.md) — Grow JSON field reference + ZMP auth / base URL / migration context.
4. Official ZMP docs as needed:
   - https://docs.zetaglobal.com/reference/getting-started
   - https://docs.zetaglobal.com/reference/identify-a-user
   - https://docs.zetaglobal.com/reference/track-an-event-rest
   - https://docs.zetaglobal.com/reference/get-a-contact-record
   - Related pages if unsubscribe / lookup by contact appear in the JS

### Detect these LPO helpers in the JS

| Helper (Push Planet) | Digioh equivalent | Grow implication |
| --- | --- | --- |
| `window.zetaTrackEvent` | `api.ZETA_FUNCTIONS.zetaTrackEvent` | One JSON config → `POST /{site_id}/activities` |
| `window.updateSubscriber` | `api.ZETA_FUNCTIONS.updateSubscriber` | One JSON config → `POST /{site_id}/subscribers/identify` |
| `window.zetaUnsubUser` | *(not in Digioh)* | One JSON config → ZMP unsubscribe / contact inactive endpoint (confirm path in ZMP docs) |
| `window.getSubscriber` | `api.ZETA_FUNCTIONS.getSubscriber` | Usually **read/prefill**, not a Grow outbound entry integration — note it; only write a Grow GET config if the user asks |
| `window.getSubscriberByContactEmail` | `api.ZETA_FUNCTIONS.getSubscriberByContact` | Same as above — note / optional GET config only if asked |

**One Grow JSON config = one HTTP call.** If the JS calls identify then track event, create **two** JSON files. Explain briefly why when asking.

### Payload rules

- Map form/entry fields from the custom JS into Grow `${entry.*}` (and groovy ternaries where needed).
- Prefer **official ZMP REST body shapes** from docs (e.g. identify under `subscriber`, prefs under `properties`) when they differ from the flatter Push Planet helper payload — call out any intentional divergence from the JS.
- Preserve event names (e.g. `preference_center`), property keys (e.g. `pref_center_*`), and value conventions (`Y`/`N`, `active`/`inactive`) from the JS unless docs require a wrapper change.
- Auth: Basic `api` + REST API key → `"Authorization": "Basic REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)"`. Never invent real secrets.
- Use the `site_id` from the JS (e.g. Boomtrain/p13n load) in the URL: `https://api.zetaglobal.net/ver2/{site_id}/...`.
- Include Grow settings consistent with existing configs: `requestType: json`, `verb: post` (or get for lookups), `paramsType: mapped`, `formatType: structured`, `ignoreEmpty`, `nullHandling`, `required`, `header`, `params`.

### Output

1. Write JSON file(s) next to the source custom JS when possible (same folder), named clearly, e.g.:
   - `{experience}-grow-zmp-identify.json`
   - `{experience}-grow-zmp-activity.json`
   - `{experience}-grow-zmp-unsubscribe.json`
2. Short reply: which LPO functions were found → which files were created → open questions (uid vs email, contact_value quirks, Digioh-only gaps, prefill/GET needs).
3. Do not dump large Grow field-reference docs into new files; link `readme.md` / `lpo-api-documentation.md` instead.

### Do not

- Replicate checkbox UI, validation, or p13n bootstrap as new JS.
- Commit real API keys, GUIDs used as secrets, or live Basic tokens.
- Collapse identify + activity into one JSON unless the user explicitly wants a single call and accepts dropping the other write.

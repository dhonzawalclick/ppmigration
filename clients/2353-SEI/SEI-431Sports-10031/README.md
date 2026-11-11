# SEI 431 Sports — PushPlanet `10031`

| Field | Value |
| --- | --- |
| Grow experience name | `10031 - sei-431sports-prod-preference page updated` |
| PushPlanet page | `10031` — `sei-431sports-prod-preference page updated` |
| PP account | `829` / `431-sports@zetaglobal.com` |
| PP page GUID | `11381d9518774d37bdae7a1867532f76` |
| PP integration id | `3391` (`pp_int_id`) |
| PP guid | `1f81ee88a1fc4479bad9acdfa853ed0e` |
| Hosted URL | https://preferences.email.431sports.com/preferences |
| ZMP site (p13n / prod) | `sei-431sports` |
| Grow campaign | `23127` (staging) |
| Staging | https://us-displayx.wayin.com/preview/experience/4362b713-5988-4221-b9a3-13ea2e60e144/23127/details?stageMode=true&ptk=7d8f77f0f6381aefaa7ac1fb9a8684d9 |
| Custom CSS | [`custom.css`](custom.css) — field-name / platform selectors only (no `#xSectionDetails_*`) |

### Naming note

Grow experience name convention: **`{PushPlanet id} - {PushPlanet page name}`**.

Example (Soccer): `9952 - sei-soccer-com-prod preference page`.

This experience: **`10031 - sei-431sports-prod-preference page updated`** (PP page name as-is from account 829 / page 10031).

Source custom JS: [`reference/pushplanet-10031-desktop.js`](reference/pushplanet-10031-desktop.js).

Integrations (paste targets): [`templates/onload.json`](templates/onload.json), [`templates/activity.json`](templates/activity.json). Credentialed copies: `WIPonload.json`, `WIPactivity.json` (gitignored).

## What the PP JS does

1. Loads `https://cdn.boomtrain.com/p13n/sei-431sports/p13n.min.js`.
2. Reads `encbu` / `ence` (base64 uid / email), uses `btSubscriberJson` from PP preference-center load (integration `3391`).
3. Prefills checkboxes from `btSubscriberJson.properties.pref_center_*`.
4. On `#submit`: validates name / DOB (12+), then:
   - `window.updateSubscriber(pp_guid, pp_int_id, user_json, …)` — person update
   - `window.zetaTrackEvent(…, user_event_json, …)` — event `preference_center`

## ZMP endpoints (Grow equivalents)

| PP call | Grow mapping | HTTP |
| --- | --- | --- |
| PC load → `btSubscriberJson` | On Load | `GET https://api.zetaglobal.net/ver2/{site}/subscribers?uid=` |
| `updateSubscriber` + `zetaTrackEvent` | HTTP entry (one shot) | `POST https://api.zetaglobal.net/ver2/{site}/activities` with `identify_person: true`, `event: preference_center` |

Testing: On Load + activity both hit **`sei-dev`** (`url` and `stageUrl`). Prod target for this brand is `sei-431sports` (matches `site_id` in the JS) — switch activity URLs at go-live.

## Grow field plan

| Grow field name | Type | Notes |
| --- | --- | --- |
| `fromOnLoad` | radio true/false | gate |
| `uid`, `email` | hidden / email | from On Load |
| `name_Firstname`, `name_Lastname` | Name module | required in PP |
| `date_of_birth` | date | required; 12+ check was client-side in PP |
| `I_am_a` | checkbox | choice ids on 23127: `parent`, `coachadmin`, `player`, `fan`, `option` (label Referee — rename id to `referee` when convenient) |
| `My_preferences` | checkbox | sports: `volleyball`, `baseball`, `softball`, `soccer`, `sports_referee` (+ `all`) |

## PP quirks (do not copy blindly)

- `pref_center_*` flags are written on the **root** of `user_json`, not under `properties`. Grow activity puts them under `subscriber.properties`.
- `contacts[0].contact_value` is set to **`uid`**, not email. Grow mapping uses email for `contact_type: email`.

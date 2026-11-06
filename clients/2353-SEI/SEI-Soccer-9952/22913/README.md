# Campaign: `22913`

Grow campaign for SEI Soccer PushPlanet experience **9952** (prefs + unsubscribe).

Staging preview:  
`https://us-displayx.wayin.com/preview/experience/4362b713-5988-4221-b9a3-13ea2e60e144/22913/details?stageMode=true&ptk=b22de234441d59db92db5b62467d26b6`

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | `custom.html` |
| Customize → Custom Styles | `theme.css` |
| HTML module (unsub CTA) | `unsub.html` (`#unsub_btn`) |
| Integrations → On Load | `WIPonload.json` (creds, gitignored) / `onload.json` (placeholders) |
| HTTP entry (submit) | `WIPactivity-identify.json` (creds, gitignored) / [`activity-identify.json`](activity-identify.json) (placeholders; same as [`../templates/activity-identify.json`](../templates/activity-identify.json)) — one `POST …/sei-dev/activities` with `identify_person: true`; branches on `params.sei_action` |
| On Load ZMP read shape | [`../templates/get-contact.json`](../templates/get-contact.json) — embedded as On Load `http$` |

How On Load works (decrypt, ZMP GET, failure modes): [`readmes/sei-onload-integration.md`](../../../../readmes/sei-onload-integration.md). Same runner model as campaign **22815** / display **22904**.

## On Load (22913)

Decrypt link tokens, look the email up in ZMP, set `fromOnLoad` from whether that person exists.

| Step | What |
| --- | --- |
| 1–3 `eval$` | Decode + AES-CBC decrypt → `uid`, `mail` |
| 4 `when$` + `http$` | If `mail` present: `GET …/sei-dev/subscribers?email=` |
| 5 `eval$` | `zmpFound` = person has `uid`/`id` |
| 6 `return$` | `uid`, `email`, `removeme`; `fromOnLoad` = `true` only when `zmpFound` |

**Link params:** `&nc.ol_tok=<AES uid>&nc.ol_tok2=<AES email>`. AES key + Basic auth in `WIPonload.json`.

Paste `WIPonload.json` into Grow.

### Known issue: first name blank, last name filled

On Load can return both `name_Firstname` and `name_Lastname`, but if the Name module is a Grow **conditional** (`xConditional`), a hidden module only keeps **one** prefilled value — last overwrites first.

**Fix (same as 9958 / 22904 — no JS):**
1. Page Builder → Name → **remove the display condition** (module stays in the DOM).
2. CSS hide until `fromOnLoad` is true (in `theme.css`) — field name + `.xName`, never `#xSectionDetails_name_*`:

```css
.xForm:not(:has(input[name="fromOnLoad"][value="true"]:checked)) .xComponent.xName {
  display: none !important;
}
```

**Later / CSS hygiene:** Do not target Grow `#xSectionDetails_*` / `#…Wrapper` IDs in Custom CSS when a field `name`, element, or `xCustom-*` class works — those IDs are regenerated and break pastes. Exception only when NGX APIs require a module id (Custom JS `module:add:custom:classes`).

### Dual CTA → `params.sei_action`

Shared form. Custom JS tags the submit:

| Button | `sei_action` | ZMP write (`activity-identify`) |
| --- | --- | --- |
| Sign up | `preference_center` (default) | `POST …/activities` + `identify_person: true`, event `preference_center`, contact `active`, properties = `email` only |
| Unsubscribe (`#unsub_btn`) | `unsubscribe` | Same endpoint; event `unsubscribe`, contact `inactive`, properties = `email` (matches PP unsub `updateSubscriber` + `zetaTrackEvent`) |

Payload is email-only (plus `uid`). No name / DOB / `pref_center_*`. Paste `WIPactivity-identify.json` into Grow.

**Validation:** Grow still validates native required fields when Sign up is used for submit. Prefer not marking name/DOB/T&C/prefs as required if unsub must work without filling them; enforce prefs rules in a `form:add:submitHandler` for the prefs path only.

Put PushPlanet / Digioh originals and scratch samples in [`reference/`](reference/).

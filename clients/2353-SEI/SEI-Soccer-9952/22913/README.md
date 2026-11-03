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
| HTTP entry (submit) | [`../templates/activity-identify.json`](../templates/activity-identify.json) — Track + Identify; branches on `params.sei_action` |
| On Load ZMP read shape | [`../templates/get-contact.json`](../templates/get-contact.json) — embedded as On Load `http$` |

How On Load works (decrypt, ZMP GET, failure modes): [`readmes/sei-onload-integration.md`](../../../../readmes/sei-onload-integration.md). Same runner model as campaign **22815** / display **22904**.

## On Load (22913)

Same as 9958: decrypt `nc.ol_tok` / `nc.ol_tok2`, `GET /ver2/sei-dev/subscribers?uid=`, map person → form `data`.

| Step | What |
| --- | --- |
| 1–3 `eval$` | Decode + AES-CBC decrypt → `uid`, `mail` |
| 4 `when$` + `http$` | Skip if no uid; GET `sei-dev` subscriber |
| 5 `eval$` | Unwrap list; name / DOB parts; roles + interests from `pref_center_* == 'Y'` |
| 6 `return$` | Prefill keys below; `fromOnLoad` is `true` only when uid and email both resolve |

**Auth / site (staging):** Basic `api:<sei-dev REST key>`, URL `https://api.zetaglobal.net/ver2/sei-dev/subscribers`. Do not point On Load at `sei-soccer-com` with the sei-dev key (401 → Grow 503).

**Link params:** `&nc.ol_tok=<AES uid>&nc.ol_tok2=<AES email>` (not `nc.ol` blob). Key = UTF-8 bytes of the 32-char hex string. Details in the shared On Load readme.

### Staging form fields (verified on preview)

| Grow field | Choice ids / notes |
| --- | --- |
| `fromOnLoad` | `true` / `false` |
| `uid` | hidden |
| `email` | email module |
| `name_Firstname`, `name_Lastname` | name module |
| `date_of_birth` + `_Year` / `_Month` / `_Day` | DOB; Month options are unpadded `1`–`12` |
| `I_am_a` | `parent`, `coachadmin`, `player`, `fan` |
| `My_preferences` | `latest_product_drops`, `cleats_and_shoes`, `fan_jerseys_and_gear`, `apparel`, `soccer_balls_and_equipment`, `goalkeeper`, `deals_and_special_offers`, `new_content_and_articles` (+ UI `all`) |
| `removeme` | unsub email Text module — On Load fills same value as `email` |

ZMP → Grow interest mapping uses the **9958 preference-center** property names (`pref_center_cleats_and_shoes`, …), not the old PushPlanet 9952 ids (`new_cleats`, `group_opt_in_list`, …).

Test users: [`../../SEI-Soccer-9958/sei-dev-test-users.md`](../../SEI-Soccer-9958/sei-dev-test-users.md).

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

| Button | `sei_action` | PushPlanet → ZMP |
| --- | --- | --- |
| Sign up | `preference_center` | `updateSubscriber` (prefs). PP had `zetaTrackEvent(preference_center)` commented out. |
| Unsubscribe (`#unsub_btn`) | `unsubscribe` | contact `inactive` + `zetaTrackEvent(event: "unsubscribe")` |

Flat entry integrations gate with `executeIf` on `params.sei_action` (see templates). Scripting notes: [`readmes/grow-scripting-guide.md`](../../../../readmes/grow-scripting-guide.md).

**Validation:** Grow still validates native required fields when Sign up is used for submit. Prefer not marking name/DOB/T&C/prefs as required if unsub must work without filling them; enforce prefs rules in a `form:add:submitHandler` for the prefs path only.

Put PushPlanet / Digioh originals and scratch samples in [`reference/`](reference/).

# SEI PushPlanet → Grow migration notes

SEI Soccer preference-center migration details. General PushPlanet/Digioh → Grow overview and ZMP/JSON reference stay in [`readme.md`](readme.md).

| Asset | Path |
| --- | --- |
| PushPlanet script | [`reference/pushplanet-9958-desktop.js`](../clients/SEI-Soccer-9958/22815/reference/pushplanet-9958-desktop.js) |
| Grow Custom CSS | [`22815/theme.css`](../clients/SEI-Soccer-9958/22815/theme.css) |
| Grow Custom JS | [`22815/custom.js`](../clients/SEI-Soccer-9958/22815/custom.js): CTA gate only, no AES key |
| On Load (`nc.ol`) | [`22815/onload.json`](../clients/SEI-Soccer-9958/22815/onload.json) + [`sample`](../clients/SEI-Soccer-9958/22815/reference/onload-sample-input.json) |
| On Load legacy Groovy template | [`reference/onload-dual-token-groovy.json`](../clients/SEI-Soccer-9958/22815/reference/onload-dual-token-groovy.json): do not use; 503’d on staging |
| Identify / Activity JSON | [`templates/identify.json`](../clients/SEI-Soccer-9958/templates/identify.json), [`templates/activity.json`](../clients/SEI-Soccer-9958/templates/activity.json) |
| Grow Experience | Campaign **22815** (staging) |

## Grow migration field notes

Working notes for PushPlanet / Digioh → Grow migrations (modules, URL params, On Load / HTTP integrations, Custom JS, unsubscribe template steps).

### 1. The campaign and its modules

A Grow form is a set of modules. Each module has its own properties, design, validation, and display rules.

- Some modules are **fields** (text, email, radio, checkbox, hidden) and attach data that integrations receive on submit.
- Others only show **content** (callouts, images, the submit button).

Each field module has a **field name** (for example `uid`). It works like the `name` attribute of an input in a normal HTML form:

- integrations read and fill a field by its field name (`params.uid`, `return$.data.uid`);
- submit posts the value under the field name;
- a script finds the input by its field name (`input[name="uid"]`) or sets it with `form:set:field`.

Most migrated forms have these modules for the integrations.

#### a) `fromOnLoad` — radio (`true` / `false`)

- Means “we resolved the user from the email link.” Starts **false**; when set to **true**, Grow conditionals show the real fields.
- **SEI:** server On Load decrypts `nc.ol` and returns `fromOnLoad: "true"`. Submit/T&C still need Custom JS because submit modules cannot use display conditions. See [Customize](#sei-grow-experience-customize-campaign-22815).

#### b) `uid` and `email`

Hidden/email fields that identify the user for ZMP. **SEI:** On Load fills them via `encryptedTokenMapping` / `return$.data`.

#### c) Other fields

A complex form has more fields that On Load fills (for example `bu`, `phone`, or other preference-page values).

#### d) Real hidden fields (module cogwheel → Advanced → hidden fields)

Use them for values that Custom JavaScript writes (for example `message_uid` from the URL) and for fixed values that an HTTP integration sends.

#### Hidden via CSS class (a, b, c)

`a`, `b`, and `c` are **real fields**. Each of `a` and `b` (and typically the other On Load-filled fields) gets **`hidden` in the class box** (module → Design → Developer options → CSS class name). Grow adds the prefix `xCustom-`, so the page class is `xCustom-hidden`, and the theme hides it.

- The class box takes **one class only**.
- A field with `display: none` **still posts**.
- A module whose **display condition** closes it **does not post**.

We use these real fields (with the `hidden` class) because On Load does not always fill a real Advanced hidden field (observed behavior).

### URL parameters

| Pattern | Behavior |
| --- | --- |
| Param | What SEI uses it for |
| --- | --- |
| `nc.ol` | Single encrypted JSON blob. Server On Load decrypts it with `encryptionKey`. |
| `nc.ol_tok` / `nc.ol_tok2` | Earlier dual-token pattern (AES uid / AES email). Retired for SEI. |
| `nc.pf_<fieldname>` | Grow prefills a field (`pf` = prefill). Value for radios/checkboxes must be the choice id. |
| Other `nc.*` | Fires On Load if a server integration is configured; Custom JS can also read via `URLSearchParams`. |
| No `nc.` prefix | Integrations ignore it; only Custom JS can read it. |

Use `&nc.ol_tok=…` (not `&?nc.ol_tok=`). Any `nc.*` param also triggers Grow’s On Load POST if an On Load integration is saved on the campaign.

### 2. Integrations

Grow has many integration types. For this migration we primarily use two:

| Type | When it runs |
| --- | --- |
| **On Load** | Once when the page loads |
| **HTTP entry** | On submit (often arrives ~10–30 seconds after the click) |

Each integration is a JSON config. Values are Groovy expressions in `${...}`.

Most integrations use `subSteps` with `onlySubSteps: true`. Sub steps run in order. A step reads earlier results in `executionResults`. A key **cannot** read another key of the **same** `eval$` step — put the dependent key in the next step.

Typical On Load chain:

```
decode URL parameters
  → decrypt with AES key
  → if uid present, http$ to ZMP
  → eval$ on the answer
  → return$ values to the form
```

An entry integration can send more calls in order (for example identify, then activity).

#### Guards

- `when$` on a sub step: the step runs only when the value is true. To skip it, give an empty string (`?: ''`) (known working pattern).
- `executeIf`: use only on a **flat** integration (one call, no `subSteps`). When `onlySubSteps` is true, Grow **ignores** `executeIf`.

#### What an integration can read

- `params.<name>` — every form field, every hidden field, every `form:add:data` value
- `entry.email`, `entry.eventDate` (US Eastern with a `Z` — not UTC), `entry.request.ip`
- `executionResults` — results of earlier sub steps (convention; other objects/lists/vars can be used)
- PII can be added via a `piiData` object

#### What On Load returns

`return$.data` fills fields that have the same names:

| Field type | Returned value |
| --- | --- |
| text | string |
| radio | choice id as a string |
| checkbox | array of choice ids |

#### Testing integrations

- **On Load:** open the staging form with the Network tab. Find `/api/integration/d/onload`. The JSON answer shows returned values. Or add `&debug=6` and read the console.
- **Entry integration:** send to webhook.site, ZMP, or another capture (cloudflared, ngrok, etc.) first. Map all of `params` to see what arrives (similar to `{{event}}` in ZMP).
- **Logs:** each integration’s Debug tab has one record per run, with each sub step. Errors tab shows only failures. On Load writes no debug log when `logDebug` is false. Errors can take time to appear.

### 3. Custom JavaScript

Used mostly for design and to pass data; also fine as general JavaScript. Events are documented in the Scripting Guide (right side of any Custom JS view).

```html
<script>
NGX.api("event:listen", "page:ready", function () {
  // your code
});
</script>
```

These events are similar to IgnitionOne’s After DOM Ready, After Display, After Submit, etc.

| Event / API | Notes |
| --- | --- |
| `page:ready` | Page rendered (~After DOM Ready). Good for copying `message_uid` from the URL into a hidden field (slightly before the form is fully ready). |
| `form:ready` | Form ready (~After Display). Grow can re-render a node and undo earlier DOM changes — make DOM changes here (e.g. link changes). On Load values are **not** in the fields yet at `page:ready` / `form:ready` (On Load arrives ~0.1–2s later). |
| `form:field:change` / `focus` / `blur` | Field changed, focused, or blurred. |
| `form:entry:success` / `form:entry:failed` | Submit outcomes (less used so far; can be useful). |
| `module:ready` | Each module fires when built. Grow puts On Load values into the module at this event. Useful for debug (`console.log` + `&debug`). |
| `form:set:field` `{name, value}` | Sets a field in the form store. For radio/checkbox, `value` is the **choice id**, not `remoteId`. Display conditions match `remoteId` (e.g. fromOnLoad true = remoteId `1`). |
| `form:add:data` `{name, value}` | Extra submit data — not a field. Arrives as `params.name`, not `entry.name`. Not in entries export; HTTP integrations get it. |
| Submit | Grow posts its form store as `multipart/form-data` (classic browser form). |

#### Testing Custom JS

- Put start-up code in the Custom JavaScript box with `<script>` tags.
- Add `&debug` to the URL: console shows each event and what On Load returned; page shows module ids. Any value turns debug on — remove the key to turn it off.
- `NGX.api('help')` lists methods (similar to Digioh `DIGIOH_API.printAll()`).
- To count modules, count `module:ready`, not `module:loaded`.

### 4. Common steps on an unsubscribe form

Each client has a similar unsubscribe form template in Grow; steps are usually similar.

#### Form

1. Remove the template’s Advanced hidden field `uid`.
2. Add a **Text** field `uid`: class `hidden`, not required, after the `fromOnLoad` radio, shown when `fromOnLoad` is true.
3. `fromOnLoad` radio: class `hidden`. Keep **false** as the default.
4. Email field: class `hidden`. If a callout shows the email as a token, put the email field **before** that callout (a token only works when its field comes first).
5. Error callout: class `defaultError`, shown when `fromOnLoad` is false.
6. Each other On Load value (`bu`, `phone`, `prev…`): Text field, class `hidden`, not required, shown when `fromOnLoad` is true.
7. If the link has `message_uid`: add a hidden field `messageuid`, and a `page:ready` script that copies `message_uid` from the URL into it. Do **not** name a field `campaignid` (collides with Grow system field `campaignId`). Use `campaign_id`.

#### Customise

8. Add Custom CSS:

```css
#xSubmitContainer { display: none !important; }
#entries:has(.xField.xChecked input[name="fromOnLoad"][value="true"]) #xSubmitContainer { display: flex !important; }
.xCustom-defaultError { opacity: 0; animation: showContent 0s ease 1s forwards; }
@keyframes showContent { to { opacity: 1; } }
```

- First two rules: hide submit until `fromOnLoad` is true.
- Last two: delay error copy by 1s so a good link does not flash the error state.

9. Remove the old 500 ms `setTimeout` block from the template Custom JavaScript. If you do not need the `message_uid` script, leave the box empty (Custom CSS covers what the timeout did).

#### Integrations and link

#### On Load configs (SEI)

| File | Role |
| --- | --- |
| [`22815/onload.json`](../clients/SEI-Soccer-9958/22815/onload.json) | Server On Load (`nc.ol` + `encryptionKey` → `encryptedTokenMapping`) |
| [`reference/onload-sample-input.json`](../clients/SEI-Soccer-9958/22815/reference/onload-sample-input.json) | Sample `nc.ol` JSON blob |
| [`reference/onload-dual-token-groovy.json`](../clients/SEI-Soccer-9958/22815/reference/onload-dual-token-groovy.json) | Legacy Groovy dual-token On Load. Caused 503; do not paste. |

10. Paste Custom JS + CSS from Customize section. Paste On Load and set `encryptionKey` in Grow. Add HTTP entry integration(s) for ZMP (`paramsType: "mapped"`, `ignoreEmpty: true`).
11. Email link: single `nc.ol` = AES-encrypted JSON (`uid`, `email`, `fromOnLoad`), same key as On Load `encryptionKey`.

---
---

## SEI Grow Experience Customize (campaign 22815)

Staging preference-center form. Paste into **Customize** → **Apply / Save & Close** → experience **Save**.

| Slot | Repo file | Notes |
| --- | --- | --- |
| Custom Styles | [`22815/theme.css`](../clients/SEI-Soccer-9958/22815/theme.css) | Layout, placeholders, name/email/DOB. Month dropdown stays working. |
| Custom JavaScript | [`22815/custom.js`](../clients/SEI-Soccer-9958/22815/custom.js) | `fromOnLoad` gate only. |

Scripting Guide: `/admin/campaign/scripthelpmicro`. Custom JS **must** include `<script>` tags or Grow dumps source as page text. Prefer `NGX.api` over raw DOM for system modules.

### What the Custom JS does

It does not decrypt tokens and holds no AES key. On Load fills `uid`, `email`, `fromOnLoad`. An earlier version decrypted `nc.ol_tok` / `nc.ol_tok2` in the browser; that key was readable in page source and must be rotated.

**`fromOnLoad` gate (T&C + Sign up)**

| Value | Grow conditionals (name, email, DOB, multi opt-ins) | T&C + Sign up |
| --- | --- | --- |
| **True** | Shown | Shown |
| **False** | Hidden by module conditionals | Hidden by Custom JS (`sei-hide-cta`) |

Policy/submit modules cannot use Page Builder conditions, so JS toggles class `sei-hide-cta` on `policy_1790353974879` and `submit_1684917530454` via `module:add/remove:custom:classes`. Companion CSS in the theme file hides `.xCustomClass-sei-hide-cta`.

In production, hide the True/False radio UI when you no longer need the staging toggle.

### Practical checklist for SEI prefs

| ZMP property (in JSON) | Needs a Grow form field with Friendly ID (or standard name) |
| --- | --- |
| `email` | Email module → `email` |
| `first_name` / `last_name` | Name module fields → `first_name` / `last_name` (or map whatever Grow emits) |
| `date_of_birth` | DOB module → `date_of_birth` |
| `pref_center_*` | Checkboxes / Multi Opt-in → Friendly IDs like `parent`, `fan`, `cleats_and_shoes`, … (JSON converts checked → `Y`/`N`) |
| `uid` | Hidden/decrypted field or Customer ID → `uid` |

If Friendly IDs in the live Experience differ from the stubs, **update the JSON `entry.*` keys** (or rename Friendly IDs) so they match — otherwise ZMP gets empty values.

Grow docs for the push path: [Different Ways to Export Entry Data](https://products.zetaglobal.com/grow/Content/Grow/Post-launch%20Success/Understanding-Different-ways-to-export-Entry-data.htm) (real-time HTTP webhook / custom data integration) and [Entry Data Webhook](https://products.zetaglobal.com/grow/Content/Technical%20Documentation/Understanding-Entry-Data-Webhook.htm). Account setup: Gear → Integrations → HTTP / custom integration ([Third Party Integrations](https://products.zetaglobal.com/grow/Content/Third%20Party%20Integrations/Third-Party-Integrations-Intro.htm)).

---
---

## Current PushPlanet integration (`reference/pushplanet-9958-desktop.js`)

Preference center for SEI Soccer. Hardcoded PushPlanet / Zeta client ids:

| Constant | Value | Role |
| --- | --- | --- |
| `site_id` | `sei-soccer-com` | ZMP site; loads `cdn.boomtrain.com/p13n/{site_id}/p13n.min.js` |
| `pp_int_id` | `3392` | PushPlanet integration id |
| `pp_guid` | `96ae1b07c23f453c9233a3a6ff633106` | PushPlanet / Zeta client guid |

### Prefill (read path)

- URL params: `encbu` (base64 uid), `ence` (base64 email), `eid`
- Profile/prefs come from `btSubscriberJson` (ZMP p13n payload): match email in `contacts`, then set checkboxes from `properties.pref_center_*` (`Y` / not)

Preference property keys used today:

**Identity / who**

- `pref_center_parent`
- `pref_center_coach_admin`
- `pref_center_player`
- `pref_center_fan`

**Product interest**

- `pref_center_cleats_and_shoes`
- `pref_center_fan_jerseys_and_gear`
- `pref_center_apparel`
- `pref_center_soccer_balls_and_equipment`
- `pref_center_goalkeeper`

**Content / offers**

- `pref_center_new_content_and_articles`
- `pref_center_deals_and_special_offers`

Values are stored as `"Y"` / `"N"` strings (not booleans).

### Submit (write path)

On `#submit`:

1. Client validation: first name, last name, DOB required; must be 12+.
2. Build `user_json` and call `updateSubscriber`.
3. Build `user_event_json` (`event: "preference_center"`) and call `zetaTrackEvent`.
4. Show success UI.

#### Payload A — update subscriber (→ Identify)

Approximate shape built in the script today:

```json
{
  "uid": "<from encbu>",
  "properties": {
    "first_name": "...",
    "last_name": "...",
    "date_of_birth": "...",
    "email": "..."
  },
  "contacts": [
    {
      "contact_type": "email",
      "contact_value": "<uid>",
      "subscription_status": "active",
      "contact_properties": {}
    }
  ],
  "pref_center_parent": "Y",
  "pref_center_coach_admin": "N",
  "pref_center_player": "N",
  "pref_center_fan": "Y",
  "pref_center_cleats_and_shoes": "Y",
  "pref_center_fan_jerseys_and_gear": "N",
  "pref_center_apparel": "Y",
  "pref_center_soccer_balls_and_equipment": "N",
  "pref_center_goalkeeper": "N",
  "pref_center_new_content_and_articles": "Y",
  "pref_center_deals_and_special_offers": "N"
}
```

**Migration watch-outs** (script quirks to decide on when building Grow JSON):

- Pref flags are set on the **root** of `user_json`, not nested under `properties`. Official Identify docs nest custom attrs under `subscriber.properties`. Confirm with ZMP whether PushPlanet’s helper rewrites the payload, or whether Grow should nest under `properties`.
- `contacts[].contact_value` is set to `uid`, not the email string. Verify intended ZMP identity model before copying blindly.
- Official Identify wraps the person under `"subscriber": { ... }`. Grow may need that wrapper even if PushPlanet’s helper accepted a flatter object.
- Checkbox → ZMP mapping uses `"Y"`/`"N"`; Grow should keep that unless product asks to change it.

#### Payload B — track event (→ Activities)

```json
{
  "activity": {
    "subscriber": {
      "uid": "<same uid>"
    },
    "event": "preference_center",
    "properties": {
      "subscription_status": "active",
      "first_name": "...",
      "last_name": "...",
      "date_of_birth": "...",
      "email": "...",
      "pref_center_parent": "Y",
      "pref_center_coach_admin": "N",
      "pref_center_player": "N",
      "pref_center_fan": "Y",
      "pref_center_cleats_and_shoes": "Y",
      "pref_center_apparel": "Y",
      "pref_center_soccer_balls_and_equipment": "N",
      "pref_center_goalkeeper": "N",
      "pref_center_new_content_and_articles": "Y",
      "pref_center_deals_and_special_offers": "N"
    }
  }
}
```

Note: `pref_center_fan_jerseys_and_gear` is updated on the subscriber object but is inconsistently included on the event properties in the current script when checked — worth aligning in the Grow version.

### Grow implications (two calls)

Grow’s JSON help describes **one** HTTP integration config per destination. To match PushPlanet’s sequence (identify, then track event), we likely need **two** Grow integrations on the same experience/entry:

1. Identify → `POST .../subscribers/identify`
2. Activity → `POST .../activities` with `event: preference_center`

Or one call if product accepts only profile update *or* only the event — current PushPlanet does both.

---

---

## Official Grow On-Load integration help (product docs)

Source: Grow **On-Load integration help** (in-product). Summary and implications for SEI.

### Idea

Avoid re-asking the user for data the brand already has. Two options:

1. **Encrypting data** — put everything in query param **`nc.ol`**; On Load decrypts with `encryptionKey`.
2. **Third-party fetch** — still encrypt a small JSON in `nc.ol` (e.g. `{ "userId": "…" }`), then `http$` to an external URL using `${encryptedTokenMapping.userId}`, then `return$` from `executionResults`.

### Documented encrypt-only shape

```json
{
  "encryptionKey": "PLACEHOLDER_ENCRYPTION_KEY",
  "logDebug": false,
  "onlySubSteps": true,
  "subSteps": [
    {
      "return$": {
        "data": {
          "brand_opt_in": "${encryptedTokenMapping.brandOptIn}"
        },
        "piidata": {
          "email": "${encryptedTokenMapping.email}",
          "name_Firstname": "${encryptedTokenMapping.firstName}",
          "name_Lastname": "${encryptedTokenMapping.lastName}"
        }
      }
    }
  ]
}
```

- **`encryptionKey`** — key used to encrypt the JSON payload (CSM can detail the encrypt steps).
- **`return$.data`** — fields to prepopulate (user may change them).
- **`return$.piidata`** — PII kept hidden / not shown again.
- Load the Experience with **`nc.ol=<encrypted value>`** (must use `nc.` so On Load fires).

Example plaintext JSON before encrypt:

```json
{
  "firstName": "John",
  "lastName": "Smith",
  "email": "jsmith@zetaglobal.com",
  "brandOptIn": true
}
```

### Documented encrypt + third-party `http$`

First subStep: `http$` GET to a third party with `queryParams$` from `encryptedTokenMapping.*`. Second: `return$` from `executionResults.json.*`. `nc.ol` still holds the encrypted seed JSON (e.g. `{ "userId": "…" }`).

### Why our first SEI On Load failed (re-check)

We built the first SEI On Load (now [`reference/onload-dual-token-groovy.json`](../clients/SEI-Soccer-9958/22815/reference/onload-dual-token-groovy.json)) like a **custom** migration: `nc.ol_tok` / `nc.ol_tok2` + Groovy `eval$` decrypt + `params.ol_tok`. Staging then called Grow’s runner and got:

`POST /api/integration/d/onload` → **503** — `Failed to make onload integration request!`

Mismatch vs these docs:

| Docs (official) | What we did |
| --- | --- |
| One param **`nc.ol`** | **`nc.ol_tok` + `nc.ol_tok2`** |
| Grow decrypts via **`encryptionKey`** → **`encryptedTokenMapping.*`** | Hand-rolled URL-decode / Base64 / IV / `EncryptUtils` in `eval$` |
| Simple `return$` only (optional `http$`) | Four custom `eval$` steps |
| Staging URL `&nc.ol=…` | Also had a typo **`&?nc.ol_tok=`** (extra `?`) |

Likely 503 cause: with `encryptionKey` set, Grow expects a valid **`nc.ol`** blob. We never sent `nc.ol`, so built-in decrypt/mapping can fail hard before (or instead of) our Groovy path. Custom `eval$` decrypt is also outside the documented contract and can crash the runner.

**Current SEI path:** official [`22815/onload.json`](../clients/SEI-Soccer-9958/22815/onload.json) with `nc.ol`. Retest on staging after rotating the key. The browser-decrypt workaround was removed because it exposed the key.

---

## SEI ZMP site and Grow JSON stubs

ZMP `site_id` for SEI is `sei-soccer-com` (also used when loading `p13n.min.js`).

Live draft configs: [`templates/identify.json`](../clients/SEI-Soccer-9958/templates/identify.json), [`templates/activity.json`](../clients/SEI-Soccer-9958/templates/activity.json).

### Suggested Grow stubs for ZMP (to flesh out next)

Identify integration sketch (values TBD / secrets not committed):

```json
{
  "url": "https://api.zetaglobal.net/ver2/sei-soccer-com/subscribers/identify",
  "stageUrl": "https://api.zetaglobal.net/ver2/sei-soccer-com/subscribers/identify",
  "requestType": "json",
  "verb": "post",
  "paramsType": "mapped",
  "formatType": "structured",
  "ignoreEmpty": true,
  "nullHandling": "omit",
  "required": ["email"],
  "header": {
    "Authorization": "Basic REPLACE_ME",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  "params": {
    "subscriber": {
      "uid": "${entry.uid ?: entry.email}",
      "properties": {
        "first_name": "${entry.first_name ?: ''}",
        "last_name": "${entry.last_name ?: ''}",
        "date_of_birth": "${entry.date_of_birth ?: ''}",
        "email": "${entry.email ?: ''}",
        "pref_center_parent": "${entry.pref_center_parent ?: 'N'}",
        "pref_center_coach_admin": "${entry.pref_center_coach_admin ?: 'N'}",
        "pref_center_player": "${entry.pref_center_player ?: 'N'}",
        "pref_center_fan": "${entry.pref_center_fan ?: 'N'}",
        "pref_center_cleats_and_shoes": "${entry.pref_center_cleats_and_shoes ?: 'N'}",
        "pref_center_fan_jerseys_and_gear": "${entry.pref_center_fan_jerseys_and_gear ?: 'N'}",
        "pref_center_apparel": "${entry.pref_center_apparel ?: 'N'}",
        "pref_center_soccer_balls_and_equipment": "${entry.pref_center_soccer_balls_and_equipment ?: 'N'}",
        "pref_center_goalkeeper": "${entry.pref_center_goalkeeper ?: 'N'}",
        "pref_center_new_content_and_articles": "${entry.pref_center_new_content_and_articles ?: 'N'}",
        "pref_center_deals_and_special_offers": "${entry.pref_center_deals_and_special_offers ?: 'N'}"
      },
      "contacts": [
        {
          "contact_type": "email",
          "contact_value": "${entry.email}",
          "subscription_status": "active"
        }
      ],
      "source": "grow"
    }
  }
}
```

Activity integration sketch:

```json
{
  "url": "https://api.zetaglobal.net/ver2/sei-soccer-com/activities",
  "stageUrl": "https://api.zetaglobal.net/ver2/sei-soccer-com/activities",
  "requestType": "json",
  "verb": "post",
  "paramsType": "mapped",
  "formatType": "structured",
  "ignoreEmpty": true,
  "nullHandling": "omit",
  "required": ["email"],
  "header": {
    "Authorization": "Basic REPLACE_ME",
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  "params": {
    "activity": {
      "subscriber": {
        "uid": "${entry.uid ?: entry.email}"
      },
      "event": "preference_center",
      "properties": {
        "subscription_status": "active",
        "first_name": "${entry.first_name ?: ''}",
        "last_name": "${entry.last_name ?: ''}",
        "date_of_birth": "${entry.date_of_birth ?: ''}",
        "email": "${entry.email ?: ''}",
        "pref_center_parent": "${entry.pref_center_parent ?: 'N'}",
        "pref_center_coach_admin": "${entry.pref_center_coach_admin ?: 'N'}",
        "pref_center_player": "${entry.pref_center_player ?: 'N'}",
        "pref_center_fan": "${entry.pref_center_fan ?: 'N'}",
        "pref_center_cleats_and_shoes": "${entry.pref_center_cleats_and_shoes ?: 'N'}",
        "pref_center_fan_jerseys_and_gear": "${entry.pref_center_fan_jerseys_and_gear ?: 'N'}",
        "pref_center_apparel": "${entry.pref_center_apparel ?: 'N'}",
        "pref_center_soccer_balls_and_equipment": "${entry.pref_center_soccer_balls_and_equipment ?: 'N'}",
        "pref_center_goalkeeper": "${entry.pref_center_goalkeeper ?: 'N'}",
        "pref_center_new_content_and_articles": "${entry.pref_center_new_content_and_articles ?: 'N'}",
        "pref_center_deals_and_special_offers": "${entry.pref_center_deals_and_special_offers ?: 'N'}"
      }
    }
  }
}
```

Entry field names above assume Grow form fields mirror the pref keys; adjust mappings to whatever Digioh/Grow field names actually are.

### Reference: working ZMP Identify (unsubscribe) — another Grow account

Sanitized copy of a **live** HTTP entry integration (Sallie Mae SOSL **dev**). Auth token replaced with `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`. Do not commit real Basic credentials.

What it confirms for SEI:

| Point | Detail |
| --- | --- |
| Auth | Basic header on the integration JSON (`api` + REST key) |
| `uid` | From form/On Load: `${params.uid}` |
| Email contact | `${entry.email}` as `contact_value` |
| Unsubscribe | `subscription_status: "inactive"` on the email contact |
| `executeIf` | Works on this **flat** integration (no `onlySubSteps`): only when `params.unsubscribe` is `op1` or `op2` |
| Guards | `required: ["email"]`, `ignoreEmpty: true`, `nullHandling: "omit"`, `logDebug: true` |

Watch: this payload nests `contacts` under `subscriber.properties`. Official ZMP Identify usually puts `contacts` as a **sibling** of `properties`. Keep as-is if you clone a known-good unsub; for SEI prefs identify, prefer the sibling shape in the stubs above unless ZMP confirms otherwise.

```json
{
  "dateFormat": "yyyy-MM-dd'T'HH:mm:ss'Z'",
  "sendEntitlements": true,
  "executeIf": "${['op1', 'op2'].contains(params?.unsubscribe)}",
  "dontSendIfEmptyList": [],
  "required": ["email"],
  "paramPrefix": "",
  "orMandatory": [],
  "caseInsensitiveParams": [],
  "ignoreEmpty": true,
  "formatType": "mapped",
  "formPostParamForJSON": "json",
  "snakeExceptions": [],
  "nullHandling": "omit",
  "requestType": "json",
  "verb": "post",
  "verifyHost": true,
  "trustAll": false,
  "sendAsNumber": [],
  "logDebug": true,
  "params": {
    "subscriber": {
      "uid": "${params.uid?:''}",
      "properties": {
        "contacts": [
          {
            "contact_type": "email",
            "subscription_status": "inactive",
            "contact_value": "${entry.email?:''}"
          }
        ]
      }
    }
  },
  "encoding": "UTF-8",
  "sendAsBoolean": [],
  "avoidInParamsMap": [],
  "url": "https://api.zetaglobal.net/ver2/salliemae-sosl-dev/subscribers/identify",
  "paramsType": "all",
  "useContainerRef": false,
  "searchForParamsMapKeyword": false,
  "header": {
    "Authorization": "Basic REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)",
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  "useSnakeFormat": false,
  "bindUrl": false,
  "prefixExceptions": []
}
```

For SEI, swap `url` / `site_id` to `sei-soccer-com` (and staging twin if needed), drop or rewrite `executeIf` for preference-center submit, and map prefs under `subscriber.properties` as in the stubs above.


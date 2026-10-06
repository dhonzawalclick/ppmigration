# PushPlanet / Digioh → Zeta Grow migration

This repo tracks migrating preference-center (and related) experiences from **PushPlanet** and **Digioh** into **Zeta Grow**, while keeping the same downstream writes into **ZMP** (Zeta Marketing Platform).

## Current state

| Piece | Location / notes |
| --- | --- |
| Grow → 3rd-party JSON integration reference | This file (section below) — how Grow posts entry data to external APIs |
| Existing PushPlanet preference-center script | [`SEI/9958-desktop.js`](../SEI/9958-desktop.js) — SEI Soccer desktop preference center |
| Grow Experience (staging) | Campaign **22815** — Customize CSS/JS for the preference-center form |
| Grow Custom CSS | [`SEI/9958-grow-theme-fix.css`](../SEI/9958-grow-theme-fix.css) — paste into Customize → Custom Styles |
| Grow Custom JS (`fromOnLoad` gate) | [`SEI/9958-grow-fromonload-gate.js`](../SEI/9958-grow-fromonload-gate.js) — paste into Customize → Custom JavaScript (**keep `<script>` tags**) |
| Grow → ZMP identify config | [`SEI/9958-grow-zmp-identify.json`](../SEI/9958-grow-zmp-identify.json) — replaces `updateSubscriber` |
| Grow → ZMP activity config | [`SEI/9958-grow-zmp-activity.json`](../SEI/9958-grow-zmp-activity.json) — replaces `zetaTrackEvent` (`preference_center`) |
| Downstream CDP / ESP | ZMP REST API (`https://api.zetaglobal.net/ver2`) |

PushPlanet already talks to ZMP (via Boomtrain / Zeta client helpers). Grow will replace the PushPlanet/Digioh experience layer; **Grow must call the same ZMP endpoints** (or equivalent) so profiles and preference events continue to land in ZMP.

Draft identify/activity JSON configs live under `SEI/`; Friendly IDs on the Grow form must match the `entry.*` keys those configs use (see below).

---

## Architecture (as-is vs target)

```
AS-IS
  Digioh / PushPlanet experience
       │
       ├─ load ZMP p13n.js (site_id)
       ├─ read btSubscriberJson (prefill prefs)
       └─ on submit:
            updateSubscriber(...)  → ZMP identify / update person
            zetaTrackEvent(...)    → ZMP track activity/event

TARGET
  Zeta Grow experience
       │
       ├─ Form modules (Email, Name, checkboxes, Policy…) collect answers
       ├─ Each module’s Friendly ID becomes a key on the Grow entry
       └─ On submit → HTTP / Other Data Integration (JSON config)
            reads ${entry.<friendly_id>} …
            POST identify  → …/subscribers/identify
            POST activity   → …/activities
```

Grow’s JSON integration model (url, verb, headers, params mappings) is documented in **Grow JSON integration reference** below. That is the mechanism we will use to hit ZMP.

---

## How form fields relate to the Grow → ZMP JSON configs

These are **not** two separate systems. The form is the **input**; the JSON configs are the **outbound mapping** that runs after submit.

| Layer | What it is | Role |
| --- | --- | --- |
| Grow form modules | UI on the Experience (Email, Name, Multi Opt-in, Policy & Rules, …) | Collect answers from the participant |
| Friendly ID | Set on a module under **Connect** (spaces → underscores) | Stable key for that answer when syncing to ESP/CRM/CDP |
| Grow **entry** | Record created on submit | Holds standard fields + every Friendly ID as properties |
| Integration JSON | Account **HTTP / Other Data Integration** config ([`9958-grow-zmp-identify.json`](../SEI/9958-grow-zmp-identify.json), [`9958-grow-zmp-activity.json`](../SEI/9958-grow-zmp-activity.json)) | Maps `entry` → ZMP request body and POSTs it |

Flow:

```
Participant fills form
        ↓
Grow saves an entry  (email, first_name, parent, … keyed by Friendly ID / standard names)
        ↓
Integration fires (paramsType: mapped)
        ↓
"${entry.email}" / "${entry.parent}" / … → ZMP JSON payload
        ↓
POST api.zetaglobal.net/ver2/{site_id}/subscribers/identify
POST api.zetaglobal.net/ver2/{site_id}/activities
```

### What must match

In the JSON, expressions like `${entry.email}` and `${entry.parent}` only work if the Grow form exposes those keys on the entry:

1. Add the module on the form (e.g. Email, checkbox / Multi Opt-in for prefs).
2. Set **Friendly ID** to the same name the JSON expects (`email`, `parent`, `cleats_and_shoes`, …) — or change the JSON to match whatever Friendly ID you choose.
3. Submit → Grow builds `entry` → integration substitutes the values.

Built-in / common entry fields (also used in exports and email tokens) include things like email, first/last name, brand/group/third-party opt-ins, terms, `uid` / Customer ID — see [Experience Exports](https://products.zetaglobal.com/grow/Content/Grow/Post-launch%20Success/Understanding-Experience-exports.htm) and [Email Notification Tokens](https://products.zetaglobal.com/grow/Content/Grow/Email%20Notifications/Understanding-Email-Notification-Tokens.htm) (`${form.email}`, `${entry.uid}`, …). Custom quiz/checkbox answers show up as their own columns / entry keys via Friendly ID ([Opt-In → Connect](https://products.zetaglobal.com/grow/Content/Grow/Understanding%20Pages%20and%20Modules/Module-Optin.htm)).

**Customer ID** (Form Settings → Advanced) is Grow’s unique person key for the Experience (default: email). That can feed `entry.uid` / ZMP `subscriber.uid` if you map it that way ([Change Your Unique Customer ID](https://products.zetaglobal.com/grow/Content/Grow/General%20Other%20Tasks/Change-your-unique-Customer-ID.htm)).

### What the JSON does *not* do

- It does **not** render the form or set Friendly IDs — that is Page Builder work.
- It does **not** replace Policy & Rules / Opt-In UI; those modules only become data (`terms`, opt-in flags, etc.) once submitted.
- Prefill / hide-submit JS (`fromOnLoad`, decrypt `ol_tok`) runs **before** submit; the integration JSON runs **after** submit.

---

## SEI Grow Experience Customize (campaign 22815)

Staging preference-center form. Assets below are the source of truth; paste into **Customize** on the Experience, then **Apply / Save & Close**, then experience **Save**.

| Slot | Repo file | Notes |
| --- | --- | --- |
| Custom Styles | [`SEI/9958-grow-theme-fix.css`](../SEI/9958-grow-theme-fix.css) | Layout, centered placeholders, name/email/DOB polish. Keeps Month dropdown working (no DOB overflow/padding overrides). |
| Custom JavaScript | [`SEI/9958-grow-fromonload-gate.js`](../SEI/9958-grow-fromonload-gate.js) | Hides T&C + Sign up when `fromOnLoad` is False. |

Scripting Guide (account): `/admin/campaign/scripthelpmicro` — Custom JS **must** include opening/closing `<script>` tags or Grow dumps the source as page text. Prefer `NGX.api` over raw DOM mutation for system modules (Preact re-renders wipe plain class/style changes).

### `fromOnLoad` gate

`fromOnLoad` is a radio module (`true` / `false`) used as a staging/prod gate (not an end-user preference).

| Value | Grow conditionals (name, email, DOB, multi opt-ins) | T&C + Sign up |
| --- | --- | --- |
| **True** | Shown | Shown |
| **False** | Hidden by Grow module conditionals | Hidden by Custom JS (`sei-hide-cta`) |

Policy and submit modules are **not** conditional in Page Builder, so Custom JS covers them:

1. On `page:ready`, read `input[name="fromOnLoad"]:checked`.
2. If False → `NGX.api('module:add:custom:classes', { id, customClassNames: 'sei-hide-cta' })` on `policy_1790353974879` and `submit_1684917530454`.
3. If True → `module:remove:custom:classes` for the same.
4. Re-run on `module:component:didupdate` for the radio module and on `change` for `fromOnLoad`.

Companion CSS (in the theme file) hides `.xCustomClass-sei-hide-cta` on those module IDs so the class wins over the “keep T&C + submit visible” rules and survives re-renders.

In production, set `fromOnLoad` via onload/integration JS and hide the True/False radio UI itself when you no longer need the staging toggle.

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

## ZMP API context (what we must replicate)

Source: [Getting Started with Zeta APIs](https://docs.zetaglobal.com/reference/getting-started)

### Base URL

`https://api.zetaglobal.net/ver2/{site_id}/...`

For the SEI script, `site_id` is `sei-soccer-com` (also used when loading `p13n.min.js`).

### Auth

Default ZMP REST auth is **HTTP Basic**:

| Part | Value |
| --- | --- |
| Username | `api` |
| Password | 32-char REST API key from ZMP → Settings → Integrations → Keys & Apps |

In Grow JSON, that becomes a header like:

```json
"header": {
  "Authorization": "Basic <base64(api:REST_API_KEY)>",
  "Content-Type": "application/json",
  "Accept": "application/json"
}
```

JWT / bearer auth also exists on ZMP but SSI-style JWT is a separate path; for Grow → ZMP parity with the current PushPlanet flow, **Basic + REST API key** is the matching pattern.

### Compatibility note (from Zeta)

ZMP may add response fields without a version bump. Do not reject unknown fields; validate only what Grow depends on.

### Endpoints we care about for this migration

#### 1. Identify / update person

- Docs: [Identify a Person](https://docs.zetaglobal.com/reference/identify-a-user)
- `POST /{site_id}/subscribers/identify`
- Creates or updates a person by `subscriber.uid`
- Body shape (conceptual):

```json
{
  "subscriber": {
    "uid": "<unique person id>",
    "first_name": "...",
    "last_name": "...",
    "properties": {
      "date_of_birth": "...",
      "email": "...",
      "pref_center_parent": "Y",
      "pref_center_coach_admin": "N"
    },
    "contacts": [
      {
        "contact_type": "email",
        "contact_value": "user@example.com",
        "subscription_status": "active"
      }
    ],
    "source": "api"
  }
}
```

Notes from ZMP:

- `uid` should be your durable unique id (email, phone, or system id).
- `contact_type`: `email` or `phone` (E.164 with `+` for phone).
- `subscription_status`: use `inactive` to unsubscribe a contact; defaults to `active`.
- Property keys are conventionally `lower_snake_case`.

This is what PushPlanet’s `window.updateSubscriber(pp_guid, pp_int_id, user_json, cb)` ultimately drives.

#### 2. Track an event / activity

- Docs: [Track an Event](https://docs.zetaglobal.com/reference/track-an-event-rest)
- `POST /{site_id}/activities`
- Body shape:

```json
{
  "activity": {
    "subscriber": {
      "uid": "<same uid as identify>"
    },
    "event": "preference_center",
    "timestamp": "2015-07-15T19:30:00Z",
    "properties": {
      "first_name": "...",
      "pref_center_parent": "Y"
    }
  }
}
```

Rate limit (default): ~50k/min shared across parent/child accounts; `429` when exceeded.

This is what PushPlanet’s `window.zetaTrackEvent(pp_guid, pp_int_id, user_event_json, cb)` ultimately drives.

---

## Current PushPlanet integration (`SEI/9958-desktop.js`)

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

## Grow JSON integration reference

The JSON defines the integration method, destination, format and mapping through the following settings:

url: This is the endpoint that will be called, where the data will be sent to. Please, make sure that it is provided as https:// for security reasons.
stageUrl: same as the url parameter but when previewing the experience using the staging url.
bindUrl: true|false (default). Allows us to add bindings to the url directly, in the same way as we can do in params (see params section). If you are not doing field mappings, leave as false to save resources.
requestType: json (default) | querystring | formpost. This is the way the data will be sent. If JSON, we will send as a JSON Map payload, if querystring, it will be converted into query string parameters. If formpost it will do a form post with the data parameters.
verb: post | put | get. Defines the type of HTTP call we are going to do. This affects how the data is sent. If get is selected, the data will be sent as querystring, if set as JSON in requestType, the data will be sent as a JSON querystring parameter, urlencoded. For put and post, if JSON is selected, it will be sent in the payload as json, or if formpost is used, it will be a urlencoded form post. You can also select querystring for post or put, we know this is not usual, but some customers needed this behaviour so it is available.
paramsType: mapped (default) | all. Determines if we send the default JSON format payload (similar to the data exported for an entry, but in JSON format) plus mapped ones or just mapped (see params below).
formatType: structured (default) | flat. Allows to easily add properties to nested maps (for instance in the default JSON) in the mapping. If you add "data.prop1” with formatType:structured, then the payload will have prop1 inside a map called data. You can of course create the data map in the params section, but this is just a simpler way to achieve it.
sendEntitlements: true | false (default). This allows us to send the entitlements (rewards) linked to this entry in the JSON default payload. It is optional, but it is better to set it to true, as we get the reward info and it can be used to trigger actions.
required: A list of string names for fields in the form that must have a value in order for the integration to send the data. For instance, the customer may not want the data if there is no email in it, so if we set it as "required”: ["email”] if there is no email in the form post data on entry time, it will skip this entry.
orMandatory: Similar to the required one, but it is enough that one of the fields in the list has a value to send the data. This is useful, for instance, when the customer wants to only send the data if at least one opt in was set, so we can add "orMandatory”: ["brand_opt_in”, "group_opt_in”, "third_party_opt_in”] and if none of them is set it will skip, but just if one of them is set, then it will send the data.
caseInsensitiveParams: It allows us to specify a list of params that we want to treat as case insensitive params.If we have, for instance, "home”, it does not matter if the field in the form is "Home”, "home” or "HOME”, it will be taken as "home” as used as that in the mappings.
encoding: It is the encoding to use in the http call. Never had to use anything other than "UTF-8”.
ignoreEmpty: true | false. Specifies if we want to ignore empty fields in the payload, and remove from it. So if true, any empty fields in the payload will be removed. It is typical to remove on updatable registers, this is, when a second call with the same email will update the registry, for instance, as we do not want to send those fields not in the form as empty, and remove them on update.
nullHandling: omit (default) | include. Decides if we want to include or omit null values from the payload. Similar to ignoreEmpty but specific for null values. We may want to omit null but send empty, that’s why they are separated. It is typical to remove on updatable registers, this is, when a second call with the same email will update the registry, for instance, as we do not want to send those fields not in the form as empty, and remove them on update.
dontSendIfEmptyList: Related with above, this allows us to specify a list of parameters we do not want to send if they are empty, but all the others would be sent (if the above ignoreEmpty and nullHandling allows it).
sendAsBoolean: A list of fields we want to send as pure json boolean, true instead of "true”. Some third party systems won't accept the string "true” as boolean.
sendAsNumber: A list of fields we want to send as pure json numbers, 2 instead of "2”. Some third party systems won't accept the string "2” as a number.
"verifyHost": true. Please do not change this by yourself, always consult the Engineering Team as it has some serious security implications.
"trustAll": false. Please do not change this by yourself, always consult the Engineering Team as it has some serious security implications.
useContainerRef: true | false. DEPRECATED use experience metadata instead (this one allowed to use the old external ref console extension, now replaced by experience metadata which is directly usable).
searchForParamsMapKeyword: true | false. This one allows to specify a keyword in the params mappings that will result in a map with all the entry form post parameters being added.
The placeholder is "${wynParamsMap}", so if we have:

"params": {
  "remoteFieldName1": "${entry.email}",
  "formData":         "${wynParamsMap}"
}
Once this mapping is processed with searchForParamsMapKeyword:true we would have something like:

"params” : {
  "remoteFieldName1” : "onemail@cheetahdigital.com”,
  "formData” : {
    "email” : "onemail@cheetahdigital.com”,
    "firstname” : "Joe”,
    "lastname” : "Doe”,
    "country” : "USA”
    ...
  }
}
Inside formData we would have all the fields sent in the form post.

avoidInParamsMap: Related with the above one, this allows to specify a list of parameters that we do not want to be added to the automatic map.
In the example above as we are already sending remoteFieldName1 with the email, we may not want to send the email again in the formData map, so we can set avoidInParamsMap:["email"] so it is not added to the final map:

"params” : {
"remoteFieldName1” : "onemail@cheetahdigital.com”,
  "formData” : {
    "firstname” : "Joe”,
    "lastname” : "Doe”,
    "country” : "USA”
    ...
  }
}
formPostParamForJSON: This specifies the name of the json payload when the requestType formpost but we want to send it as a JSON parameter (the JSON string will be sent as this parameter).
paramPrefix: If this has a value, it will be used to prefix all the properties in the map, it goes inside submaps also.
prefixExceptions: You can specify a list of param names that you do not want to be prefixed, only for the name of the param.
useSnakeFormat: true | false, if true, all the parameters in the payload will be changed into snake format (i.e: useSnakeFormat -> use_snake_format). Only for the name of the param.
snakeExceptions: Specify a list of parameters that won't be converted into snake format
dateFormat: "yyyy-MM-dd'T'HH:mm:ss'Z'" You can specify the event date format in the default JSON payload.
sendAsArray: This is meant for JSON Post calls. In some cases, the remote endpoint requires a JSON Array, instead of the map directly, so setting this to true it will be sent that way.
params: Here is where you can map specific fields and properties to specific properties in the endpoint. This is a JSON map, this means it can contain properties: "propName" : [propValue] where [propValue] can be a String "some string", a number 2, a boolean true or false, another map or an array (a list) of properties [].
If the property is an string, it can also have what we call "a mapping”, which basically means a groovy script like ${[expression]} like "propName” : "${entry.email ?: ''}" which means, "if the Entry has an email address, then use it as value, if not, use empty string”. Here we are getting objects from entry, but there are other objects where we can get properties from:

entry
campaign
account
params
experienceMetadata
entry.config
header: Header is similar to the params map, but instead of using it for the body it is used to set the headers that will be set in the HTTP call. The same mappings can be used here, with account, campaign, entry, params and experienceMetadata.
"header” : {
  "Authorization” : "asajdpweijfwekfwelk”,
  "X-ACTION-ID” : "${experienceMetadata.actionId ?: ''}"
}
In this case it must only have root properties and must be valid headers.

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

---

## Open questions before writing production Grow JSON

1. Confirm ZMP REST API key placement (Grow account secrets / experience metadata vs hardcoded Basic header).
2. Confirm whether prefs must live under `subscriber.properties` (ZMP docs) vs root (current PushPlanet helper payload).
3. Confirm `uid` strategy and whether `contact_value` should be email (recommended) vs uid (current script).
4. Prefill: does Grow need a separate ZMP GET (Look up person / Get contact record), or will Grow hold state only on submit?
5. Digioh experiences: same ZMP site/events, or different site_ids / event names?
6. Staging site_id / keys vs prod.

---

## Links

- [ZMP Getting Started](https://docs.zetaglobal.com/reference/getting-started)
- [Identify a Person](https://docs.zetaglobal.com/reference/identify-a-user)
- [Track an Event](https://docs.zetaglobal.com/reference/track-an-event-rest)
- [Track an Event with Contacts](https://docs.zetaglobal.com/reference/track-an-event-with-contacts) (signup / first-touch variant)
- [Get a Contact Record](https://docs.zetaglobal.com/reference/get-a-contact-record) (prefill / read path)

MANAGING INTEGRATIONS  
OTHER DATA INTEGRATIONS  
If you have any questions or need further, please feel free to contact Support or get in touch with your Customer Success Manager or Account Representative.

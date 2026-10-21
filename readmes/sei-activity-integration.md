# SEI activity integration (display 22904)

## What it is

An HTTP entry integration. Grow runs it on the server each time someone submits the form. It sends one request to ZMP that records a `preference_center` event and updates the person.

`identify_person: true` makes the same call create or update the subscriber, so no separate identify request is needed.

## Where it sends

| Mode | URL |
| --- | --- |
| Live | `POST https://api.zetaglobal.net/ver2/sei-soccer-com/activities` |
| Staging preview (`stageMode=true`) | `POST https://api.zetaglobal.net/ver2/sei-dev/activities` |

Auth is a ZMP Basic header, `Basic base64("api:<ZMP REST key>")`. The repo copy has a placeholder; the real header lives only in Grow and the gitignored `WIPactivity.json`.

## Settings that matter

| Setting | Effect |
| --- | --- |
| `required: ["email"]` | No email in the entry, no request. |
| `paramsType: mapped`, `formatType: structured` | The `params` object is sent as nested JSON. |
| `ignoreEmpty: true`, `nullHandling: omit` | Empty values are dropped instead of sent as `""` or `null`. |
| `logDebug: true` | Request and response show in Grow's integration log. |

## Payload

Shape only; `…` stands for the mapped fields below.

```text
{
  "activity": {
    "identify_person": true,
    "event": "preference_center",
    "subscriber": {
      "uid": "<email>",
      "first_name": "…", "last_name": "…", "source": "grow",
      "contacts": [{
        "contact_type": "email", "contact_value": "<email>", "subscription_status": "active"
      }],
      "properties": { "first_name", "last_name", "date_of_birth", "email", "pref_center_* …" }
    },
    "properties": { "source": "grow", "subscription_status": "active", "…same fields as above" }
  }
}
```

The person's fields go in `subscriber.properties`. The event gets a copy in `activity.properties`, so the submit is visible on the event too.

## Field mapping

| ZMP field | Form field |
| --- | --- |
| `uid`, email contact | `email` (falls back to `uid`) |
| `first_name` | `name_Firstname` |
| `last_name` | `name_Lastname` |
| `date_of_birth` | `date_of_birth` |
| `pref_center_parent`, `_coach_admin`, `_player`, `_fan` | `I_am_a` checkboxes |
| `pref_center_cleats_and_shoes`, `_fan_jerseys_and_gear`, `_apparel`, `_soccer_balls_and_equipment`, `_goalkeeper`, `_new_content_and_articles`, `_deals_and_special_offers` | `My_preferences` checkboxes |

Each preference flag is `Y` when its choice id is in the checked list and `N` otherwise:

```groovy
${((params.I_am_a ?: entry.I_am_a ?: '') as String).contains('parent') ? 'Y' : 'N'}
```

Every flag is always sent, so unchecking a box writes `N`.

## Things to watch

| Symptom | Cause |
| --- | --- |
| Every `pref_center_*` is `N` | The checkbox field names changed in Grow. The JSON must read `I_am_a` / `My_preferences`; it used to read `multioptin` / `multioptin_01`. |
| Name or DOB missing in ZMP | The form field was empty. Empty values are omitted, so ZMP keeps the old value. |
| Nothing reaches ZMP | No email in the entry (`required`), or the integration is not attached to this display. |
| Wrong site written | Staging previews post to `sei-dev`; live traffic posts to `sei-soccer-com`. |
| "Latest product drops" not saved | `latest_product_drops` has no ZMP property yet, so it is not mapped. |

## Checking a submit

Look the person up in ZMP and confirm `last_updated_source` is `grow` with a fresh `last_updated`:

```bash
curl -sS -H "Authorization: Basic <base64 api:key>" -H "Accept: application/json" \
  "https://api.zetaglobal.net/ver2/sei-dev/subscribers?uid=sei.dev.pc.003%40example.invalid"
```

# Account: SEI Soccer (PushPlanet 9952)

| Field | Value |
| --- | --- |
| Grow account name | SEI Soccer |
| PushPlanet experience | `9952` |
| Grow campaign id | `22913` |
| ZMP site_id | `sei-soccer-com` (staging: `sei-dev`) |

Sibling migration: [`SEI-Soccer-9958`](../SEI-Soccer-9958/) (prefs / campaign 22815). Shared sei-dev test users live there until this experience needs its own list.

## templates/

Experience-specific integrations (one file = one request). 9952 needs its own because of the dual CTA.

| File | Endpoint |
| --- | --- |
| [`activity-identify.json`](templates/activity-identify.json) | `POST /ver2/sei-soccer-com/activities` with `identify_person: true`; branches on `params.sei_action` |
| [`get-contact.json`](templates/get-contact.json) | `GET /ver2/sei-soccer-com/subscribers?uid=` |

Auth placeholder: `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`. Real Basic headers only in Grow / local WIP files — do not commit secrets.

## Campaigns

| Campaign | What |
| --- | --- |
| [`22913/`](22913/) | Grow campaign for PushPlanet experience **9952** |

## reference/

Drop originals (PushPlanet / Digioh script, samples, retired attempts) under [`22913/reference/`](22913/reference/).

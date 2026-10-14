# Account: SEI Soccer

| Field | Value |
| --- | --- |
| Grow account name | SEI Soccer |
| Grow account number | TBD (folder uses `9958`, the PushPlanet id, until confirmed) |
| ZMP site_id | `sei-soccer-com` |

Full migration notes: [`readmes/sei-pushplanet-grow-migration.md`](../../readmes/sei-pushplanet-grow-migration.md).

## templates/

HTTP entry integrations that fire on submit. One file is one request. Grow runs them independently, not in order.

| File | Endpoint | Status |
| --- | --- | --- |
| [`identify.json`](templates/identify.json) | `POST /ver2/sei-soccer-com/subscribers/identify` | `url` → ZMP; `stageUrl` → local ngrok request bin |
| [`activity.json`](templates/activity.json) | `POST /ver2/sei-soccer-com/activities`, event `preference_center` | `url` → ZMP; `stageUrl` → local ngrok request bin; payload mirrors PushPlanet `pref_center_*` Y/N flags |

Auth is Basic `api:<REST key>` per [ZMP Getting Started](https://docs.zetaglobal.com/reference/getting-started). The repo keeps `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`; paste the real header only in Grow.

For staging paste into campaign **22815**, use flat one-call configs (no `subSteps`): [`22815/WIPidentify.json`](22815/WIPidentify.json) and [`22815/WIPactivity.json`](22815/WIPactivity.json). Those WIP files may hold real Basic auth for Grow paste — do not commit them with secrets.

## Campaigns

| Campaign | What |
| --- | --- |
| [`22815/`](22815/) | Preference center (staging) |

## sei-dev test users

Only these people are valid for ZMP **`sei-dev`** staging checks: [`sei-dev-test-users.md`](sei-dev-test-users.md) + import CSV [`sei-dev-test-users.csv`](sei-dev-test-users.csv).

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
| [`identify.json`](templates/identify.json) | `POST /ver2/sei-soccer-com/subscribers/identify` | `url` and `stageUrl` both point at ZMP |
| [`activity.json`](templates/activity.json) | `POST /ver2/sei-soccer-com/activities`, event `preference_center` | `stageUrl` points at an oast.pro capture endpoint |

Both need the real Basic auth header in Grow. The repo keeps `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`.

## Campaigns

| Campaign | What |
| --- | --- |
| [`22815/`](22815/) | Preference center (staging) |

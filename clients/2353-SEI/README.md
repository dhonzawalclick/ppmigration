# Account: SEI (Sports Endeavors)

| Field | Value |
| --- | --- |
| Grow tenant id | `2353` |
| Grow account name | SEI (Sports Endeavors) |
| ZMP site_id | staging: `sei-dev`. Prod: the integrations use `sei-soccer-com`, but the prod REST key only authenticates on `sei` — confirm before go-live. |

Full migration notes: [`readmes/sei-pushplanet-grow-migration.md`](../../readmes/sei-pushplanet-grow-migration.md).

## Experiences

| Folder | PushPlanet | Grow campaign | What |
| --- | --- | --- | --- |
| [`SEI-Soccer-9958/`](SEI-Soccer-9958/) | `9958` | [`22815`](SEI-Soccer-9958/22815/) (display `22904`) | Preference center |
| [`SEI-Soccer-9952/`](SEI-Soccer-9952/) | `9952` | [`22913`](SEI-Soccer-9952/22913/) | Preferences + unsubscribe |

`unused-theme.css` is the earlier full theme, kept for reference. It is not pasted into Grow.

Submit integrations: 9958 uses the shared [`/templates/`](../../templates/); 9952 has its own in [`SEI-Soccer-9952/templates/`](SEI-Soccer-9952/templates/).

Auth is Basic `api:<REST key>`. The repo keeps `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`; real headers live only in Grow and the gitignored `WIP*.json` files.

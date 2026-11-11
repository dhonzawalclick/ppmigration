# Account: SEI (Sports Endeavors)

| Field | Value |
| --- | --- |
| Grow tenant id | `2353` |
| Grow account name | SEI (Sports Endeavors) |
| ZMP site_id | Testing: all integrations use `sei-dev` (read + write). The current REST key returns **401** on `sei-soccer-com` and `sei-soccer-com-dev`; Grow often shows that as a **503** on On Load. Prod target is `sei-soccer-com` with a prod key. |

Full migration notes: [`readmes/sei-pushplanet-grow-migration.md`](../../readmes/sei-pushplanet-grow-migration.md).

## Experiences

| Folder | PushPlanet | Grow campaign | What |
| --- | --- | --- | --- |
| [`SEI-Soccer-9958/`](SEI-Soccer-9958/) | `9958` | [`22815`](SEI-Soccer-9958/22815/) (display `22904`) | Preference center |
| [`SEI-Soccer-9952/`](SEI-Soccer-9952/) | `9952` | [`22913`](SEI-Soccer-9952/22913/) | Preferences + unsubscribe |
| [`SEI-431Sports-10031/`](SEI-431Sports-10031/) | `10031` (PP acct `829`) | _pending_ | 431 Sports prefs — ZMP site `sei-431sports` |
| [`SEI-WorldSoccerShop-10030/`](SEI-WorldSoccerShop-10030/) | `10030` (PP acct `830`) | _pending_ | World Soccer Shop prefs — capture in progress |

`unused-theme.css` is the earlier full theme, kept for reference. It is not pasted into Grow.

Submit integrations: 9958 uses the shared [`/templates/`](../../templates/); 9952 has its own in [`SEI-Soccer-9952/templates/`](SEI-Soccer-9952/templates/).

Auth is Basic `api:<REST key>`. The repo keeps `REPLACE_WITH_BASE64(api:ZMP_REST_API_KEY)`; real headers live only in Grow and the gitignored `WIP*.json` files.

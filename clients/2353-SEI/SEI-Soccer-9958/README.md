# Experience: SEI Soccer (PushPlanet 9958)

| Field | Value |
| --- | --- |
| PushPlanet experience | `9958` |
| Grow campaign id | `22815` |
| Grow display id | `22904` |
| ZMP site_id | staging: `sei-dev` (see the [account README](../README.md) for prod) |
| Staging preview | `https://us-displayx.wayin.com/preview/experience/4362b713-5988-4221-b9a3-13ea2e60e144/22904/details?stageMode=true&ptk=7ee526a35be6a749ee2ce60769b73d21` |

## Paste checklist (campaign `22815`)

| Grow UI | File |
| --- | --- |
| Customize → Custom CSS | [`22815/custom.css`](22815/custom.css) |
| Customize → Custom JavaScript | [`22815/custom.html`](22815/custom.html) (empty: the gate is CSS) |
| Integrations → On Load | `22815/WIPonload.json` (creds) / [`22815/onload.json`](22815/onload.json) (placeholders) |
| HTTP entry (submit) | `22815/WIPactivity.json` (creds) / [`/templates/activity.json`](../../../templates/activity.json) (placeholders) |

On Load decrypts `nc.ol_tok` / `nc.ol_tok2`, reads the person from `sei-dev`, and fills name, DOB, `I_am_a`, `My_preferences` (including `latest_product_drops`) and `fromOnLoad`. How it works and what breaks it: [`readmes/sei-onload-integration.md`](../../../readmes/sei-onload-integration.md). Submit mapping: [`readmes/sei-activity-integration.md`](../../../readmes/sei-activity-integration.md).

The Name module has no display condition; `custom.css` hides it until `fromOnLoad` is true. With a condition, On Load loses `name_Firstname`.

## sei-dev test users

Only these people are valid for ZMP `sei-dev` staging checks: [`sei-dev-test-users.md`](sei-dev-test-users.md) + import CSV [`sei-dev-test-users.csv`](sei-dev-test-users.csv).

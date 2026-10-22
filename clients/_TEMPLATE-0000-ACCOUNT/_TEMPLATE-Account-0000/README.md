# Experience: `_TEMPLATE-Account-0000`

Rename this folder to `{Account}-{PushPlanet experience id}` (e.g. `SEI-Soccer-9958`). One folder per migrated PushPlanet / Digioh experience.

| Field | Value |
| --- | --- |
| PushPlanet experience | |
| Grow campaign id | |
| ZMP site_id | prod: · staging: |

## Layout

- `{grow_campaign_id}/` — the Grow campaign for this experience (`custom.css`, `custom.html`, `onload.json`).
- `templates/` — only if this experience needs its own submit integrations (e.g. a dual CTA). Otherwise use the shared [`/templates/`](../../../templates/).
- Test users or other experience notes can sit here (e.g. `sei-dev-test-users.md`).

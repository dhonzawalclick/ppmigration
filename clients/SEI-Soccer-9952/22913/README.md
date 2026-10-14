# Campaign: `22913`

Grow campaign for SEI Soccer PushPlanet experience **9952**.

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | `custom.html` |
| Customize → Custom Styles | `theme.css` |
| Integrations → On Load | `WIPonload.json` (creds) / `onload.json` (placeholder) |
| HTTP entry (staging WIP) | `WIPactivity.json` / `WIPidentify.json` (add when ready) |

**On Load vs submit:** PushPlanet 9952 prefills from `btSubscriberJson` (person read). Grow On Load should **GET** `…/subscribers?uid=` (same REST Basic as 9958). Submit still uses identify / activities — not this On Load call. Set a real `encryptionKey` and pass `&nc.ol=` with `{ "uid", "email", "fromOnLoad" }`.

Account-level ZMP stubs: [`../templates/`](../templates/).

Put PushPlanet / Digioh originals and scratch samples in [`reference/`](reference/).

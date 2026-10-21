# Campaign: `22913`

Grow campaign for SEI Soccer PushPlanet experience **9952**.

## Paste checklist

| Grow UI | File |
| --- | --- |
| Customize → Custom JavaScript | `custom.html` |
| Customize → Custom Styles | `theme.css` |
| HTML module (unsub block) | `unsub.html` |
| Integrations → On Load | `WIPonload.json` (creds) / `onload.json` (placeholder) |
| HTTP entry (submit) | [`../templates/activity-identify.json`](../templates/activity-identify.json) — Track + Identify (`identify_person: true`); branches on `params.sei_action` |
| On Load ZMP read | [`../templates/get-contact.json`](../templates/get-contact.json) — embed as On Load `http$` (already in `onload.json`) |

**On Load vs submit:** PushPlanet 9952 prefills from `btSubscriberJson` (person read). Grow On Load should **GET** `…/subscribers?uid=` (same REST Basic as 9958). Submit still uses identify / activities — not this On Load call. Set a real `encryptionKey` and pass `&nc.ol=` with `{ "uid", "email", "fromOnLoad" }`.

### Dual CTA → `params.sei_action`

Shared form. Custom JS tags the submit:

| Button | `sei_action` | PushPlanet → ZMP |
| --- | --- | --- |
| Sign up | `preference_center` | `updateSubscriber` (prefs). PP had `zetaTrackEvent(preference_center)` commented out. |
| Unsubscribe | `unsubscribe` | `updateSubscriber` (contact `inactive`) + `zetaTrackEvent(event: "unsubscribe")` |

Flat entry integrations gate with `executeIf` on `params.sei_action` (see templates). Scripting notes: [`../../../readmes/grow-scripting-guide.md`](../../../readmes/grow-scripting-guide.md).

**Validation:** Grow still validates native required fields when the Sign up CTA is clicked for unsub. Prefer not marking name/DOB/T&C/prefs as required if unsub must work without filling them; enforce prefs rules in a `form:add:submitHandler` for the prefs path only.

Put PushPlanet / Digioh originals and scratch samples in [`reference/`](reference/).

# Building a Grow preference center

## 1. On Load

On Load runs once when the URL has any `nc.*` param. Grow POSTs `/api/integration/d/onload`. Official path: encrypt a JSON blob, pass as `nc.ol`, set `encryptionKey` on the integration; Grow decrypts into `encryptedTokenMapping.*`. Map via `return$.data` (editable prefill) and `return$.piidata` (hidden PII). Optional `http$` can call ZMP/third parties first. At least one `nc.` is required to fire. If server On Load fails (e.g. 503), Custom JS can decrypt `nc.ol_tok`/`nc.ol_tok2` (or `nc.ol`) into form fields instead—key then lives in page source.

**Checklist:** paste On Load JSON on the Experience → save → open staging with `&nc.ol=…` or dual tokens → Network tab `/onload` or `&debug=6`. Fix URL typos (`&?nc.…` breaks the param name).

## 3. ZMP integrations (on submit)

PushPlanet usually did two writes in sequence. Grow needs **two HTTP entry integrations**, one per URL. They fire independently. Grow does not chain the second call on the first response:

| Call | Endpoint | Role |
| --- | --- | --- |
| Identify | `POST …/ver2/{site_id}/subscribers/identify` | Upsert profile / prefs |
| Activity | `POST …/ver2/{site_id}/activities` | Event e.g. `preference_center` |

**Config habits that matter**

- `paramsType: "mapped"`, `ignoreEmpty: true`, `nullHandling: "omit"`.
- Auth: `Authorization: Basic …` (api key); do not commit real secrets.
- Map with `${entry.<friendly_id>}` — names must match the form (e.g. `firstname` vs `first_name`).
- Hide `uid` and `email` with CSS, not a display condition. `display: none` still posts. A closed display condition leaves the field off both `entry` and `params`.
- Checkbox → ZMP often wants `"Y"` / `"N"` strings, not booleans.
- `uid`: `${entry.uid ?: entry.email}` (or whatever the brand’s identity model is).
- `required: ["email"]` (or uid) so empty submits do not hit ZMP.
- Test with `stageUrl` → webhook/capture first; then point at ZMP.

See [`readme.md`](readme.md) for payload shapes and the Grow JSON field reference.

## 4. Email / entry links

- Prefer official **`nc.ol`** (one encrypted JSON) once CSM confirms encrypt format.
- Dual-token pattern used in some migrations: `nc.ol_tok` = AES(uid), `nc.ol_tok2` = AES(email); same AES key as On Load / Custom JS.
- Pipeline: encrypt → Base64 → URL-encode. Always use `&nc.…=` (never `&?nc.…=`).

## 5. Verify

| Step | What to check |
| --- | --- |
| Load with tokens | `fromOnLoad` true; email/uid filled; gated modules + Sign up visible |
| Load without tokens | Gate stays false; no useful form / CTA hidden |
| Submit | Entry has Friendly IDs; identify + activity fire; ZMP profile/event updated |
| Staging | `stageMode=true` + `ptk=…`; use `&debug=6` while debugging |

## Minimal build order

1. Form modules + Friendly IDs + `fromOnLoad` / `uid`  
2. Theme CSS + Custom JS (gate only, no AES key)  
3. On Load JSON (official `nc.ol` when possible)  
4. Identify + activity HTTP JSON  
5. Sample encrypted URL → staging pass → wire email template tokens  

# Building a Grow preference center

## 1. On Load

On Load runs once when a query param name starts with `nc.ol`. Grow POSTs `/api/integration/d/onload`. The ZMP person read that returned data on SEI 22904 is `onload-dual-token-zmp-get.json`: decrypt `nc.ol_tok` / `nc.ol_tok2` in `eval$`, GET `/ver2/{site}/subscribers?uid=` only when that uid exists, map the person in a later `eval$`, and `return$` copies `executionResults`. A GET that read `encryptedTokenMapping` from `nc.ol` returned `{}` on that campaign. `onload.json` is decrypt-only and does not call ZMP. Do not decrypt tokens in Custom JS.

**Checklist:** paste On Load JSON on the Experience → save → open staging with `&nc.ol_tok=…&nc.ol_tok2=…` → Network tab `/onload` or `&debug=6`. Fix URL typos (`&?nc.…` breaks the param name).

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

- ZMP person On Load: `nc.ol_tok` = AES(uid), `nc.ol_tok2` = AES(email). Same key as `encryptionKey` and the Groovy `keyBytes` string. AES-CBC, key = UTF-8 bytes of the hex string, 16-byte IV prepended, PKCS7, standard Base64, then URL-encode.
- Decrypt-only On Load, no ZMP call: one `nc.ol` JSON blob.
- Always use `&nc.…=` (never `&?nc.…=`).

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

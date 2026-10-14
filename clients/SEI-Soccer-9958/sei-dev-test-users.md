# SEI-dev preference-center test users

**These are the only people valid for Grow → ZMP (`sei-dev`) staging tests from now on.**  
Imported into `sei-dev` (CSV) — use these, not ad-hoc form emails or older deliverability accounts.

Import file: [`sei-dev-test-users.csv`](sei-dev-test-users.csv)

| # | `user_id` |
| --- | --- |
| 1 | `sei.dev.pc.001@example.invalid` |
| 2 | `sei.dev.pc.002@example.invalid` |
| 3 | `sei.dev.pc.003@example.invalid` |
| 4 | `sei.dev.pc.004@example.invalid` |
| 5 | `sei.dev.pc.005@example.invalid` |
| 6 | `sei.dev.pc.006@example.invalid` |
| 7 | `sei.dev.pc.007@example.invalid` |
| 8 | `sei.dev.pc.008@example.invalid` |

## How we use them

- **ZMP site:** `sei-dev`
- **Grow uid:** `${entry.uid ?: entry.email}` — put the `user_id` in the email field.
- **Prefill (no On Load):** `&nc.pf_email=<user_id>&nc.pf_fromOnLoad=true`
- **Preview base:**  
  `https://us-displayx.wayin.com/preview/experience/4362b713-5988-4221-b9a3-13ea2e60e144/22904/details?stageMode=true&ptk=7ee526a35be6a749ee2ce60769b73d21`

## Out of scope

`ctruitt@…`, `cgolla@…`, deliverability inboxes, and one-off submits (`mengano@…`, `fulano@…`, `fideos@…`, `test@a.b`, etc.).

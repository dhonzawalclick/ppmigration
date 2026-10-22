# Account: `_TEMPLATE-0000-ACCOUNT`

Rename this folder to `{grow_tenant_id}-{ACCOUNT}` (e.g. `2353-SEI`). The tenant id is in the experience page source: `'tenant': { 'id': 2353, … }`.

| Field | Value |
| --- | --- |
| Grow tenant id | |
| Grow account name | |
| ZMP site_id | prod: · staging: |

## Layout

```
{grow_tenant_id}-{ACCOUNT}/
  README.md                         this file
  {Account}-{pushplanet_id}/        one per migrated experience
    README.md
    templates/                      optional, experience-specific submit integrations
    {grow_campaign_id}/
      README.md                     paste checklist, ids, staging link
      custom.css                    Customize → Custom CSS
      custom.html                   Customize → Custom JavaScript
      onload.json                   Integrations → On Load
      WIP*.json                     same files with real credentials (gitignored)
      reference/                    not pasted: originals, samples, retired attempts
```

Shared submit integrations (ZMP activity, identify, get-contact) live in the repo-level [`/templates/`](../../templates/).

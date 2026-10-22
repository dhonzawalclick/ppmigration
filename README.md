# PushPlanet → Grow migration

Custom code (JS, CSS, integration JSON) for migrating PushPlanet / Digioh forms to Zeta Grow, organized by Grow account, PushPlanet experience and Grow campaign.

## Layout

```
templates/                          shared submit integrations
  activity.json                     HTTP entry → ZMP activity (+ identify_person)
  identify.json                     HTTP entry → ZMP identify
  get-contact.json                  ZMP person read
clients/
  {grow_tenant_id}-{ACCOUNT}/       e.g. 2353-SEI
    README.md                       account facts: tenant id, ZMP site ids
    {Account}-{pushplanet_id}/      e.g. SEI-Soccer-9958, one per migrated experience
      README.md
      templates/                    optional, experience-specific integrations
      {grow_campaign_id}/           e.g. 22815
        README.md                   paste checklist, ids, staging link
        custom.css                  Customize → Custom CSS
        custom.html                 Customize → Custom JavaScript
        onload.json                 Integrations → On Load
        WIP*.json                   same configs with real credentials (gitignored)
        reference/                  not pasted: originals, samples, retired attempts
readmes/                            background docs and per-client notes
```

Start a new account, experience or campaign by copying [`clients/_TEMPLATE-0000-ACCOUNT/`](clients/_TEMPLATE-0000-ACCOUNT/).

## Guides

| Guide | Use it for |
| --- | --- |
| [`GUIDE-new-campaign.md`](GUIDE-new-campaign.md) | Building a migrated form end to end |
| [`readmes/readme.md`](readmes/readme.md) | Architecture, form → entry → ZMP flow, Grow JSON field reference |
| [`readmes/grow-preference-center-process.md`](readmes/grow-preference-center-process.md) | Preference center build order |
| [`readmes/grow-json-from-custom-js.md`](readmes/grow-json-from-custom-js.md) | Turning PushPlanet custom JS into Grow ZMP JSON |
| [Notes Migration (Confluence)](https://zetaglobal.atlassian.net/wiki/spaces/PTGM/pages/2634121229/Notes+Migration) | Team developer notes |

## Clients

| Account | Experience | Campaigns |
| --- | --- | --- |
| [`2353-SEI`](clients/2353-SEI/) | [`SEI-Soccer-9958`](clients/2353-SEI/SEI-Soccer-9958/) | [`22815`](clients/2353-SEI/SEI-Soccer-9958/22815/) preference center |
| [`2353-SEI`](clients/2353-SEI/) | [`SEI-Soccer-9952`](clients/2353-SEI/SEI-Soccer-9952/) | [`22913`](clients/2353-SEI/SEI-Soccer-9952/22913/) preferences + unsubscribe |

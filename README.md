# PushPlanet → Grow migration

Custom code (JS, CSS, integration JSON) for migrating PushPlanet / Digioh forms to Zeta Grow, organized by Grow account and campaign.

## Layout

```
clients/
  {acc.name}-{account.number}/
    README.md            account facts: name, number, ZMP site_id
    templates/
      identify.json      HTTP entry → ZMP identify
      activity.json      HTTP entry → ZMP activity
    {campaign_id}/
      README.md          paste checklist, module ids, open items
      custom.js          Customize → Custom JavaScript
      theme.css          Customize → Custom Styles
      onload.json        Integrations → On Load
      reference/         not pasted: originals, samples, retired attempts
readmes/                 background docs and per-client notes
```

Start a new account or campaign by copying [`clients/_TEMPLATE-account-name-0000/`](clients/_TEMPLATE-account-name-0000/).

## Guides

| Guide | Use it for |
| --- | --- |
| [`GUIDE-new-campaign.md`](GUIDE-new-campaign.md) | Building a migrated form end to end |
| [`GUIDE-secrets.md`](GUIDE-secrets.md) | What may and may not be committed or put in page source |
| [`readmes/readme.md`](readmes/readme.md) | Architecture, form → entry → ZMP flow, Grow JSON field reference |
| [`readmes/grow-preference-center-process.md`](readmes/grow-preference-center-process.md) | Preference center build order |
| [`readmes/grow-json-from-custom-js.md`](readmes/grow-json-from-custom-js.md) | Turning PushPlanet custom JS into Grow ZMP JSON |
| [Notes Migration (Confluence)](https://zetaglobal.atlassian.net/wiki/spaces/PTGM/pages/2634121229/Notes+Migration) | Team developer notes |

## Clients

| Account | Campaigns |
| --- | --- |
| [`SEI-Soccer-9958`](clients/SEI-Soccer-9958/) | [`22815`](clients/SEI-Soccer-9958/22815/) preference center |

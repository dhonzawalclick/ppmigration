# Grow Scripting Guide (Custom JS)

Source: Grow in-product **Scripting Guide** (`/admin/campaign/scripthelpmicro`) plus SEI migration notes. Custom JS **must** be wrapped in `<script>` tags or Grow dumps the source as page text.

Namespace: `NGX`. Call methods with `NGX.api(<method>, <arguments>)`. In the console: `NGX.api('help')`.

## Events (`event:listen`)

```js
NGX.api('event:listen', 'page:ready', function () { /* ... */ });
```

| Event | Notes |
| --- | --- |
| `page:ready` | Page rendered (~After DOM Ready). Good for URL → hidden field copies. |
| `form:ready` | Form ready (~After Display). Prefer DOM changes here; Grow may re-render earlier edits. |
| `form:field:change` / `focus` / `blur` | Field interaction. |
| `form:entry:success` / `form:entry:failed` | After submit outcomes. |
| `module:ready` | Each module finished building; On Load values land around here. |
| `module:component:didupdate` | Module value/UI update (e.g. radio after On Load). |

On Load values arrive **after** `page:ready` / `form:ready` (~0.1–2s). Do not read `fromOnLoad` only once at ready.

Analytics also exposes `NGX.api('analytics:listen', 'form:submit', cb)` (fires when Submit passes validation). That callback is not the field map; integrations see `entry` / `params` server-side.

## Form API

### `form:set:field`

Set an existing field in the form store. For radio/checkbox, `value` is the **choice id**, not `remoteId`.

```js
NGX.api('form:set:field', { name: 'email', value: 'joe@example.com' });
NGX.api('form:set:field', { name: 'fromOnLoad', value: 'true' });
```

### `form:set:hidden:field`

Inject a hidden name/value that posts with the entry (user cannot edit it).

```js
NGX.api('form:set:hidden:field', { name: 'sei_action', value: 'unsubscribe' });
```

### `form:add:data`

Extra submit data that is **not** a field. Arrives as `params.<name>` on HTTP integrations (not `entry.<name>`, not in entries export).

```js
NGX.api('form:add:data', { name: 'sei_action', value: 'preference_center' });
```

### `form:add:submitHandler` / `form:remove:submitHandler`

Run logic before Grow allows the entry to post. Return `true` to allow, `false` to block (optional `error` string).

```js
NGX.api('form:add:submitHandler', {
  id: 'seiDualPathAction',
  handler: function (inputs) {
    // inputs = current form inputs
    return true;
  },
  error: 'Optional message when handler returns false'
});
```

Does **not** skip Grow’s native required-field validation.

### Customer ID

```js
NGX.api('form:set:customerid', 'jane-doe-987', 'id-type');
var id = NGX.api('form:get:customerid');
```

### Triggering submit from Custom JS

There is no first-class documented “force submit” that bypasses validation. Practical pattern: set fields / `form:add:data`, then click the Sign up CTA:

```js
document.querySelector('#xSubmitContainer .xButton').click();
```

## Modules

Prefer NGX over raw DOM for system modules:

```js
NGX.api('module:add:custom:classes', { id: 'submit_…', customClassNames: 'sei-hide-cta' });
NGX.api('module:remove:custom:classes', { id: 'submit_…', customClassNames: 'sei-hide-cta' });
```

Grow prefixes CSS classes as `.xCustomClass-<name>`.

## Dual-path forms (prefs + unsubscribe)

PushPlanet 9952:

| CTA | ZMP writes |
| --- | --- |
| Sign up / prefs | `updateSubscriber` (identify). Track `preference_center` was commented out in the live PP script. |
| Unsubscribe | `updateSubscriber` with email `subscription_status: inactive`, then `zetaTrackEvent` with `event: "unsubscribe"`. |

Grow pattern used on campaign **22913**:

1. Custom JS sets `params.sei_action` = `preference_center` or `unsubscribe`.
2. Flat HTTP entry integrations use `executeIf` on `params.sei_action` (ignored when `onlySubSteps: true`).
3. Prefs configs: `executeIf` → preference_center. Unsub configs: `executeIf` → unsubscribe.

See `clients/2353-SEI/SEI-Soccer-9952/22913/custom.html` and `clients/2353-SEI/SEI-Soccer-9952/templates/activity-identify.json`.

## Debug

- Add `&debug` (or `&debug=6`) to the experience URL.
- `NGX.api('help')` in the console.
- Integration Debug tab / `stageUrl` capture for the posted body (`${wynParamsMap}` when enabled).

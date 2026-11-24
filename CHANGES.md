# Changes

## 2.0.0 2026-11-20

First entry of this change log. Earlier versions are on npm and in the git history.

* Seneca 4: the peer dependency is `seneca` `^4.0.0` (was `>=3`).
  Seneca 3 users stay on `@seneca/flow@1`.
* The entity peer dependency is `@seneca/entity` `^29.0.0` (was
  `seneca-entity` `>=25`). Load it by its full name:
  `seneca.use('@seneca/entity')`.
* Node.js 24 or later (`engines.node` `>=24`, was `>=12`).
* The peer dependency `seneca-promisify` is removed: promises are built
  into Seneca 4 (D4).
* The message and option shapes are built from the validator that
  Seneca provides (`seneca.valid`), and the option defaults are a
  function of `valid` (B1). The package no longer imports `gubu`, which
  it never declared as a dependency. The rules are unchanged.
* Options are closed: an option other than `debug` and `flows` stops
  the plugin with `invalid_plugin_option`. A flow definition and a step
  definition still accept custom fields.
* The stale `dist/gateway.*` files, which required `gubu`, are removed
  from the package.
* Tests: the entity plugin is loaded as `@seneca/entity`, and
  `seneca-promisify` is no longer loaded. New tests cover the default
  options, an invalid option and invalid messages. devDependencies:
  `seneca` `^4.0.0`, `@seneca/entity` `^29.0.0` and `seneca-msg-test`
  `^5.0.0`; the unused `@seneca/maintain` is removed.
* `repository.url` uses `git+https`, `publishConfig` sets public access,
  and the package includes `CHANGES.md`.

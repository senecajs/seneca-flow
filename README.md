![Seneca](http://senecajs.org/files/assets/seneca-logo.png)
> A [Seneca.js](http://senecajs.org) plugin

# @seneca/flow

[![npm version](https://img.shields.io/npm/v/@seneca/flow.svg)](https://npmjs.com/package/@seneca/flow)
[![build](https://github.com/senecajs/seneca-flow/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-flow/actions/workflows/build.yml)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-flow/badge.svg)](https://snyk.io/test/github/senecajs/seneca-flow)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-flow/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-flow?branch=main)
[![Maintainability](https://api.codeclimate.com/v1/badges/9d54b38a991fe7b92a43/maintainability)](https://codeclimate.com/github/senecajs/seneca-flow/maintainability)

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
|---|---|

## Install

```sh
npm install @seneca/flow
```

## Quick Example

```js
require('seneca')()
  .use('@seneca/flow')
```

## More Examples

See [test/](test/) for more usage examples.

## Motivation

A [Seneca.js](http://senecajs.org) plugin.

## Support

If you're using this module and need help, you can:

- Post a [github issue](https://github.com/senecajs/seneca-flow/issues)
- Tweet to [@senecajs](http://twitter.com/senecajs)
- Ask on the [Gitter](https://gitter.im/senecajs/seneca)

## API

### Design

A _flow_ is series of transitions over a directed graph of _steps_. Each
step indicates valid transitions to other steps. A flow is defined
primarily as the graph of steps.

Entities:

* Flow definition entity: `sys/flowDef`
* Step definition entity: `sys/flowStepDef`

Relations:

* `sys/flowStepDef *-->1 sys/flowDef` # steps of the flow

An instance of a flow specifies the current step, a list of step
states, and alog of step operations.

The step operations are:

* _APPLY_: move to the specified step from current step (create step
  state if needed), and update the step data as indicated, recording
  change in log.


Entities:

* Flow instance entity: `sys/flow`
* Step instance entity: `sys/flowStep`
* Step log entity: `sys/flowStepLog`

Relations:

* `sys/flow *-->1 sys/flowDef` # flow instance of a flowDef
* `sys/flowStep *-->1 sys/flowStepDef` # flow step instance of a flowStepDef
* `sys/flowStep *-->1 sys/flow` # flow step of flow (1 only per flowStepDef)
* `sys/flow 1-->1 sys/flowStep` # current flowStep
* `sys/flowStepLog *--> sys/flowDef` # flow step log entry for flowDef
* `sys/flowStepLog *--> sys/flow` # flow step log entry for flow
* `sys/flowStepLog *--> sys/flowStepDef` # flow step log entry for flowStepDef
* `sys/flowStepLog *--> sys/flowStep` # flow step log entry for flowStep


Each entity has a set of well-defined fields for internal control, and
a set of standard fields for common use cases. Custom user fields
should be prefixed with an `x` to ensure namespace safety for
updates. No standard field will start with `x`.

## Contributing

The [Senecajs org](https://github.com/senecajs/) encourages open participation. If you feel you can help in any way, be it with documentation, examples, extra testing, or new features please get in touch.

### Running tests

```sh
npm run test
```

## Background

Part of the [Senecajs org](https://github.com/senecajs/).

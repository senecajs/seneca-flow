![Seneca Flow](http://senecajs.org/files/assets/seneca-logo.png)

> _Seneca Flow_ is a plugin for [Seneca](http://senecajs.org)

Workflow operations and data model

[![npm version](https://img.shields.io/npm/v/@seneca/flow.svg)](https://npmjs.com/package/@seneca/flow)
[![build](https://github.com/senecajs/seneca-flow/actions/workflows/build.yml/badge.svg)](https://github.com/senecajs/seneca-flow/actions/workflows/build.yml)
[![Coverage Status](https://coveralls.io/repos/github/senecajs/seneca-flow/badge.svg?branch=main)](https://coveralls.io/github/senecajs/seneca-flow?branch=main)
[![Known Vulnerabilities](https://snyk.io/test/github/senecajs/seneca-flow/badge.svg)](https://snyk.io/test/github/senecajs/seneca-flow)
[![DeepScan grade](https://deepscan.io/api/teams/5016/projects/21060/branches/593851/badge/grade.svg)](https://deepscan.io/dashboard#view=project&tid=5016&pid=21060&bid=593851)
[![Maintainability](https://api.codeclimate.com/v1/badges/9d54b38a991fe7b92a43/maintainability)](https://codeclimate.com/github/senecajs/seneca-flow/maintainability)

# @seneca/flow

| ![Voxgig](https://www.voxgig.com/res/img/vgt01r.png) | This open source module is sponsored and supported by [Voxgig](https://www.voxgig.com). |
| ---------------------------------------------------- | --------------------------------------------------------------------------------------- |

## Install

## Quick Example

## More Examples

## Motivation

## Design

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



## Support

## API

## Contributing

## Background

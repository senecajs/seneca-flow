/* Copyright © 2022 Richard Rodger and Seneca Project Contributors, MIT License. */


import { Value, Skip } from 'gubu'


const FlowDefShape = {
  name: String,
  kind: 'standard',
  code: '',
  status: '',
  content: {},
}

const StepDefShape = {
  name: String,
  kind: 'standard',
  code: '',
  status: '',
  content: {},
  next: Value({}, {})
}


function flow(this: any, options: any) {
  const seneca: any = this

  const { One } = seneca.valid


  seneca
    .fix('sys:flow')

    .message({
      define: 'flowdef',
      // TODO: this is a use case for Gubu/Optional: Optional(false)
      merge: One(true, false, undefined),
      flowDef: FlowDefShape,
      stepDefs: [StepDefShape],
    }, create_flow)

    .message({
      list: 'flowdef',
    }, list_flowdef)

    .message({
      load: 'flowdef',
      name: String,
    }, load_flowdef)


    .prepare(prepare)


  async function prepare(this: any) {
    if (options.flows) {
      for (let flowEntry of options.flows) {
        let res = await this.post('sys:flow,define:flowdef', {
          flowDef: flowEntry.flowDef,
          stepDefs: flowEntry.stepDefs,
        })
        if (!res.ok) {
          throw seneca.fail(res.why)
        }
      }
    }
  }


  async function create_flow(this: any, msg: any) {
    let ok = true
    let sysFlowDef = this.entity('sys/flowDef')

    // NOTE: use name as id to ensure uniqueness
    let flowDefId = msg.flowDef.name
    let flowDefData = clean({
      name: flowDefId,
      kind: msg.flowDef.kind,
      code: msg.flowDef.code,
      status: msg.flowDef.status,
      content: msg.flowDef.content,
    })

    let flowDefEnt = await sysFlowDef.load$(flowDefId)

    // If exists, fail to ensure uniqueness, but merge if requested
    if (flowDefEnt) {
      if (!msg.merge) {
        return seneca.fail('flowdef-exists')
      }

      // NOTE: merges updates
      flowDefData = this.util.deep(flowDefEnt.data$(false), flowDefData)
    }
    else {
      flowDefData.id$ = flowDefId
      flowDefEnt = sysFlowDef.clone$()
    }

    flowDefEnt = await flowDefEnt.save$(flowDefData)

    let flowDef = flowDefEnt.data$(false)


    let stepDefs: any[] = []
    let sysFlowStepDef = this.entity('sys/flowStepDef')
    for (let stepDefEntry of msg.stepDefs) {
      let flowStepDefId = flowDefId + '_' + stepDefEntry.name
      let flowStepDefData = clean({
        flowDef: flowDef.name,
        name: stepDefEntry.name,
        kind: stepDefEntry.kind,
        code: stepDefEntry.code,
        status: stepDefEntry.status,
        content: stepDefEntry.content,
      })

      let flowStepDefEnt = await sysFlowStepDef.load$(flowStepDefId)

      // If exists, fail to ensure uniqueness, but merge if requested
      if (flowStepDefEnt) {
        if (!msg.merge) {
          return seneca.fail('flowstepdef-exists')
        }

        flowStepDefData = this.util.deep(flowStepDefEnt.data$(false), flowStepDefData)
      }
      else {
        flowStepDefData.id$ = flowStepDefId
        flowStepDefEnt = sysFlowStepDef.clone$()
      }

      flowStepDefEnt = await flowStepDefEnt.save$(flowStepDefData)

      let stepDef = flowStepDefEnt.data$(false)

      stepDefs.push(stepDef)
    }

    return { ok, flowDef, stepDefs }
  }


  async function list_flowdef(this: any, _msg: any) {
    let list = await this.entity('sys/flowDef').list$()
    list = list.map((item: any) => item.data$(false))
    return { ok: true, list }
  }


  async function load_flowdef(this: any, msg: any) {
    // name is used as id
    let flowDefEnt = await this.entity('sys/flowDef').load$(msg.name)
    if (!flowDefEnt) {
      return {
        ok: false, why: 'not-found'
      }
    }

    let stepDefEnts = await this.entity('sys/flowStepDef').list$({
      flowDef: msg.name
    })
    let stepDefs = stepDefEnts.map((item: any) => item.data$(false))

    return {
      ok: true,
      flowDef: flowDefEnt.data$(false),
      stepDefs,
    }
  }
}


// Default options.
flow.defaults = {
  debug: false,
  flows: [{
    flowDef: FlowDefShape,
    stepDefs: [StepDefShape],
  }],
}


// TODO: Seneca util?
function clean(obj: any) {
  // removes undefined values
  return JSON.parse(JSON.stringify(obj))
}


export default flow


if ('undefined' !== typeof (module)) {
  module.exports = flow
}

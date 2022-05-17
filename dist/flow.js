"use strict";
/* Copyright © 2022 Richard Rodger and Seneca Project Contributors, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
const gubu_1 = require("gubu");
// TODO: generate types from a model
// TODO: Gubu: not really open, just allow keys =~ /^x.+/
const FlowDefShape = (0, gubu_1.Open)({
    name: String,
    kind: 'standard',
    code: '',
    status: '',
    first: String,
    content: {},
});
const StepDefShape = (0, gubu_1.Open)({
    name: String,
    kind: 'standard',
    code: '',
    status: '',
    content: {},
    next: (0, gubu_1.Value)({}, {})
});
const FlowShape = (0, gubu_1.Open)({
    name: String,
    kind: 'standard',
    code: '',
    status: '',
    content: {},
});
const StepShape = (0, gubu_1.Open)({
    name: String,
    kind: 'standard',
    code: '',
    status: '',
    content: {},
});
/* - Hides implementation with seneca entities and provides data model
 *   as pure objects.
 * - Foreign keys are suffixed with _id.
 */
function flow(options) {
    const seneca = this;
    seneca
        .fix('sys:flow')
        .message({
        define: 'flowdef',
        // TODO: Gubu: this is a use case for Gubu/Optional: Optional(false)
        merge: (0, gubu_1.One)(true, false, undefined),
        flowDef: FlowDefShape,
        stepDefs: [StepDefShape],
    }, msg_define_flowdef)
        .message({
        list: 'flowdef',
    }, list_flowdef)
        .message({
        load: 'flowdef',
        name: String,
    }, msg_load_flowdef)
        .message({
        start: 'flow',
        flow: FlowShape,
        step: StepShape,
    }, msg_start_flow)
        .message({
        apply: 'step',
        flow_id: String,
        step: StepShape,
    }, msg_apply_step)
        .message({
        load: 'flow',
        flow_id: String,
    }, msg_load_flow)
        .prepare(prepare);
    async function prepare() {
        if (options.flows) {
            for (let flowEntry of options.flows) {
                let res = await this.post('sys:flow,define:flowdef', {
                    flowDef: flowEntry.flowDef,
                    stepDefs: flowEntry.stepDefs,
                });
                if (!res.ok) {
                    throw seneca.fail(res.why);
                }
            }
        }
    }
    async function msg_define_flowdef(msg) {
        let ok = true;
        let sysFlowDef = this.entity('sys/flowDef');
        // NOTE: use name as id to ensure uniqueness
        let flowDefId = msg.flowDef.name;
        let flowDefData = clean({
            name: flowDefId,
            kind: msg.flowDef.kind,
            code: msg.flowDef.code,
            status: msg.flowDef.status,
            first: msg.flowDef.first,
            content: msg.flowDef.content,
        });
        // Accept x-prefixed custom fields
        for (let xfield of Object.keys(msg.flowDef).filter(fn => fn.match(/^x.+/))) {
            flowDefData[xfield] = msg.flowDef[xfield];
        }
        let flowDefEnt = await sysFlowDef.load$(flowDefId);
        // If exists, fail to ensure uniqueness, but merge if requested
        if (flowDefEnt) {
            if (!msg.merge) {
                return seneca.fail('flowdef-exists');
            }
            // NOTE: merges updates
            flowDefData = this.util.deep(flowDefEnt.data$(false), flowDefData);
        }
        else {
            flowDefData.id$ = flowDefId;
            flowDefEnt = sysFlowDef.clone$();
        }
        flowDefEnt = await flowDefEnt.save$(flowDefData);
        let flowDef = flowDefEnt.data$(false);
        let stepDefs = [];
        let sysFlowStepDef = this.entity('sys/flowStepDef');
        for (let stepDefEntry of msg.stepDefs) {
            let flowStepDefId = flowDefId + '_' + stepDefEntry.name;
            let flowStepDefData = clean({
                flowDef: flowDef.name,
                name: stepDefEntry.name,
                kind: stepDefEntry.kind,
                code: stepDefEntry.code,
                status: stepDefEntry.status,
                content: stepDefEntry.content,
                next: stepDefEntry.next,
            });
            // Accept x-prefixed custom fields
            for (let xfield of Object.keys(stepDefEntry)
                .filter(fn => fn.match(/^x.+/))) {
                flowStepDefData[xfield] = stepDefEntry[xfield];
            }
            let flowStepDefEnt = await sysFlowStepDef.load$(flowStepDefId);
            // If exists, fail to ensure uniqueness, but merge if requested
            if (flowStepDefEnt) {
                if (!msg.merge) {
                    return seneca.fail('flowstepdef-exists');
                }
                flowStepDefData = this.util.deep(flowStepDefEnt.data$(false), flowStepDefData);
            }
            else {
                flowStepDefData.id$ = flowStepDefId;
                flowStepDefEnt = sysFlowStepDef.clone$();
            }
            flowStepDefEnt = await flowStepDefEnt.save$(flowStepDefData);
            let stepDef = flowStepDefEnt.data$(false);
            stepDefs.push(stepDef);
        }
        return { ok, flowDef, stepDefs };
    }
    async function list_flowdef(_msg) {
        let list = await this.entity('sys/flowDef').list$();
        list = list.map((item) => item.data$(false));
        return { ok: true, list };
    }
    async function msg_load_flowdef(msg) {
        let flowDefName = msg.name;
        // name is used as id
        let flowDefEnt = await this.entity('sys/flowDef').load$(flowDefName);
        if (!flowDefEnt) {
            return {
                ok: false, why: 'unknown-flowdef', details: { flowDefName }
            };
        }
        let stepDefEnts = await this.entity('sys/flowStepDef').list$({
            flowDef: msg.name
        });
        let stepDefs = stepDefEnts.map((item) => item.data$(false));
        return {
            ok: true,
            flowDef: flowDefEnt.data$(false),
            stepDefs,
        };
    }
    async function msg_start_flow(msg) {
        let flowres = await this.post('sys:flow,load:flowdef', { name: msg.flow.name });
        if (!flowres.ok) {
            return flowres;
        }
        let { flowDef, stepDefs } = flowres;
        // console.log('FLOWDEF', flowDef)
        let flowData = {
            ...this.util.deep(flowDef, msg.flow),
            flowDef: flowDef.name,
            flowDef_id: flowDef.id,
            // NOTE: needs a unique id!
            id$: flowDef.name + '_' + this.util.Nid()
        };
        delete flowData.id;
        let flowEnt = await this.entity('sys/flow').save$(flowData);
        let stepres = await apply_step(this, flowDef, stepDefs, flowEnt, msg.step);
        // console.log('STEPRES', stepres)
        if (!stepres.ok) {
            return stepres;
        }
        let startres = await this.post('sys:flow,load:flow', { flow_id: flowEnt.id });
        // console.log('STARTRES', startres)
        return startres;
    }
    async function msg_apply_step(msg) {
        let flowEnt = await this.entity('sys/flow').load$(msg.flow_id);
        if (null == flowEnt) {
            return { ok: false, why: 'unknown-flow', details: { flow: msg.flow } };
        }
        let flowres = await this.post('sys:flow,load:flowdef', { name: flowEnt.name });
        if (!flowres.ok) {
            return flowres;
        }
        let { flowDef, stepDefs } = flowres;
        let out = apply_step(this, flowDef, stepDefs, flowEnt, msg.step);
        return out;
    }
    async function msg_load_flow(msg) {
        let flow_id = msg.flow_id;
        let flowEnt = await this.entity('sys/flow').load$(flow_id);
        if (null == flowEnt) {
            return { ok: false, why: 'unknown-flow', details: { flow_id } };
        }
        let stepEnts = await this.entity('sys/flowStep').list$({ flow_id });
        return {
            ok: true,
            flow: flowEnt.data$(false),
            steps: stepEnts.map((se) => se.data$(false))
        };
    }
    async function apply_step(seneca, flowDef, stepDefs, flowEnt, step) {
        let nextStepName = step.name;
        let nextStepDef = stepDefs.find((sd) => sd.name === nextStepName);
        if (null == nextStepDef) {
            return { ok: false, why: 'unknown-step', details: { step } };
        }
        // console.log('QQQ', flowEnt, stepDefs)
        let currentStepName = flowEnt.step;
        let currentStepDef = stepDefs.find((sd) => sd.name === currentStepName);
        let allowedNextStepNames = [...(null == currentStepDef ?
                [flowDef.first] : Object.keys(currentStepDef.next))];
        if (!allowedNextStepNames.includes(nextStepName)) {
            return {
                ok: false, why: 'invalid-next-step',
                details: {
                    currentStepName,
                    nextStepName,
                    allowedNextStepNames,
                }
            };
        }
        // NOTE: ensure uniqueness of step instance using id
        let nextStepId = flowEnt.id + '_' + nextStepName;
        let sysFlowStep = seneca.entity('sys/flowStep');
        let nextStepEnt = await sysFlowStep.load$(nextStepId);
        // merge new step data onto old
        if (null == nextStepEnt) {
            let stepData = seneca.util.deep(nextStepDef, step);
            delete stepData.id;
            nextStepEnt = sysFlowStep.data$({
                ...stepData,
                id$: nextStepId,
            });
        }
        else {
            let stepData = seneca.util.deep(nextStepEnt.data$(false), step);
            nextStepEnt.data$({
                ...stepData,
                id: nextStepEnt.id,
            });
        }
        // Ensure standard fields
        nextStepEnt.data$({
            flow_id: flowEnt.id,
            flowDef_id: flowDef.id,
            stepDef_id: nextStepDef.id,
            name: nextStepName,
            when: Date.now(),
        });
        await nextStepEnt.save$();
        flowEnt.step = nextStepEnt.name;
        flowEnt.when = Date.now();
        await flowEnt.save$();
        return {
            ok: true,
            flow: flowEnt.data$(false),
            step: nextStepEnt.data$(false),
        };
    }
}
// Default options.
flow.defaults = {
    debug: false,
    flows: [{
            flowDef: FlowDefShape,
            stepDefs: [StepDefShape],
        }],
};
// TODO: Seneca util?
function clean(obj) {
    // removes undefined values
    return JSON.parse(JSON.stringify(obj));
}
exports.default = flow;
if ('undefined' !== typeof (module)) {
    module.exports = flow;
}
//# sourceMappingURL=flow.js.map
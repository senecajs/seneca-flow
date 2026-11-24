
import Flow from '../src/flow'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const BasicMessages = require('./basic.messages').default



describe('flow', () => {

  test('happy', async () => {
    const seneca = await makeSeneca()
    await seneca.close()
  })


  // The default options define no flows.
  test('defaults', async () => {
    const seneca = await makeSeneca()
    expect(seneca.find_plugin('flow').options.flows).toEqual([])

    let flowDefList = await seneca.entity('sys/flowDef').list$()
    expect(flowDefList).toEqual([])

    let res = await seneca.post('sys:flow,list:flowdef')
    expect(res).toEqual({ ok: true, list: [] })

    await seneca.close()
  })


  test('invalid-options', async () => {
    const errs: any[] = []
    const seneca = Seneca({ legacy: false, debug: { undead: true } })
      .test((err: any) => errs.push(err), 'silent')
      .use('@seneca/entity')
      .use(Flow, {
        flows: [{ flowDef: { code: 'no-name' }, stepDefs: [] }]
      })
    await seneca.ready()
    expect(errs.map((err: any) => err.code)).toEqual(['invalid_plugin_option'])
    await seneca.close()
  })


  test('invalid-message', async () => {
    const seneca = await makeSeneca(undefined, 'silent')

    // flow.assign_id is required
    await expect(seneca.post('sys:flow,list:flow', { flow: {} }))
      .rejects.toMatchObject({ code: 'act_invalid_msg' })

    // step names are strings
    await expect(seneca.post('sys:flow,define:flowdef', {
      flowDef: { name: 'f', first: 's' },
      stepDefs: [{ name: 1 }],
    })).rejects.toMatchObject({ code: 'act_invalid_msg' })

    await seneca.close()
  })


  test('options', async () => {
    const seneca = await makeSeneca({
      flows: [
        {
          flowDef: {
            name: 'f01',
            code: 'f',
            first: 'start',
          },
          stepDefs: [
            {
              name: 'start',
              next: {}
            },
          ],
        },
      ]
    })

    await seneca.ready()

    let flowDefList = await seneca.entity('sys/flowDef').list$()
    expect(flowDefList[0].name).toEqual('f01')

    let flowStepDefList = await seneca.entity('sys/flowStepDef').list$()
    expect(flowStepDefList[0].name).toEqual('start')

    await seneca.close()
  })


  test('messages', async () => {
    const seneca = await makeSeneca(makeOpts())
    await (SenecaMsgTest(seneca, BasicMessages)())
    await seneca.close()
  })


})


function makeOpts() {
  return {
    flows: [
      {
        flowDef: {
          name: 'init01',
          code: 'codeA',
          first: 'step01',
        },
        stepDefs: [
          {
            name: 'step01',
          },
        ],
      },

      {
        flowDef: {
          name: 'init02',
          first: 'step01',
        },
        stepDefs: [
          {
            name: 'step01',
            next: {
              step02: {}
            },
          },
          {
            name: 'step02',
          },
        ],
      }

    ]
  }
}

async function makeSeneca(popts?: any, log?: string) {
  const seneca = Seneca({ legacy: false })
    .test(log)
    .use('@seneca/entity')
    .use(Flow, popts)
  await seneca.ready()
  return seneca
}




import Flow from '../src/flow'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const BasicMessages = require('./basic.messages').default



describe('flow', () => {

  test('happy', async () => {
    const seneca = await makeSeneca()
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

async function makeSeneca(popts?: any) {
  const seneca = Seneca({ legacy: false })
    .test()
    .use('promisify')
    .use('entity')
    .use(Flow, popts)
  return await seneca.ready()
}



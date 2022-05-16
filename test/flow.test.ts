
import Flow from '../src/flow'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const BasicMessages = require('./basic.messages').default



describe('flow', () => {

  test('happy', async () => {
    const seneca = await makeSeneca()
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



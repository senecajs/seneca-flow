
import Flow from '../src/flow'

const Seneca = require('seneca')
const SenecaMsgTest = require('seneca-msg-test')
const BasicMessages = require('./basic.messages').default



describe('flow', () => {

  test('happy', async () => {
    const seneca = Seneca({ legacy: false }).test().use('promisify').use(Flow)
    await seneca.ready()
  })

  test('messages', async () => {
    const seneca = Seneca({ legacy: false }).test().use('promisify').use(Flow)
    await (SenecaMsgTest(seneca, BasicMessages)())
  })

})


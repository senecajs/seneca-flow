/* Copyright © 2022 Richard Rodger, MIT License. */


function flow(this: any, options: any) {
  const seneca: any = this

  seneca
    .fix('sys:flow')
    .message('create:flow', create_flow)

  async function create_flow(msg: any) {
    let ok = true
    return { ok }
  }
}


// Default options.
flow.defaults = {
  debug: false
}


export default flow


if ('undefined' !== typeof (module)) {
  module.exports = flow
}

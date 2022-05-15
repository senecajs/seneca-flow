"use strict";
/* Copyright © 2022 Richard Rodger, MIT License. */
Object.defineProperty(exports, "__esModule", { value: true });
function flow(options) {
    const seneca = this;
    seneca
        .fix('sys:flow')
        .message('create:flow', create_flow);
    async function create_flow(msg) {
        let ok = true;
        return { ok };
    }
}
// Default options.
flow.defaults = {
    debug: false
};
exports.default = flow;
if ('undefined' !== typeof (module)) {
    module.exports = flow;
}
//# sourceMappingURL=flow.js.map
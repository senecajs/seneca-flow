

export default {
  print: false,
  pattern: 'sys:flow',
  allow: { missing: true },


  calls: [
    {
      name: 'def0',
      pattern: 'define:flowdef',
      params: {
        flowDef: {
          name: 'flow01',
        },
        stepDefs: [
          {
            name: 'step01',
            code: 'codeA',
            status: '',
            content: {},
            next: {
              step02: {},
              step03: {}
            },
          },
          {
            name: 'step02',
            code: 'codeB',
            status: 'statusA',
            content: {},
            next: {
              step01: {}
            },
          },
          {
            name: 'step03',
            kind: 'extra',
            code: '',
            status: '',
            content: { propA: 11 },
            next: {},
          },
        ],
      },
      out: {
        ok: true,
        flowDef: { id: 'flow01', name: 'flow01' },
        stepDefs: [
          {
            id: 'flow01_step01', name: 'step01', flowDef: 'flow01',
            kind: 'standard', code: 'codeA', status: ''
          },
          {
            id: 'flow01_step02', name: 'step02', flowDef: 'flow01',
            kind: 'standard', code: 'codeB', status: 'statusA',
          },
          {
            id: 'flow01_step03', name: 'step03', flowDef: 'flow01',
            kind: 'extra', code: '', status: '', content: {
              propA: 11
            }
          },
        ]
      }
    },

    {
      name: 'list0',
      pattern: 'list:flowdef',
      out: {
        ok: true, list: [
          { name: 'init01' },
          { name: 'init02' },
          { name: 'flow01' },
        ]
      }
    },

    {
      name: 'def1',
      pattern: 'define:flowdef',
      params: {
        flowDef: {
          name: 'init01',
          code: 'codeAA',
          status: 'statusB',
        },
        stepDefs: [
          {
            name: 'step01',
            content: { a: 1 },
            next: {
              step02: {}
            }
          },
          {
            name: 'step02',
          },
        ],
      },
      out: {
        ok: true,
        flowDef: {
          name: 'init01',
          kind: 'standard',
          code: 'codeAA',
          status: 'statusB',
          content: {},
          id: 'init01'
        },
        stepDefs: [
          {
            name: 'step01',
            flowDef: 'init01',
            kind: 'standard',
            code: '',
            status: '',
            content: { a: 1 },
            id: 'init01_step01'
          },
          {
            name: 'step02',
            flowDef: 'init01',
            kind: 'standard',
            code: '',
            status: '',
            content: {},
            id: 'init01_step02'
          }
        ]
      }
    },

    {
      name: 'load0',
      pattern: 'load:flowdef',
      params: { name: 'flow01' },
      out: {
        ok: true,
        flowDef: {
          name: 'flow01',
          kind: 'standard',
          code: '',
          status: '',
          content: {},
          id: 'flow01'
        },
        stepDefs: [
          {
            flowDef: 'flow01',
            name: 'step01',
            kind: 'standard',
            code: 'codeA',
            status: '',
            content: {},
            id: 'flow01_step01'
          },
          {
            flowDef: 'flow01',
            name: 'step02',
            kind: 'standard',
            code: 'codeB',
            status: 'statusA',
            content: {},
            id: 'flow01_step02'
          },
          {
            flowDef: 'flow01',
            name: 'step03',
            kind: 'extra',
            code: '',
            status: '',
            content: { propA: 11 },
            id: 'flow01_step03'
          }
        ],
      }
    },

  ]
}

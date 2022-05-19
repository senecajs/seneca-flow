

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
          first: 'step01',
          xfoo: 'WW', // custom field
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
        flowDef: { id: 'flow01', name: 'flow01', xfoo: 'WW' },
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
          first: 'step01',
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

    {
      // print: true,
      name: 'start0',
      pattern: 'start:flow',
      params: {
        flow: {
          name: 'flow01',
          assign_id: 'u01',
        },
      },
      out: {
        ok: true,
        flow: { name: 'flow01', },
        steps: [{ name: 'step01' }],
      }
    },

    {
      // print: true,
      name: 'load1',
      pattern: 'load:flow',
      params: {
        flow_id: '`start0:out.flow.id`',
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          active: true,
          assign_id: 'u01',
          kind: 'standard',
          code: '',
          status: '',
          content: {},
          first: 'step01',
          xfoo: 'WW',
          flowDef: 'flow01',
          flowDef_id: 'flow01',
          step: 'step01',
        },
        steps: [
          {
            name: 'step01',
            kind: 'standard',
            code: 'codeA',
            status: '',
            content: {},
            flowDef: 'flow01',
            next: { step02: {}, step03: {} },
            flow_id: '`start0:out.flow.id`',
            flowDef_id: 'flow01',
            stepDef_id: 'flow01_step01',
          },
        ]
      }
    },

    {
      // print: true,
      name: 'apply0',
      pattern: 'apply:step',
      params: {
        flow_id: '`start0:out.flow.id`',
        step: {
          name: 'step02',
          content: { a: 22 }, // merged
          xbar: 'QQ', // custom field
        },
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          kind: 'standard',
          code: '',
          status: '',
          content: {},
          first: 'step01',
          xfoo: 'WW',
          flowDef: 'flow01',
          flowDef_id: 'flow01',
          id: '`start0:out.flow.id`',
          step: 'step02',
        },
        step: {
          name: 'step02',
          content: { a: 22 },
          xbar: 'QQ',
          kind: 'standard',
          code: 'codeB',
          status: 'statusA',
          flowDef: 'flow01',
          next: { step01: {} },
          flow_id: '`start0:out.flow.id`',
          flowDef_id: 'flow01',
          stepDef_id: 'flow01_step02',
        }
      }
    },

    {
      // print: true,
      name: 'load2',
      pattern: 'load:flow',
      params: {
        flow_id: '`start0:out.flow.id`',
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          active: true,
          assign_id: 'u01',
          kind: 'standard',
          code: '',
          status: '',
          content: {},
          first: 'step01',
          xfoo: 'WW',
          flowDef: 'flow01',
          flowDef_id: 'flow01',
          step: 'step02',
        },
        steps: [
          {
            name: 'step01',
            kind: 'standard',
            code: 'codeA',
            status: '',
            content: {},
            flowDef: 'flow01',
            next: { step02: {}, step03: {} },
            flow_id: '`start0:out.flow.id`',
            flowDef_id: 'flow01',
            stepDef_id: 'flow01_step01',
          },
          {
            name: 'step02',
            content: { a: 22 },
            xbar: 'QQ',
            kind: 'standard',
            code: 'codeB',
            status: 'statusA',
            flowDef: 'flow01',
            next: { step01: {} },
            flow_id: '`start0:out.flow.id`',
            flowDef_id: 'flow01',
            stepDef_id: 'flow01_step02',
          }
        ]
      }
    },

    {
      // print: true,
      name: 'log0',
      pattern: 'load:log',
      params: {
        flow_id: '`start0:out.flow.id`',
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          kind: 'standard',
          assign_id: 'u01',
          code: '',
          status: '',
          content: {},
          first: 'step01',
          xfoo: 'WW',
          flowDef: 'flow01',
          flowDef_id: 'flow01',
          step: 'step02',
        },
        steps: [
          {
            name: 'step01',
          },
          {
            name: 'step02',
          }
        ],
        log: [
          {
            flow_id: '`start0:out.flow.id`',
            step: {
              name: 'step01',
            },
          },
          {
            flow_id: '`start0:out.flow.id`',
            step: {
              name: 'step02',
              content: { a: 22 },
              xbar: 'QQ',
            },
          }
        ]
      }
    },

    {
      name: 'apply1',
      pattern: 'apply:step',
      params: {
        flow_id: '`start0:out.flow.id`',
        step: {
          name: 'step01',
          status: 'green',
          content: { b: 33 }, // merged
        },
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          assign_id: 'u01',
          kind: 'standard',
          step: 'step01',
        },
        step: {
          name: 'step01',
          status: 'green',
          content: { b: 33 },
        }
      }
    },

    {
      // print: true,
      name: 'load3',
      pattern: 'load:flow',
      params: {
        flow_id: '`start0:out.flow.id`',
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          assign_id: 'u01',
          kind: 'standard',
          code: '',
          status: '',
          content: {},
          first: 'step01',
          xfoo: 'WW',
          flowDef: 'flow01',
          flowDef_id: 'flow01',
          step: 'step01',
        },
        steps: [
          {
            name: 'step01',
            kind: 'standard',
            code: 'codeA',
            status: 'green',
            content: { b: 33 },
            flowDef: 'flow01',
            next: { step02: {}, step03: {} },
            flow_id: '`start0:out.flow.id`',
            flowDef_id: 'flow01',
            stepDef_id: 'flow01_step01',
          },
          {
            name: 'step02',
            content: { a: 22 },
            xbar: 'QQ',
            kind: 'standard',
            code: 'codeB',
            status: 'statusA',
            flowDef: 'flow01',
            next: { step01: {} },
            flow_id: '`start0:out.flow.id`',
            flowDef_id: 'flow01',
            stepDef_id: 'flow01_step02',
          }
        ]
      }
    },

    {
      // print: true,
      name: 'log0',
      pattern: 'load:log',
      params: {
        flow_id: '`start0:out.flow.id`',
      },
      out: {
        ok: true,
        flow: {
          name: 'flow01',
          step: 'step01',
        },
        steps: [
          {
            name: 'step01',
          },
          {
            name: 'step02',
          }
        ],
        log: [
          {
            flow_id: '`start0:out.flow.id`',
            step: {
              name: 'step01',
            },
          },
          {
            flow_id: '`start0:out.flow.id`',
            step: {
              name: 'step02',
              content: { a: 22 },
              xbar: 'QQ',
            },
          },
          {
            flow_id: '`start0:out.flow.id`',
            step: {
              name: 'step01',
              status: 'green',
              content: { b: 33 },
            },
          }
        ]
      }
    },

    {
      // print: true,
      name: 'list1',
      pattern: 'list:flow',
      params: {
        flow: {
          assign_id: 'u01',
        }
      },
      out: {
        ok: true,
        list: [
          {
            name: 'flow01',
            assign_id: 'u01',
            active: true,
            content: {},
            kind: 'standard',
            code: '',
            status: '',
            first: 'step01',
            xfoo: 'WW',
            flowDef: 'flow01',
            flowDef_id: 'flow01',
            step: 'step01',
            steps: {
              step01: {
                name: 'step01',
                flowDef: 'flow01',
                kind: 'standard',
                code: 'codeA',
                status: 'green',
                content: { b: 33 },
                next: { step02: {}, step03: {} },
                flowDef_id: 'flow01',
                stepDef_id: 'flow01_step01',
              },
              step02: {
                name: 'step02',
                content: { a: 22 },
                xbar: 'QQ',
                flowDef: 'flow01',
                kind: 'standard',
                code: 'codeB',
                status: 'statusA',
                next: { step01: {} },
                flowDef_id: 'flow01',
                stepDef_id: 'flow01_step02',
              }
            }
          }
        ]
      }
    },

  ]
}

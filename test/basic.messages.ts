

export default {
  print: true,
  pattern: 'sys:flow',
  allow: { missing: true },

  calls: [
    {
      pattern: 'create:flow',
      out: { ok: true }
    },
  ]
}

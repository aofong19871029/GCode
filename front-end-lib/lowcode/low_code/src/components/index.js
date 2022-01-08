const req = require.context('./', false, /[^.]+\.vue/)
const reqParser = require.context('./', false, /parser-[^.]+\.js/)

const componentsName = req.keys()
const components = componentsName.reduce((components, module) => {
  const mod = req(module)

  components[mod.default.name] = mod.default
  return components
}, {})

const parsersName = reqParser.keys()
const parsers = parsersName.reduce((parsers, module) => {
  const mod = reqParser(module)

  parsers[mod.default.name] = mod.default
  return parsers
}, {})

export { components, parsers }

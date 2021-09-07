import path from 'node:path'
import createEsmUtils from 'esm-utils'
import {TOOLS_DIR} from '../constants.js'
import effectsParser from '../parser/effects.js'
import defaultInstall from '../install/index.js'
import effectDetector from './has-effects.js'
import defaultIsInstalled from './is-installed.js'
import exists from './is-exists.js'

const {require} = createEsmUtils(import.meta)

const helpers = {
  exists,
}

function getToolConfig(directoryName) {
  const directory = path.join(TOOLS_DIR, directoryName)
  const config = require(path.join(directory, 'index.cjs'))

  const {name = directoryName, install = defaultInstall} = config

  const effects = effectsParser(config.effects, directory)

  const isInstalled = (config.isInstalled || defaultIsInstalled)(
    effects,
    helpers,
  )
  const hasEffects = effectDetector(effects)

  return {
    id: directory,
    name,
    directoryName,
    directory,
    effects,
    isInstalled,
    install,
    hasEffects,
  }
}

export default getToolConfig

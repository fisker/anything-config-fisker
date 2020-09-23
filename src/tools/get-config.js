import path from 'path'
import {TOOLS_DIR} from '../constants'
import effectsParser from '../parser/effects'
import effectDetector from './has-effects'
import defaultIsInstalled from './is-installed'
import defaultInstall from '../install'
import exists from './is-exists'

const helpers = {
  exists,
}

function getToolConfig(directoryName) {
  const directory = path.join(TOOLS_DIR, directoryName)
  const config = require(directory)

  const {name = directoryName, install = defaultInstall} = config

  const effects = effectsParser(config.effects, directory)

  const isInstalled = (config.isInstalled || defaultIsInstalled)(
    effects,
    helpers
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

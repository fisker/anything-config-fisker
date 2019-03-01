import {join} from 'path'
import {TOOLS_DIR} from '../constants'
import effectsParser from '../parser/effects'
import effectDector from './has-effects'
import defaultIsInstalled from './is-installed'
import defaultInstall from '../install'
import exists from './is-exists'

const helpers = {
  exists,
}

function getToolConfig(dirName) {
  const dir = join(TOOLS_DIR, dirName)
  const config = require(dir)

  const {name = dirName, install = defaultInstall} = config

  const effects = effectsParser(config.effects, dir)

  const isInstalled = (config.isInstalled || defaultIsInstalled)(
    effects,
    helpers
  )
  const hasEffects = effectDector(effects)

  return {
    id: dir,
    name,
    dirName,
    dir,
    effects,
    isInstalled,
    install,
    hasEffects,
  }
}

export default getToolConfig

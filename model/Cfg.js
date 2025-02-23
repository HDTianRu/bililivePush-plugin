import fs from "fs"
import lodash from "lodash"
import path from "path"
import {
  pluginRoot
} from "../config/constant.js"

const _cfgPath = path.join(pluginRoot, "data")
let _cfg = {}

try {
  if (fs.existsSync(_cfgPath + "cfg.json")) {
    _cfg.user = JSON.parse(fs.readFileSync(path.join(_cfgPath, "cfg.json"), "utf8")) || {}
  } else {
    _cfg.def = JSON.parse(fs.readFileSync(path.join(_cfgPath, "cfg_default.json"), "utf8")) || {}
  }
} catch (e) {
  // do nth
}

const cfg = new Proxy(_cfg, {
  get: (target, prop) => target.user[prop] || target.def[prop]
})

const Cfg = {
  get(rote, def = '') {
    return lodash.get(cfg, rote, def)
  },
  set(rote, val) {
    Cfg._set(rote, val)
    Cfg.fresh()
  },
  _set(rote, val) {
    lodash.set(cfg, rote, val)
  },
  fresh() {
    fs.writeFileSync(path.join(_cfgPath, "cfg.json"), JSON.stringify(cfg, null, "\t"))
  },
  merge() {
    return lodash.merge({}, cfg)
  }
}

export default Cfg
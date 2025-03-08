import fs from "fs"
import lodash from "lodash"
import path from "path"
import {
  pluginRoot
} from "../config/constant.js"

const _cfgPath = path.join(pluginRoot, "data")
let _cfg = {}

try {
  _cfg.def = JSON.parse(fs.readFileSync(path.join(_cfgPath, "cfg_default.json"), "utf8")) || {}
  if (fs.existsSync(path.join(_cfgPath, "cfg.json"))) {
    _cfg.user = JSON.parse(fs.readFileSync(path.join(_cfgPath, "cfg.json"), "utf8")) || {}
  } else {
    _cfg.user = {}
  }
} catch (e) {
  logger.warn("读取配置文件失败", e)
}

const Cfg = {
  get(rote, def = undefined) {
    return lodash.get(_cfg.user, rote) ?? lodash.get(_cfg.def, rote) ?? def
  },
  set(rote, val) {
    Cfg._set(rote, val)
    Cfg.save()
  },
  _set(rote, val) {
    lodash.set(_cfg.user, rote, val)
  },
  save() {
    fs.writeFileSync(path.join(_cfgPath, "cfg.json"), JSON.stringify(_cfg.user, null, "\t"))
  },
  merge() {
    return lodash.merge(_cfg.user, _cfg.def)
  }
}

export default Cfg
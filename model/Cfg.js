import fs from "fs"
import lodash from "lodash"
import {
  join
} from "path"
import {
  pluginRoot
} from "../config/constant.js"

const _cfgPath = join(pluginRoot, "data")
let cfg = {}

const loadConfig = () => {
  let defCfg = {}
  let userCfg = {}
  try {
    defCfg = JSON.parse(fs.readFileSync(join(_cfgPath, "cfg_default.json"), "utf8")) || {}
    if (fs.existsSync(join(_cfgPath, "cfg.json"))) {
      userCfg = JSON.parse(fs.readFileSync(join(_cfgPath, "cfg.json"), "utf8")) || {}
    }
  } catch (e) {
    logger.warn("读取配置文件失败", e)
  }
  cfg = lodash.merge({}, defCfg, userCfg)
  if (cfg.special?.[0]) {
    cfg.override = Object.fromEntries(
      cfg.special.map(({
        key,
        ...rest
      }) => [key, rest])
    )
  }
}

loadConfig()

const watcher = (type) => (type === 'change') ? setTimeout(loadConfig, 1000) : null

fs.watch(join(_cfgPath, "cfg_default.json"), watcher)

if (fs.existsSync(join(_cfgPath, "cfg.json"))) {
  fs.watch(join(_cfgPath, "cfg.json"), watcher)
}

const Cfg = {
  get(rote, def, e) {
    if (!e?.group_id || !cfg.special) return lodash.get(cfg, rote, def)
    const override = lodash.get(cfg, `override.${e.self_id}:${e.group_id}`) ??
      lodash.get(cfg, `override.*:${e.group_id}`) ??
      lodash.get(cfg, `override.${e.self_id}:*`) ?? {}
    return lodash.get(override, rote) ?? lodash.get(cfg, rote, def)
  },
  set(rote, val) {
    Cfg._set(rote, val)
    Cfg.save()
  },
  _set(rote, val) {
    lodash.set(cfg, rote, val)
  },
  save() {
    try {
      fs.writeFileSync(join(_cfgPath, "cfg.json"), JSON.stringify(Cfg.getAll(), null, "\t"))
    } catch (e) {
      logger.warn("保存配置文件失败", e)
    }
  },
  getAll() {
    let data = lodash.cloneDeep(cfg)
    delete data["override"]
    return data
  },
}

export default Cfg
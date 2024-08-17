import Data from './Data.js'
import Bili from './bilibili.js'
import {
  pluginName
} from "../config/constant.js"

const version = 1

// 逻辑还有点问题，暂时能用，下次一定
const _upgrade = async (data) => {
  let new_data = {}
  switch (data.version) {
    case undefined:
      new_data['data'] = {}
      for (let item of Object.values(data)) {
        let {
          uid
        } = await Bili.BApi.getRoomInfo(item.room_id)
        let obj = {
          uid,
          room_id: item.room_id,
          group: item.group
        }
        new_data['data'][uid] = obj
      }
  }
  new_data.version = version
  return new_data
}

const upgrade = async () => {
  let data = Data.readJSON('bilibili/live') || {}
  if (!data) return
  if (data.version >= version) return
  logger.warn(`[${pluginName}] 正在尝试更新数据文件`)
  Data.writeJSON('bilibili/live.backup', data)
  data = await _upgrade(data)
  Data.writeJSON('bilibili/live', data)
  logger.mark(`[${pluginName}] 更新数据文件完成`)
}

export default upgrade
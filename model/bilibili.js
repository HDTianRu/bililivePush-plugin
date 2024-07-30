import Data from './Data.js'
import BApi from './bilibili/BApi.js'

export default class Bili {
  constructor() {}

  getBilibiLiveData() {
    return Data.readJSON('bilibili/live') || {}
  }

  setBilibiLiveData(data) {
    const livedata = this.getBilibiLiveData()
    const {
      room_id,
      group_id,
      user_id
    } = data
    if (!livedata[room_id]) {
      livedata[room_id] = {
        room_id,
        group: {}
      }
    }
    if (!livedata[room_id].group[group_id]) {
      livedata[room_id].group[group_id] = []
    }
    if (!livedata[room_id].group[group_id].includes(user_id)) {
      livedata[room_id].group[group_id].push(user_id)
    }
    Data.writeJSON('bilibili/live', livedata)
  }

  delBilibiLiveData(data) {
    const livedata = this.getBilibiLiveData()
    const {
      room_id,
      group_id,
      user_id
    } = data
    const group = livedata[room_id].group
    if (group[group_id]) {
      group[group_id] = group[group_id].filter(id => id !== user_id)
      if (group[group_id].length === 0) {
        delete group[group_id]
      }
    }
    if (Object.keys(group).length === 0) {
      delete livedata[room_id]
    }
    Data.writeJSON('bilibili/live', livedata)
  }

  async getRoomInfo(room_id) {
    const {
      uid,
      attention,
      online,
      description,
      live_status,
      user_cover,
      live_time,
      title
    } = await BApi.getRoomInfo(room_id)
    const {
      uname,
      face
    } = await BApi.getRoomInfobyUid(uid)
    return {
      uid,
      room_id,
      attention,
      online,
      description,
      live_status,
      user_cover,
      live_time,
      title,
      uname,
      face
    }
  }

  async getRoomInfoByUid(uid) {
    const {
      room_id,
      uname,
      face
    } = await BApi.getRoomInfobyUid(uid)
    const {
      attention,
      online,
      description,
      live_status,
      user_cover,
      live_time,
      title
    } = await BApi.getRoomInfo(room_id)
    return {
      uid,
      room_id,
      attention,
      online,
      description,
      live_status,
      user_cover,
      live_time,
      title,
      uname,
      face
    }
  }
}
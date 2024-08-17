import Data from './Data.js'
import BApi from './bilibili/BApi.js'

class Bili {
  constructor() {
    this.BApi = BApi
  }

  getLiveData() {
    return Data.readJSON('bilibili/live') || {}
  }

  setLiveData(data) {
    const fullData = this.getLiveData()
    const livedata = fullData?.data
    const {
      room_id,
      uid,
      group_id,
      user_id
    } = data
    if (!livedata[uid]) {
      livedata[uid] = {
        uid,
        group: {}
      }
    }
    if (!livedata[uid].group[group_id]) {
      livedata[uid].group[group_id] = []
    }
    if (!livedata[uid].group[group_id].includes(user_id)) {
      livedata[uid].group[group_id].push(user_id)
    }
    fullData.data = livedata
    Data.writeJSON('bilibili/live', fullData)
  }

  delLiveData(data) {
    const fullData = this.getLiveData()
    const livedata = fullData?.data
    const {
      room_id,
      uid,
      group_id,
      user_id
    } = data
    const group = livedata[uid].group
    if (group[group_id]) {
      group[group_id] = group[group_id].filter(id => id !== user_id)
      if (group[group_id].length === 0) {
        delete group[group_id]
      }
    }
    if (Object.keys(group).length === 0) {
      delete livedata[uid]
    }
    fullData.data = livedata
    Data.writeJSON('bilibili/live', fullData)
  }

  listLiveData(data) {
    const {
      group_id,
      user_id
    } = data
    const byGroup = (group_id) => {
      const livedata = this.getLiveData()?.data
      const result = []
      for (const [room_id, uid, roomData] of Object.entries(livedata)) {
        if (roomData.group && roomData.group[group_id]) {
          result.push({
            room_id,
            uid,
            users: roomData.group[group_id]
          })
        }
      }
      return result
    }
    const byUser = (user_id) => {
      const livedata = this.getLiveData()?.data
      const result = []
      for (const [room_id, roomData] of Object.entries(livedata)) {
        if (roomData.group) {
          const groupsInRoom = []
          for (const [group_id, uid, users] of Object.entries(roomData.group)) {
            if (users.includes(user_id)) {
              groupsInRoom.push(group_id)
            }
          }
          if (groupsInRoom.length > 0) {
            result.push({
              room_id,
              uid,
              groups: groupsInRoom
            })
          }
        }
      }
      return result
    }
    if (group_id) return byGroup(group_id)
    if (user_id) return byUser(user_id)
    return false
  }

  async getRoomInfo(room_id) {
    const {
      uid,
      attention,
      online,
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
      live_status,
      user_cover,
      live_time,
      title,
      uname,
      face
    }
  }
}

export default new Bili()
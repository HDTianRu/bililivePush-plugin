import fetch from "node-fetch"

class BApi {
  async getRoomInfo(room_id) {
    const response = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room_id}`, {
      headers: {},
    })
    const res = await response.json()
    if (res.code !== 0) {
      logger.error(res.msg || res.message)
      return false
    }
    const {
      uid,
      online,
      live_status,
      user_cover,
      live_time,
      title
    } = res.data
    return {
      uid,
      room_id,
      online,
      live_status,
      user_cover,
      live_time,
      title
    }
  }

  async getRoomInfobyUid(uid) {
    const response = await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${uid}`, {
      headers: {},
    })
    const res = await response.json()
    if (res.code !== 0) {
      logger.error(res.msg || res.message)
      return false
    }
    const {
      room_id,
      info
    } = res.data
    const {
      uname,
      face
    } = info
    return {
      uid,
      room_id,
      uname,
      face
    }
  }
  
  async getRoomInfobyUidNew(uid) {
    return (await this.getRoomInfobyUids([uid]))?.[uid]
  }
  
  async getRoomInfobyUids(uids) {
    const params = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'uids': uids.map(item => parseInt(item))
      })
    }
    const response = await fetch('https://api.live.bilibili.com/room/v1/Room/get_status_info_by_uids', params)
    const res = await response.json()
    if (res.code !== 0) {
      logger.error(res.msg || res.message)
      return false
    }
    return res.data
  }
}

export default new BApi()
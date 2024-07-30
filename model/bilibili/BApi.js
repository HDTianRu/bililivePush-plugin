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
      attention,
      online,
      live_status,
      user_cover,
      live_time,
      title
    } = res.data
    return {
      uid,
      room_id,
      attention,
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
}

export default new BApi()
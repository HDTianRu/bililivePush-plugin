import networks from "../networks.js"


class BApi {
  async getRoomInfo(room_id, ck) {
    return new Promise(async (resolve, reject) => {
      new networks( {
        url: `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room_id}`, headers: {
          cookie: ck
        }, type: 'json'
      }).getData().then(res => {
        if (res.code == 0) {
          let {
            uid,
            room_id,
            attention,
            online,
            description,
            live_status,
            user_cover,
            live_time,
            title
          } = res.data
          resolve( {
            uid, room_id, attention, online, description, live_status, user_cover, live_time, title
          })
        } else {
          resolve(res)
        }
      })
    })
  }

  async getRoomInfobyMid(mid) {
    return new Promise(async (resolve,
      reject) => {
      new networks( {
        url: `https://api.live.bilibili.com/live_user/v1/Master/info?uid=${mid}`,
        headers: {},
        type: 'json'
      }).getData().then(res => {
        if (res.code == 0) {
          resolve( {
            room_id: res.data.room_id
          })
        } else {
          resolve(res)
        }
      })
    })
  }
}

export default new BApi()
import networks from "../networks.js"


class BApi {
    async getRoomInfo(room_id, ck) {
        return new Promise(async (resolve, reject) => {
            new networks({
                url: `https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room_id}`, headers: {
                    Cooke: ck
                }, type: 'json'
            }).getData().then(res => {
                if (res.code == 0) {
                    let { uid, room_id, attention, online, description, live_status, user_cover, live_time, title } = res.data
                    resolve({ uid, room_id, attention, online, description, live_status, user_cover, live_time, title })
                } else {
                    resolve(res)
                }
            })
        })
    }
}

export default new BApi()

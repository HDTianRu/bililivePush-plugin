import fetch from "node-fetch";

class BApi {
  async getRoomInfo(room_id) {
    try {
      const response = await fetch(`https://api.live.bilibili.com/room/v1/Room/get_info?room_id=${room_id}`, {
        headers: {},
      });
      const res = await response.json();
      if (res.code === 0) {
        const {
          uid,
          room_id,
          attention,
          online,
          description,
          live_status,
          user_cover,
          live_time,
          title
        } = res.data;
        return {
          uid, room_id, attention, online, description, live_status, user_cover, live_time, title
        };
      } else {
        return res;
      }
    } catch (error) {
      logger.error(error);
      return false;
    }
  }

  async getRoomInfobyMid(mid) {
    try {
      const response = await fetch(`https://api.live.bilibili.com/live_user/v1/Master/info?uid=${mid}`, {
        headers: {},
      });
      const res = await response.json();
      if (res.code === 0) {
        return {
          room_id: res.data.room_id
        };
      } else {
        return res;
      }
    } catch (error) {
      logger.error(error);
      return false;
    }
  }
}

export default new BApi();

import Bili from '../model/bilibili.js'
import moment from 'moment'
import common from '../../../lib/common/common.js'

export default class bilibili extends plugin {
  constructor(e) {
    super({
      name: 'bilibili',
      priority: 25,
      rule: [{
        reg: '^#(全体)?订阅直播间',
        fnc: 'setLivePush'
      },
        {
          reg: '^#(全体)?取消订阅直播间',
          fnc: 'delLivePush'
        },
        {
          reg: '^#(全体)?订阅(up|UP|Up)(uid:|UID:)?',
          fnc: 'setLivePushByUid'
        },
        {
          reg: '^#(全体)?取消订阅(up|UP|Up)(uid:|UID:)?',
          fnc: 'delLivePushByUid'
        },
        {
          reg: '^#(本?群|我的?)订阅(列表|list)?',
          fnc: 'listLivePush'
        }]
    })
    this.task = {
      name: 'bililivePush',
      fnc: () => this.livepush(),
      cron: '10 */1 * * * *',
      log: false
    },
    this.e = e
  }

  async listLivePush(e) {
    let ret,
    key
    let msg = []
    if (/.*群.*/.test(e.msg)) {
      ret = Bili.listLiveData({
        group_id: e.group_id
      })
      key = 'users'
    } else if (/.*我.*/.test(e.msg)) {
      ret = Bili.listLiveData({
        user_id: e.user_id
      })
      key = 'groups'
    }
    for (const item of ret) {
      let {
        uid,
        attention,
        uname,
        face
      } = await Bili.getRoomInfo(item.room_id)
      msg.push([segment.image(face), `昵称: ${uname}\n`, `用户uid${uid}\n`, `粉丝: ${attention}\n`, `订阅${key}:\n${item[key].join('\n')}`])
    }
    msg = await common.makeForwardMsg(e, msg)
    e.reply(msg)
    return true
  }

  async setLivePush(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    let room_id = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(room_id)) {
      return e.reply("直播间id格式不对！请输入数字！")
    }
    let result = await Bili.getRoomInfo(room_id)
    if (!result?.uid) {
      return e.reply("不存在该直播间！")
    }
    let data = {
      room_id: room_id,
      group_id: e.group_id,
      user_id: e.user_id
    }
    Bili.setLiveData(data)
    return e.reply("直播间订阅成功！")
  }

  async delLivePush(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    let room_id = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(room_id)) {
      return e.reply("直播间id格式不对！请输入数字！")
    }
    let result = Bili.getLiveData()

    if (!result[room_id]?.group[e.group_id]?.includes(e.user_id)) {
      return e.reply("你还没有订阅该直播间！")
    }

    Bili.delLiveData({
      room_id: room_id,
      group_id: e.group_id,
      user_id: e.user_id
    })
    return e.reply("取消直播间订阅成功！")
  }

  async setLivePushByUid(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    let uid = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(uid)) {
      return e.reply("uid格式不对！请输入数字！")
    }
    let room_id = (await Bili.getRoomInfoByUid(uid)).room_id
    if (!room_id) {
      return e.reply("不存在该直播间！")
    }
    let data = {
      room_id: room_id,
      group_id: e.group_id,
      user_id: e.user_id
    }
    Bili.setLiveData(data)
    return e.reply("直播间订阅成功！")
  }

  async delLivePushByUid(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    let uid = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(uid)) {
      return e.reply("uid格式不对！请输入数字！")
    }
    let room_id = (await Bili.getRoomInfoByUid(uid)).room_id
    let result = Bili.getLiveData()
    if (!result[room_id]?.group[e.group_id]?.includes(e.user_id)) {
      return e.reply("你还没有订阅该直播间！")
    }

    Bili.delLiveData({
      room_id: room_id,
      group_id: e.group_id,
      user_id: e.user_id
    })
    return e.reply("取消直播间订阅成功！")
  }

  async livepush() {
    const liveData = Object.values(Bili.getLiveData())

    const sendLiveStartMessage = async (groupId, userIds, roomInfo) => {
      const {
        room_id,
        user_cover,
        uname,
        title,
        uid,
        attention,
        online,
        live_time
      } = roomInfo
      const userMentions = userIds.map(item => segment.at(item))
      const message = [
        ...userMentions,
        segment.image(user_cover),
        `昵称: ${uname}\n`,
        `标题: ${title}\n`,
        `用户uid: ${uid}\n`,
        `关注数量: ${attention}\n`,
        `观看人数: ${online}\n`,
        `直播时间: ${live_time}\n`,
        `直播间地址: https://live.bilibili.com/${room_id}`
      ]
      await Bot.pickGroup(Number(groupId)).sendMsg(message)
    }

    const sendLiveEndMessage = async (groupId, roomInfo, savedInfo) => {
      const { user_cover } = roomInfo
      const liveDuration = this.getDealTime(moment(savedInfo.live_time), moment())
      const message = [
        segment.image(user_cover),
        '主播下播la~~~~\n',
        `本次直播时长: ${liveDuration}`
      ]
      await Bot.pickGroup(Number(groupId)).sendMsg(message)
    }

    for (const { room_id, group } of liveData) {
      const roomInfo = await Bili.getRoomInfo(room_id)
      const {
        uid,
        attention,
        online,
        live_status,
        user_cover,
        live_time,
        title,
        uname,
        face
      } = roomInfo

      for (const [groupId, userIds] of Object.entries(group)) {
        const redisKey = `bilibili_live_${room_id}_${groupId}`
        const isSendMsg = await redis.get(redisKey)

        if (live_status == 1 && !isSendMsg) {
          await sendLiveStartMessage(groupId, userIds, roomInfo)
          await redis.set(redisKey, JSON.stringify({
            live_time
          }))
        } else if (live_status == 0 && isSendMsg) {
          await sendLiveEndMessage(groupId, roomInfo, JSON.parse(isSendMsg))
          await redis.del(redisKey)
        }
      }
    }
  }

  getDealTime(stime, etime) {
    let str = ''
    let dura = etime.format('x') - stime.format('x')
    let tempTime = moment.duration(dura)
    str += tempTime.years() ? tempTime.years() + '年': ''
    str += tempTime.months() ? tempTime.months() + '月': ''
    str += tempTime.days() ? tempTime.days() + '日': ''
    str += tempTime.hours() ? tempTime.hours() + '小时': ''
    str += tempTime.minutes() ? tempTime.minutes() + '分钟': ''
    return str
  }
}
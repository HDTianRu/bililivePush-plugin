import Bili from '../model/bilibili.js'
import moment from 'moment'
import common from '../../../lib/common/common.js'

export default class bilibili extends plugin {
  constructor(e) {
    super({
      name: 'bilibili',
      priority: 25,
      rule: [{
        reg: '^#?(绝区零|星铁)?(全体|匿名)?订阅直播间',
        fnc: 'setLivePush'
      },
        {
          reg: '^#?(绝区零|星铁)?(全体|匿名)?取消订阅直播间',
          fnc: 'delLivePush'
        },
        {
          reg: '^#?(绝区零|星铁)?(全体|匿名)?订阅(up|UP|Up|uid:|UID:)+',
          fnc: 'setLivePushByUid'
        },
        {
          reg: '^#?(绝区零|星铁)?(全体|匿名)?取消订阅(up|UP|Up|uid:|UID:)+',
          fnc: 'delLivePushByUid'
        },
        {
          reg: '^#?(绝区零|星铁)?(本?群|我的?)订阅(列表|list)?',
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
    let ret, key
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
    ret = await Bili.setRoomInfo(ret)
    for (const { uid, uname, face, ...item } of ret) {
      msg.push([
        segment.image(face),
        `昵称: ${uname}\n`,
        `用户uid: ${uid}\n`,
        `订阅${key}:\n${item[key].map(item => (item == 99999) ? '匿名' : item).join('\n')}`
      ])
    }
    msg = !!msg.length ? await common.makeForwardMsg(e, msg) : '无'
    e.reply(msg)
    return true
  }

  async setLivePush(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    if (/.*匿名.*/.test(e.msg)) e.user_id = 99999
    let room_id = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(room_id)) {
      return e.reply("直播间id格式不对！请输入数字！")
    }
    let {uid, face, uname} = await Bili.getRoomInfo(room_id)
    if (!uid) {
      return e.reply("不存在该直播间！")
    }
    let data = {
      room_id,
      uid,
      group_id: e.group_id,
      user_id: e.user_id
    }
    Bili.setLiveData(data)
    return e.reply([segment.image(face), `${uname}直播间订阅成功！`])
  }

  async delLivePush(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    if (/.*匿名.*/.test(e.msg)) e.user_id = 99999
    let room_id = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(room_id)) {
      return e.reply("直播间id格式不对！请输入数字！")
    }
    let data = Bili.getLiveData()?.data
    let {uid} = await Bili.getRoomInfo(room_id)
    if (!data[uid]?.group[e.group_id]?.includes(e.user_id)) {
      return e.reply("你还没有订阅该直播间！")
    }

    Bili.delLiveData({
      uid,
      group_id: e.group_id,
      user_id: e.user_id
    })
    return e.reply("取消直播间订阅成功！")
  }

  async setLivePushByUid(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    if (/.*匿名.*/.test(e.msg)) e.user_id = 99999
    let uid = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(uid)) {
      return e.reply("uid格式不对！请输入数字！")
    }
    let {room_id, face, uname} = await Bili.getRoomInfoByUid(uid)
    if (!room_id) {
      return e.reply("不存在该直播间！")
    }
    let data = {
      room_id,
      uid,
      group_id: e.group_id,
      user_id: e.user_id
    }
    Bili.setLiveData(data)
    return e.reply([segment.image(face), `${uname}直播间订阅成功！`])
  }

  async delLivePushByUid(e) {
    if (/.*全体.*/.test(e.msg)) e.user_id = 0
    if (/.*匿名.*/.test(e.msg)) e.user_id = 99999
    let uid = /[0-9]+/.exec(e.msg)[0]
    if (isNaN(uid)) {
      return e.reply("uid格式不对！请输入数字！")
    }
    let result = Bili.getLiveData()?.data
    if (!result[uid]?.group[e.group_id]?.includes(e.user_id)) {
      return e.reply("你还没有订阅该直播间！")
    }

    Bili.delLiveData({
      uid,
      group_id: e.group_id,
      user_id: e.user_id
    })
    return e.reply("取消直播间订阅成功！")
  }

  async livepush() {
    let liveData = Object.values(Bili.getLiveData()?.data)
    liveData = await Bili.setRoomInfo(liveData)

    const sendLiveStartMessage = async (groupId, userIds, roomInfo) => {
      const {
        room_id,
        cover_from_user,
        uname,
        title,
        uid,
        online,
        live_time,
        area_v2_parent_name,
        area_v2_name
      } = roomInfo
      const userMentions = userIds.filter(item => item != 99999).map(item => segment.at(item == 0 ? 'all' : item))
      const message = [
        ...userMentions,
        segment.image(cover_from_user),
        `昵称: ${uname}\n`,
        `用户uid: ${uid}\n`,
        `标题: ${title}\n`,
        `分区: ${area_v2_parent_name}-${area_v2_name}\n`,
        `历史人次: ${online}\n`,
        `开播时间: ${moment(live_time).format('YYYY-MM-DD HH:mm:ss')}\n`,
        `直播间地址: https://live.bilibili.com/${room_id}`
      ]
      Bot.pickGroup(Number(groupId)).sendMsg(message)
    }

    const sendLiveEndMessage = async (groupId, roomInfo, liveDuration) => {
      const { cover_from_user } = roomInfo
      const message = [
        segment.image(cover_from_user),
        '主播下播la~~~~\n',
        `本次直播时长: ${liveDuration}`
      ]
      Bot.pickGroup(Number(groupId)).sendMsg(message)
    }

    for (const { group, ...roomInfo } of liveData) {
      roomInfo.live_time *= 1000
      const { room_id, live_status } = roomInfo
      const redisKey = `bililive_${room_id}`
      const data = await redis.get(redisKey)

      if (live_status === 1 && !data) {
        const { live_time } = roomInfo
        redis.set(redisKey, JSON.stringify({
          live_time
        }))

        for (const [groupId, userIds] of Object.entries(group)) {
          sendLiveStartMessage(groupId, userIds, roomInfo)
        }
      } else if (live_status != 1 && data) {
        const { live_time } = JSON.parse(data)
        const liveDuration = this.getDealTime(moment(live_time), moment())

        for (const [groupId] of Object.entries(group)) {
          sendLiveEndMessage(groupId, roomInfo, liveDuration)
        }

        redis.del(redisKey)
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
    if (dura <= 5*60*1000) str += `\n(没关系的, ${str}也很厉害了)`
    return str
  }
}
import Bili from '../model/bilibili.js'
import moment from 'moment'

export default class bilibili extends plugin {
    constructor(e) {
        super({
            name: 'bilibili',
            priority: 25,
            rule: [
                {
                    reg: '^#(强制)?设置b站ck',
                    fnc: 'setCk'
                },
                {
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
                }

            ]
        })
        this.task = {
                name: 'bililivePush',
                fnc: () => this.livepush(),
                cron: '10 */1 * * * *'
            },
        this.e = e
        this.bili = new Bili()
    }


    async setCk(e) {
        if (!e.isMaster) return true
        if (e.isGroup && !e.msg.includes("强制")) {
            e.reply("请私聊发送cookie")
            return true
        }
        e.reply("请发送b站cookie")
        this.setContext('getBcookie', true, 120)
    }

    async getBcookie() {
        this.finish('getBcookie')
        let msg = this.e.msg
        if (!(msg && msg.includes("SESSDATA")) ){
            this.e.reply("cookie格式不正确!")
            return true
        }
        this.bili.setCK(msg)
        this.e.reply("cookie设置成功!")
    }

    async setLivePush(e) {
        if (/.*全体.*/.test(e.msg)) e.user_id = 0
        let room_id = /[0-9]+/.exec(e.msg)[0]
        if (isNaN(room_id)) {
            return e.reply("直播间id格式不对！请输入数字！")
        }
        let result = await this.bili.getRoomInfo(room_id)
        if (!result?.uid) {
            return e.reply("不存在该直播间！")
        }
        let data = {
            room_id: room_id,
            group_id: e.group_id,
            user_id: e.user_id
        }
        this.bili.setBilibiLiveData(data)
        return e.reply("直播间订阅成功！")
    }
    
    async delLivePush(e) {
        if (/.*全体.*/.test(e.msg)) e.user_id = 0
        let room_id = /[0-9]+/.exec(e.msg)[0]
        if (isNaN(room_id)) {
            return e.reply("直播间id格式不对！请输入数字！")
        }
        let result = this.bili.getBilibiLiveData()

        if (!result[room_id] || !result[room_id].group[e.group_id] || !result[room_id].group[e.group_id].includes(e.user_id)) {
            return e.reply("你还没有订阅该直播间！")
        }

        this.bili.delBilibiLiveData({
            room_id: room_id,
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
        let room_id = (await this.bili.getRoomInfoByUid(uid)).room_id
        let result = await this.bili.getRoomInfo(room_id)
        if (!result?.uid) {
            return e.reply("不存在该直播间！")
        }
        let data = {
            room_id: room_id,
            group_id: e.group_id,
            user_id: e.user_id
        }
        this.bili.setBilibiLiveData(data)
        return e.reply("直播间订阅成功！")
    }
    
    async delLivePushByUid(e) {
        if (/.*全体.*/.test(e.msg)) e.user_id = 0
        let uid = /[0-9]+/.exec(e.msg)[0]
        if (isNaN(uid)) {
            return e.reply("uid格式不对！请输入数字！")
        }
        let room_id = (await this.bili.getRoomInfoByUid(uid)).room_id
        let result = this.bili.getBilibiLiveData()
        if (!result[room_id] || !result[room_id].group[e.group_id] || !result[room_id].group[e.group_id].includes(e.user_id)) {
            return e.reply("你还没有订阅该直播间！")
        }

        this.bili.delBilibiLiveData({
            room_id: room_id,
            user_id: e.user_id
        })
        return e.reply("取消直播间订阅成功！")
    }

    async livepush() {
        let liveData = this.bili.getBilibiLiveData()
        liveData = Object.values(liveData)
        for (let l of liveData) {
            let room_id = l.room_id
            let { uid, attention, online, live_status, user_cover, live_time, title } = await this.bili.getRoomInfo(room_id)
            let grouplist = Object.keys(l.group)
            for (let g of grouplist) {
                let isSendMsg = await redis.get(`bilibili_live_${room_id}_${g}`)
                if (live_status == 1 && !isSendMsg) {
                    let userlist = l.group[g].map(item => segment.at(item))
                    redis.set(`bilibili_live_${room_id}_${g}`, JSON.stringify({ live_time: live_time }))
                    Bot.pickGroup(Number(g)).sendMsg([...userlist, segment.image(user_cover), `标题：${title}\n`, `用户uid：${uid}\n`, `关注数量：${attention}\n`, `观看人数: ${online}\n`, `直播时间：${live_time}\n`, `直播间地址：https://live.bilibili.com/${room_id}`])
                } else if (live_status == 0 && isSendMsg) {
                    isSendMsg = JSON.parse(isSendMsg)
                    Bot.pickGroup(Number(g)).sendMsg([segment.image(user_cover), '主播下播la~~~~\n', `本次直播时长：${this.getDealTime(moment(isSendMsg.live_time), moment())}`])
                    redis.del(`bilibili_live_${room_id}_${g}`)
                }
            }
        }
    }

    getDealTime(stime, etime) {
        let str = ''
        let dura = etime.format('x') - stime.format('x');
        let tempTime = moment.duration(dura);
        str += tempTime.years() ? tempTime.years() + '年' : ''
        str += tempTime.months() ? tempTime.months() + '月' : ''
        str += tempTime.days() ? tempTime.days() + '日' : ''
        str += tempTime.hours() ? tempTime.hours() + '小时' : ''
        str += tempTime.minutes() ? tempTime.minutes() + '分钟' : ''
        return str
    }


}

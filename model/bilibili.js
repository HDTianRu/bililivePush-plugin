import Data from './Data.js'
import BApi from './bilibili/BApi.js'

export default class Bili {
    constructor() {
      this.ck = Data.read('bilibili/biliCK')
    }

    setCK(data){
      Data.write('bilibili/biliCK',data)
      this.ck = data
    }
    
    getCK(){
      this.ck = Data.read('bilibili/biliCK')
      return this.ck
    }

    setBilibiLiveData(data) {
        let livedata = this.getBilibiLiveData()
        if (livedata[data.room_id]) {
            livedata[data.room_id] = {
                room_id: data.room_id,
            }
            if (livedata[data.room_id].group != null && Object.keys(livedata[data.room_id].group).includes(data.group_id)) {
                livedata[data.room_id].group[data.group_id] = [...livedata[data.room_id].group[data.group_id], data.user_id]
            } else {
                livedata[data.room_id].group = {}
                livedata[data.room_id].group[data.group_id] = [data.user_id]
            }
        } else {
            livedata[data.room_id] = {
                room_id: data.room_id,
                group: {}
            }
            livedata[data.room_id].group[data.group_id] = [data.user_id]
        }
        Data.writeJSON('bilibili/live', livedata)
    }

    getBilibiLiveData() {
        return Data.readJSON('bilibili/live') || {}
    }

    delBilibiLiveData(data) {
        let livedata = this.getBilibiLiveData()
        let groupList = Object.keys(livedata[data.room_id].group)
        let group = livedata[data.room_id].group
        if (groupList.length == 1 && group[groupList[0]].length == 1 && group[groupList[0]][0] === data.user_id) {
            delete livedata[data.room_id]
            groupList = []
        }
        for (let r of groupList) {
            if (group[r].length == 1 && group[r][0] === data.user_id) {
                delete livedata[data.room_id].group[r]
            } else {
                livedata[data.room_id].group[r] = group[r].filter(item => item !== data.user_id)
            }
        }
        Data.writeJSON('bilibili/live', livedata)
    }

    async getRoomInfo(room_id) {
        return await BApi.getRoomInfo(room_id, this.ck ? this.ck : this.getCK())
    }
}

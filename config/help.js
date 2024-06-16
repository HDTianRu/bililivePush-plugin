import {pluginName} from "./constant.js"

export const helpCfg = {
  title: '推送帮助',
  subTitle: pluginName,
  columnCount: 3,
  colWidth: 265,
  theme: 'all',
  themeExclude: [/*'default'*/],
  style: {
    fontColor: '#d3bc8e',
    descColor: '#eee',
    contBgColor: 'rgba(6, 21, 31, .5)',
    contBgBlur: 3,
    headerBgColor: 'rgba(6, 21, 31, .4)',
    rowBgColor1: 'rgba(6, 21, 31, .2)',
    rowBgColor2: 'rgba(6, 21, 31, .35)'
  }
}

export const helpList = [{
  group: '"[]"内为必填项,"{}"内为可选项,"|"表选择'
  }, {
  group: '订阅命令',
  list: [{
    icon: 71,
    title: '#[订阅|取消订阅]UP[UP的uid]',
    desc: '如题(一般用这个)'
  }, {
    icon: 71,
    title: '#[订阅|取消订阅]直播间[直播间room_id]',
    desc: '如题'
  }, {
    icon: 74,
    title: 'Tips',
    desc: '如需艾特全体，指令前加"全体"二字'
  }]
}, {
  group: '管理命令，仅主人可用',
  list: [{
    icon: 132,
    title: '#设置b站ck',
    desc: '私聊使用，设置SESSDATA'
  }, {
    icon: 85,
    title: '#(强制)更新推送插件',
    desc: '更新插件本体(还没做)'
  }]
}]
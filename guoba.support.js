import path from 'path'
import lodash from 'lodash'
import Cfg from './model/Cfg.js'

export function supportGuoba() {
  return {
    pluginInfo: {
      name: 'bililivePush-plugin',
      title: 'bililivePush-plugin',
      author: '@天如',
      authorLink: 'https://gitee.com/HDTianRu',
      link: 'https://gitee.com/HDTianRu/bililivePush-plugin',
      isV3: true,
      isV2: false,
      description: '当然是推送b站直播啦',
      icon: 'mdi:stove',
      iconColor: '#6bb9dd',
    },
    configInfo: {
      schemas: [{
        field: 'user.sleep',
        label: '群发间隔',
        bottomHelpMessage: '推送给多个群时间隔的时间(单位秒)',
        component: "InputNumber",
          componentProps: {
            placeholder: "请输入间隔时间"
          }
      }],
      getConfigData() {
        return Cfg.merge()
      },
      setConfigData(data, {
        Result
      }) {
        for (let [keyPath, value] of Object.entries(data)) {
          Cfg._set(keyPath, value)
        }
        Cfg.fresh()
        return Result.ok({}, '保存成功~')
      },
    },
  }
}
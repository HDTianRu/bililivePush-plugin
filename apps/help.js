import lodash from 'lodash'
import fs from 'fs'
import path from "path"
import render from "../model/render.js"
import HelpTheme from './help/HelpTheme.js'
import {helpCfg, helpList} from "../config/help.js"
import {pluginResources} from "../config/constant.js"

const helpPath = path.join(pluginResources,"help")

export class help extends plugin {
	constructor() {
		super({
			name: '[推送插件]帮助',
			dsc: '推送帮助',
			event: 'message',
			priority: 100,
			rule: [
				{
					reg: "^#?((B|b)ili)*(推送|(P|p)ush)(命令|帮助|菜单|help|说明|功能|指令|使用说明)$",
					fnc: 'help'
				}
			]
		})
	}

	async help (e) {
	  let helpGroup = []
	
	  lodash.forEach(helpList, (group) => {
	    if (group.auth && group.auth === 'master' && !e.isMaster) {
	      return true
	    }
	
	    lodash.forEach(group.list, (help) => {
	      let icon = help.icon * 1
	      if (!icon) {
	        help.css = 'display:none'
	      } else {
	        let x = (icon - 1) % 10
	        let y = (icon - x - 1) / 10
	        help.css = `background-position:-${x * 50}px -${y * 50}px`
	      }
	    })
	
	    helpGroup.push(group)
	  })
	  let themeData = await HelpTheme.getThemeData(helpCfg)
	  return await render('help/index', {
	    helpCfg: helpCfg,
	    helpGroup,
	    ...themeData,
	    element: 'default'
	  }, { e, scale: 1.2 })
	}
}

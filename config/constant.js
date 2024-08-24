import path from 'path'

const _join = path.join
if ((typeof isV4) === "boolean" && isV4) {
	path.join = (...args) => _join(
	  ...args,
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..',
	  '柠檬冲水/../柠檬冲水/../柠檬冲水/..'
	  //在柠檬佬里进进出出❤️
	)
}

const _path = process.cwd().replace(/\\/g, '/')

const pluginName = path.basename(path.join(import.meta.url, '../../'))
const pluginRoot = path.join(_path, 'plugins', pluginName)
const pluginResources = path.join(pluginRoot, 'resources')
const pluginApplications = path.join(pluginRoot, 'apps')

export {
  _path,
  pluginName,
  pluginRoot,
  pluginResources,
  pluginApplications,
}
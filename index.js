import { readFileSync } from 'node:fs'
import { homedir } from 'node:os'
import { join, isAbsolute } from 'node:path'

export { resolveDevToolsActivePort }
export default resolveDevToolsActivePort

const BROWSER_DIRS = {
	chrome: {
		darwin: ['Library/Application Support/Google/Chrome'],
		linux: ['google-chrome'],
		win32: ['Google/Chrome/User Data']
	},
	canary: {
		darwin: ['Library/Application Support/Google/Chrome Canary'],
		linux: ['google-chrome-unstable', 'google-chrome-canary'],
		win32: ['Google/Chrome SxS/User Data']
	},
	chromium: {
		darwin: ['Library/Application Support/Chromium'],
		linux: ['chromium', 'snap/chromium/common/chromium'],
		win32: ['Chromium/User Data']
	},
	edge: {
		darwin: [
			'Library/Application Support/Microsoft Edge',
			'Library/Application Support/Microsoft Edge Canary',
			'Library/Application Support/Microsoft Edge Dev',
			'Library/Application Support/Microsoft Edge Beta'
		],
		linux: ['microsoft-edge', 'microsoft-edge-dev', 'microsoft-edge-beta'],
		win32: [
			'Microsoft/Edge/User Data',
			'Microsoft/Edge Canary/User Data',
			'Microsoft/Edge Dev/User Data'
		]
	},
	brave: {
		darwin: [
			'Library/Application Support/BraveSoftware/Brave-Browser',
			'Library/Application Support/BraveSoftware/Brave-Browser-Nightly',
			'Library/Application Support/BraveSoftware/Brave-Browser-Beta',
			'Library/Application Support/BraveSoftware/Brave-Browser-Dev'
		],
		linux: [
			'BraveSoftware/Brave-Browser',
			'BraveSoftware/Brave-Browser-Nightly',
			'BraveSoftware/Brave-Browser-Beta'
		],
		win32: ['BraveSoftware/Brave-Browser/User Data']
	},
	arc: {
		darwin: ['Library/Application Support/Arc/User Data'],
		win32: ['Arc/User Data']
	},
	vivaldi: {
		darwin: ['Library/Application Support/Vivaldi'],
		linux: ['vivaldi'],
		win32: ['Vivaldi/User Data']
	},
	opera: {
		darwin: [
			'Library/Application Support/com.operasoftware.Opera',
			'Library/Application Support/com.operasoftware.OperaGX'
		],
		linux: ['opera'],
		win32: [
			'Opera Software/Opera Stable',
			'Programs/Opera GX'
		]
	}
}

function normalizeBrowser (name) {
	if (!name || typeof name !== 'string') return ''
	const key = name.toLowerCase().replace(/[^a-z0-9]/g, '')
	const aliases = {
		googlechrome: 'chrome',
		chromecanary: 'canary',
		chromesxs: 'canary',
		microsoftedge: 'edge',
		msedge: 'edge',
		bravebrowser: 'brave',
		operagx: 'opera'
	}
	return aliases[key] || key
}

function getBaseDirs (platform, home) {
	if (platform === 'darwin') return [home]
	if (platform === 'linux') {
		const config = process.env.XDG_CONFIG_HOME || join(home, '.config')
		return [config, home]
	}
	if (platform === 'win32') {
		const local = process.env.LOCALAPPDATA || join(home, 'AppData/Local')
		const roaming = process.env.APPDATA || join(home, 'AppData/Roaming')
		return [local, roaming]
	}
	return [home]
}

function readActivePortFile (filePath) {
	if (!filePath) return null
	try {
		const content = readFileSync(filePath, 'utf-8').trim().split('\n')
		if (content.length >= 2) {
			const port = parseInt(content[0].trim(), 10)
			if (!isNaN(port)) {
				return { port, path: content[1].trim() }
			}
		}
	} catch (e) {}
	return null
}

function getBrowserPaths (browser) {
	const key = normalizeBrowser(browser)
	const entry = BROWSER_DIRS[key]
	if (!entry) return []
	const platform = process.platform
	const home = homedir()
	const subpaths = entry[platform] || []
	const bases = getBaseDirs(platform, home)
	const paths = []
	for (const sub of subpaths) {
		if (isAbsolute(sub)) {
			paths.push(sub)
		} else {
			for (const base of bases) {
				paths.push(join(base, sub))
			}
		}
	}
	return paths
}

function resolveDevToolsActivePort (opts = {}) {
	if (typeof opts === 'string') opts = { browser: opts }
	if (opts.userDataDir) {
		return readActivePortFile(join(opts.userDataDir, 'DevToolsActivePort'))
	}
	const browsers = opts.browser ? [opts.browser] : ['chrome', 'canary', 'chromium', 'edge', 'brave', 'arc', 'vivaldi', 'opera']
	for (const b of browsers) {
		for (const dir of getBrowserPaths(b)) {
			const res = readActivePortFile(join(dir, 'DevToolsActivePort'))
			if (res) return res
		}
	}
	return null
}

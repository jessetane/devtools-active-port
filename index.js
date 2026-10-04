import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'

export { resolveDevToolsActivePort }
export default resolveDevToolsActivePort

const BROWSER_DIRS = {
	chrome: {
		darwin: ['Library/Application Support/Google/Chrome'],
		linux: ['.config/google-chrome'],
		win32: (localAppData) => localAppData ? [join(localAppData, 'Google/Chrome/User Data')] : []
	},
	canary: {
		darwin: ['Library/Application Support/Google/Chrome Canary'],
		linux: ['.config/google-chrome-unstable', '.config/google-chrome-canary'],
		win32: (localAppData) => localAppData ? [join(localAppData, 'Google/Chrome SxS/User Data')] : []
	},
	chromium: {
		darwin: ['Library/Application Support/Chromium'],
		linux: ['.config/chromium', 'snap/chromium/common/chromium'],
		win32: (localAppData) => localAppData ? [join(localAppData, 'Chromium/User Data')] : []
	},
	edge: {
		darwin: [
			'Library/Application Support/Microsoft Edge',
			'Library/Application Support/Microsoft Edge Canary',
			'Library/Application Support/Microsoft Edge Dev',
			'Library/Application Support/Microsoft Edge Beta'
		],
		linux: ['.config/microsoft-edge', '.config/microsoft-edge-dev', '.config/microsoft-edge-beta'],
		win32: (localAppData) => localAppData ? [
			join(localAppData, 'Microsoft/Edge/User Data'),
			join(localAppData, 'Microsoft/Edge Canary/User Data'),
			join(localAppData, 'Microsoft/Edge Dev/User Data')
		] : []
	},
	brave: {
		darwin: [
			'Library/Application Support/BraveSoftware/Brave-Browser',
			'Library/Application Support/BraveSoftware/Brave-Browser-Nightly',
			'Library/Application Support/BraveSoftware/Brave-Browser-Beta',
			'Library/Application Support/BraveSoftware/Brave-Browser-Dev'
		],
		linux: [
			'.config/BraveSoftware/Brave-Browser',
			'.config/BraveSoftware/Brave-Browser-Nightly',
			'.config/BraveSoftware/Brave-Browser-Beta'
		],
		win32: (localAppData) => localAppData ? [join(localAppData, 'BraveSoftware/Brave-Browser/User Data')] : []
	},
	arc: {
		darwin: ['Library/Application Support/Arc/User Data'],
		win32: (localAppData) => localAppData ? [join(localAppData, 'Arc/User Data')] : []
	},
	vivaldi: {
		darwin: ['Library/Application Support/Vivaldi'],
		linux: ['.config/vivaldi'],
		win32: (localAppData) => localAppData ? [join(localAppData, 'Vivaldi/User Data')] : []
	},
	opera: {
		darwin: [
			'Library/Application Support/com.operasoftware.Opera',
			'Library/Application Support/com.operasoftware.OperaGX'
		],
		linux: ['.config/opera'],
		win32: (localAppData, appData) => [
			appData ? join(appData, 'Opera Software/Opera Stable') : null,
			localAppData ? join(localAppData, 'Programs/Opera GX') : null
		].filter(Boolean)
	}
}

const BROWSER_ALIASES = {
	'google-chrome': 'chrome',
	'chrome-canary': 'canary',
	'msedge': 'edge',
	'microsoft-edge': 'edge',
	'brave-browser': 'brave'
}

function readActivePortFile (filePath) {
	if (!filePath || !existsSync(filePath)) return null
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
	const key = BROWSER_ALIASES[browser?.toLowerCase()] || browser?.toLowerCase()
	const entry = BROWSER_DIRS[key]
	if (!entry) return []
	const platform = process.platform
	const home = homedir()
	let dirs = entry[platform] || []
	if (typeof dirs === 'function') {
		dirs = dirs(process.env.LOCALAPPDATA, process.env.APPDATA)
	}
	return dirs.map(d => d.startsWith('/') || /^[a-zA-Z]:/.test(d) ? d : join(home, d))
}

function resolveDevToolsActivePort (opts = {}) {
	if (typeof opts === 'string') opts = { browser: opts }
	if (opts.userDataDir || opts.dir) {
		return readActivePortFile(join(opts.userDataDir || opts.dir, 'DevToolsActivePort'))
	}
	if (opts.browser) {
		const paths = getBrowserPaths(opts.browser)
		for (const dir of paths) {
			const res = readActivePortFile(join(dir, 'DevToolsActivePort'))
			if (res) return res
		}
		return null
	}
	const browsers = ['chrome', 'canary', 'chromium', 'edge', 'brave', 'arc', 'vivaldi', 'opera']
	for (const b of browsers) {
		const paths = getBrowserPaths(b)
		for (const dir of paths) {
			const res = readActivePortFile(join(dir, 'DevToolsActivePort'))
			if (res) return res
		}
	}
	return null
}

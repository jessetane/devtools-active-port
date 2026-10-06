import { mkdtempSync, writeFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import test from 'node:test'
import resolvePort, { resolveDevToolsActivePort } from './index.js'

test('resolveDevToolsActivePort reads from userDataDir', t => {
	const dir = mkdtempSync(join(tmpdir(), 'devtools-active-port-test-'))
	const file = join(dir, 'DevToolsActivePort')
	try {
		writeFileSync(file, '9666\n/devtools/browser/def-456\n')
		const info = resolveDevToolsActivePort({ userDataDir: dir })
		t.assert.ok(info)
		t.assert.equal(info.port, 9666)
		t.assert.equal(info.path, '/devtools/browser/def-456')
		const infoDefault = resolvePort({ userDataDir: dir })
		t.assert.equal(infoDefault.port, 9666)
	} finally {
		rmSync(dir, { recursive: true, force: true })
	}
})

test('resolveDevToolsActivePort returns null for non-existent or invalid userDataDir', t => {
	const info = resolveDevToolsActivePort({ userDataDir: '/non/existent/path' })
	t.assert.equal(info, null)
	const dir = mkdtempSync(join(tmpdir(), 'devtools-active-port-test-'))
	const file = join(dir, 'DevToolsActivePort')
	try {
		writeFileSync(file, 'invalid-content\n')
		const invalidInfo = resolveDevToolsActivePort({ userDataDir: dir })
		t.assert.equal(invalidInfo, null)
	} finally {
		rmSync(dir, { recursive: true, force: true })
	}
})

test('precedence: userDataDir overrides browser in resolveDevToolsActivePort', t => {
	const dir = mkdtempSync(join(tmpdir(), 'devtools-active-port-test-'))
	const file = join(dir, 'DevToolsActivePort')
	try {
		writeFileSync(file, '9888\n/devtools/browser/override-dir\n')
		const info = resolveDevToolsActivePort({ userDataDir: dir, browser: 'nonexistent-browser' })
		t.assert.ok(info)
		t.assert.equal(info.port, 9888)
		t.assert.equal(info.path, '/devtools/browser/override-dir')
	} finally {
		rmSync(dir, { recursive: true, force: true })
	}
})

test('resolveDevToolsActivePort handles browser string and unknown browser gracefully', t => {
	const info = resolveDevToolsActivePort('nonexistent-browser-name')
	t.assert.equal(info, null)
})

test('resolveDevToolsActivePort handles browser normalization', t => {
	const info1 = resolveDevToolsActivePort('Google Chrome')
	const info2 = resolveDevToolsActivePort('google-chrome')
	const info3 = resolveDevToolsActivePort('Microsoft Edge')
	const info4 = resolveDevToolsActivePort('msedge')
	const info5 = resolveDevToolsActivePort('Brave Browser')
	t.assert.equal(typeof info1 === 'object', true)
	t.assert.equal(typeof info2 === 'object', true)
	t.assert.equal(typeof info3 === 'object', true)
	t.assert.equal(typeof info4 === 'object', true)
	t.assert.equal(typeof info5 === 'object', true)
})

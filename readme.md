# devtools-active-port
Resolve DevToolsActivePort for Chromium-based browsers.

## Why
When Chromium-based browsers (Chrome, Edge, Brave, etc.) are launched with remote debugging enabled (`--remote-debugging-port`), they write a temporary `DevToolsActivePort` file inside their user data directory containing the active port number and WebSocket path.

This lightweight, zero-dependency module resolves and parses that file across macOS, Linux, and Windows for all standard Chromium browsers.

## Usage
```javascript
import resolveDevToolsActivePort from 'devtools-active-port'

// Auto-detect active debugging port across all known browsers
const info = resolveDevToolsActivePort()
// => { port: 9222, path: '/devtools/browser/6b579178-...' }

// Or specify a browser preset
const edgeInfo = resolveDevToolsActivePort('edge')

// Or specify a custom user data directory
const customInfo = resolveDevToolsActivePort({ userDataDir: '/path/to/profile' })
```

## Options
Pass an options object or browser name string:

- `userDataDir`: Path to a custom user data directory containing `DevToolsActivePort` (highest precedence).
- `browser`: Preset browser name to search (`chrome`, `canary`, `chromium`, `edge`, `brave`, `arc`, `vivaldi`, `opera`).

If no options are passed, standard paths for all supported browsers are checked in order.

## Supported Browsers

- Google Chrome (`chrome`)
- Google Chrome Canary (`canary`)
- Chromium (`chromium`)
- Microsoft Edge (`edge` / `msedge`)
- Brave Browser (`brave`)
- Arc (`arc`)
- Vivaldi (`vivaldi`)
- Opera (`opera`)

## License
MIT

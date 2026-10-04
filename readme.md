# devtools-active-port
Zero-config active DevTools port resolution for Chromium-based browsers.

## Why
Whenever a Chromium-based browser (Chrome, Edge, Brave, Canary, etc.) is running, it maintains an active `DevToolsActivePort` file inside its user data directory containing the active port and WebSocket endpoint.

No startup flags, no manual port hunting, and no child process management. Just pass a browser name (or nothing at all) and get the active debugging endpoint instantly across macOS, Linux, and Windows.

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

# devtools-active-port
Zero-config active DevTools port resolution for Chromium-based browsers.

## Why
Opening the WebSocket at `DevToolsActivePort` automatically triggers a consent dialog users can click through to enable remote debugging on demand. No restart, command line flags or other configuration is necessary, just read the file and go.

## How
Searches default user data directories for Chrome, Edge, Brave, Opera, and others across macOS, Linux, and Windows to parse the active port and WebSocket path. Auto-discovers whatever browser is running, or targets a specific browser / profile by name / path

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

- `browser`: Preset browser name to search (`chrome`, `canary`, `chromium`, `edge`, `brave`, `arc`, `vivaldi`, `opera`).
- `userDataDir`: Path to a custom user data directory containing `DevToolsActivePort` (overrides browser).

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

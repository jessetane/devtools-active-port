# devtools-active-port
Zero-config active DevTools port resolution for Chromium-based browsers.

## Why
Using AI to inspect or debug something in your browser should be quick and easy. Nobody wants to restart a browser with multiple profiles, dozens of open tabs, and active tab groups in the middle of their workday just to enable remote debugging.

## How

* Chromium drops a `DevToolsActivePort` file in its user data directory containing the active port and WebSocket path.
* Sniffs out default profile paths for Chrome, Edge, Brave, Canary, Arc, etc across macOS, Linux, and Windows.
* Auto-discovers whatever browser is currently running, or targets a specific browser / profile on demand.

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

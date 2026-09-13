# Status Bar Visibility

Hermes Desktop plugin that hides the built-in, non-toggleable status-bar controls:

- Command Center
- Version & updates (Desktop client)
- Backend version (when a remote Gateway is connected)

## Install on the computer that runs Hermes Desktop

This is a **Desktop-side** plugin. Do not install it in the remote Gateway's LXC.

1. Extract the `statusbar-visibility` folder into the Desktop app's active Hermes home:
   - Windows default: `%USERPROFILE%\.hermes\desktop-plugins\statusbar-visibility\plugin.js`
   - If the Desktop app uses a custom `HERMES_HOME`, use `%HERMES_HOME%\desktop-plugins\statusbar-visibility\plugin.js` instead.
2. In Hermes Desktop, open **Settings → Plugins** (or **Capabilities → Plugins** depending on the build).
3. Enable **Status Bar Visibility** yourself.

The plugin is deliberately shipped disabled by default. Disabling or removing it restores the standard status bar.

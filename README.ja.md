# ステータスバー表示制御

組み込みで切り替えられない、次のステータスバー操作部を非表示にする Hermes Agent Desktop Plugin です。

- Command Center
- Version & updates
- Backend version

## インストール

これは **Desktop 側** のプラグインです。リモート Gateway の LXC にはインストールしないでください。

1. `statusbar-visibility` フォルダーを、Desktop アプリで有効な Hermes ホームへ展開します。
   - Windows の既定値: `%USERPROFILE%\.hermes\desktop-plugins\statusbar-visibility\plugin.js`
   - Desktop アプリがカスタムの `HERMES_HOME` を使用している場合: `%HERMES_HOME%\desktop-plugins\statusbar-visibility\plugin.js`
2. Hermes Desktop で **設定 → プラグイン** を開きます（ビルドによっては **Capabilities → Plugins**）。
3. **Status Bar Visibility** を有効にします。

このプラグインは意図的に既定で無効になっています。無効化または削除すると、標準のステータスバーに戻ります。

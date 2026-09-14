# Status Bar Visibility

標準では表示／非表示を切り替えられない、次のステータスバー項目を非表示にできる Hermes Agent Desktop Plugin です。

- Command Center
- Version & updates
- Backend version

ステータスバーのコンテキストメニューから、各項目の表示状態を切り替えられます。

## 1. インストール

### 1.1. Hermes Agent Desktop からインストールする

1. [インストールリンク](hermes://plugin/install?repo=l7u7ch/hermes-agent-desktop-plugin-status-bar-visibility)を開いてインストールします。Hermes Agent Desktop が起動し、インストール画面が表示されます。
2. インストールリンクを開けない場合は、Hermes Agent Desktop の **設定 → プラグイン → Install from Git** を開き、`l7u7ch/hermes-agent-desktop-plugin-status-bar-visibility` を指定してインストールします。
3. **Status Bar Visibility** を有効にします。

### 1.2. 手動でインストールする

1. このリポジトリから `plugin.js` を取得します。
2. Hermes Agent Desktop を実行するコンピューターで、次のパスに `plugin.js` を配置します。フォルダー名は Plugin ID と同じ `hermes-agent-desktop-plugin-status-bar-visibility` にします。
   - Windows: `%LOCALAPPDATA%\hermes\desktop-plugins\hermes-agent-desktop-plugin-status-bar-visibility\plugin.js`
   - macOS: `~/.hermes/desktop-plugins/hermes-agent-desktop-plugin-status-bar-visibility/plugin.js`
   - Linux: `~/.hermes/desktop-plugins/hermes-agent-desktop-plugin-status-bar-visibility/plugin.js`
   - `HERMES_HOME` を設定している場合: `$HERMES_HOME/desktop-plugins/hermes-agent-desktop-plugin-status-bar-visibility/plugin.js`
3. Hermes Agent Desktop の **設定 → プラグイン** で **Status Bar Visibility** を有効にします。

## 2. 注意点

- Remote Gateway には配置しないでください。Hermes Agent Desktop を実行しているコンピューターにインストールしてください。
- このプラグインは既定で無効です。Hermes Agent Desktop 上で有効にしてください。
- Hermes Agent Desktop の標準 UI を DOM 操作で補完するため、Hermes Agent Desktop の更新で互換性が失われる場合があります。
- 無効化または削除すると、標準のステータスバー表示に戻ります。
- 動作確認は、以下の Hermes Agent Desktop で実施しました。
  - Hermes Agent v0.21.2 (2026.9.11)
  - Commit ID: [`5eb99eb2844b22ebb723711b8e6a0bbb80bb5f04`](https://github.com/NousResearch/hermes-agent/commit/5eb99eb2844b22ebb723711b8e6a0bbb80bb5f04)

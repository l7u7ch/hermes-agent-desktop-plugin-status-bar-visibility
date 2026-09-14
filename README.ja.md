# ステータスバー表示制御

組み込みで切り替えられない、次のステータスバー操作部を非表示にする Hermes Agent Desktop Plugin です。

- Command Center
- Version & updates
- Backend version

## 対応環境

Windows、macOS、Linux で Hermes Desktop を使用している環境に対応します。

## インストール

これは **Desktop 側** のプラグインです。Windows、macOS、Linux のいずれでも、Hermes Desktop を実行しているコンピューターで次の手順を行います。

1. [Hermes Desktop でインストールする](hermes://plugin/install?repo=l7u7ch/hermes-agent-desktop-plugin-status-bar-visibility) を開き、表示される確認画面で Desktop プラグインを選んでインストールします。
2. リンクを開けない場合は、Hermes Desktop の **設定 → プラグイン → Install from Git** を開き、`l7u7ch/hermes-agent-desktop-plugin-status-bar-visibility` を指定します。
3. **Status Bar Visibility** を有効にします。

## 注意点

- リモート Gateway や Gateway を稼働させる LXC にはインストールしないでください。
- Hermes Desktop の標準 UI を DOM 操作で補完するため、Desktop の更新で互換性が失われる場合があります。
- このプラグインは既定で無効です。有効化は Hermes Desktop 上で行ってください。
- 無効化または削除すると、標準のステータスバー表示に戻ります。

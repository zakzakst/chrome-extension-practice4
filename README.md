# chrome-extension-template

## メモ

- tsconfig.jsonでエイリアス設定を試したが、ビルドで失敗した。一旦諦める
  - @crxjs/vite-pluginの仕様をきちんと調べられていないだけで、頑張ればできる可能性はある
  - tsconfig.app.jsonのほうに記述すればいける？（使い分けちゃんと分かってない。。今度調べる）

## その他やりたいこと

- 設定ページ
- iconの動的変更
- import order効いてないっぽい。要確認・修正

## アイデア

- 特定サイトの自動ログイン補助
- 特定テキストを自動コピー
- 独自サイドバー追加
- 画像サイズ確認（画像dimensions表示）
- localStorage閲覧補助
- Cookie管理補助
- ChatGPT入力支援
  - ローカルフォルダ／ファイルを読みに行ければ便利そう
- 特定のキー操作をすると起動する設定（下記の `chrome上でaを2回押した時` のイメージ）
  - https://zenn.dev/monjara/articles/3b200fa041fbdf

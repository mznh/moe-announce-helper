# moe-announce-helper

賢者のメガホン（www.mznh.jp/moe/announce/）のソースコード。Angular 13 製 SPA。

## セットアップ

[mise](https://mise.jdx.dev/) で Node.js バージョンを管理している。

```bash
mise install      # Node.js 22.23.1 をインストール
npm install       # 依存パッケージのインストール
```

## 開発サーバー

```bash
npm start         # http://localhost:4200/
```

## ビルド

```bash
npm run build-prod   # 本番ビルド（base-href=/moe/announce/ 付き）
npm run build        # 開発ビルド
```

ビルド成果物は `dist/moe-announce-helper/` に出力される。
`webpage/deploy -b` でビルド＆コピー＆S3デプロイまで一括実行できる。

## テスト

```bash
npm test
```

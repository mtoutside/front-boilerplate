Front Boilerplate
====================

- node.js >= v10.16.2
- npm >= 6.9.0

## Setup

```
npm install
```

## Scripts

```
npm run build
npm start
```

- `start` 監視
- `build` ビルド（開発）
- `build-stag` ビルド（ステージング）
- `build-prod` ビルド（本番）

### Others

`src/assets/images`, `src/assets/movies` は監視してないので、変更したらビルドを実行する

`production_file/` へ本番に上げているファイルを反映する（差分確認のため）

### Misc
eslint, Prettierの参考

[PrettierとLinterを併用する](https://qiita.com/sigwyg/items/ebb21ef70550cee7a163)
[eslintの設定からprettierとの併用までの流れ](https://qiita.com/shoichiimamura/items/0ba005889e3e90ee66d9{})

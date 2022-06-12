# lt-solid-todo
SolidJSのLT資料

## SolidJSの公式サイト
[https://www.solidjs.com/](https://www.solidjs.com/)

## SolidJSのインストール
- JavaScriptの場合
```shell
npx degit solidjs/templates/js プロジェクト名
cd ./プロジェクト名
npm i
# または
yarn install
```

- TypeScriptの場合
```shell
npx degit solidjs/templates/ts プロジェクト名
cd ./プロジェクト名
npm i
# または
yarn install
```

- その他のテンプレート
  - [https://github.com/solidjs/templates](https://github.com/solidjs/templates)
  - SASSやRooterなどのテンプレートが収録されています。

## SASS(SCSS)の導入方法
```shell
# npmの場合
npm install --save-dev sass

# yarnの場合
yarn add --dev sass
```

## Dexie.jsの導入方法
```shell
# npmの場合
npm install dexie

# yarnの場合
yarn add dexie
```

## SolidJSでのDexie.jsの操作方法の一次ソース
- [https://dexie.org/docs/Tutorial/Getting-started](https://dexie.org/docs/Tutorial/Getting-started)
  - SolidJS専用の解説ありませんが、**Vanillas JS**の項目が参考になります。

## PWA化に必要なパッケージのセットアップ
まずパッケージをインストールします。
```shell
# npmの場合
npm install --save-dev vite-plugin-pwa

# yarnの場合
yarn add --dev vite-plugin-pwa
```

インストール後、ルートディレクトリの**vite.config.ts**を開き、pluginsを変更します。
```typescript
- plugins: [solidPlugin()],
+ plugins: [solidPlugin(), VitePWA({})], 
```
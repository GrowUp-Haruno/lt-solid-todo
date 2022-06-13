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

## PWA

### PWA化に必要なパッケージのセットアップ
パッケージをインストールします。
```shell
# npmの場合
npm install --save-dev vite-plugin-pwa

# yarnの場合
yarn add --dev vite-plugin-pwa
```

インストール後、ルートディレクトリの**vite.config.ts**を開き、pluginsを変更します。
```diff
+ import { VitePWA } from 'vite-plugin-pwa';
// 省略
- plugins: [solidPlugin()],
+ plugins: [solidPlugin(), VitePWA({})], 
```

### PWAに必要なファイル
- アイコン画像一式をpublicに配置する
  - 192x192, 256x256, 384x384のマスク有りの画像
  - 192x192, 256x256, 384x384のマスク無しの画像
    - manifestのiconsに上記のファイルの場所と種類、サイズを記述する
    ```json
    icons: [
      {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
      },
      {...}
    ]
    ``` 
  - favicon.ico
    - index.htmlで指定する
    ```html
    <link rel="icon" type="image/ico" href="/icons/favicon.ico" />
    ```
  - apple-touch-icon.png
    - index.htmlで指定する
    ```html
    <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
    ```
  - robots.tsx
    - 以下の内容を記述する
    ```
    User-Agent: *
    Allow: /
    ```

- vite.config.tsを修正する
```diff
+ import manifest from './manifest.json';
- plugins: [solidPlugin(), VitePWA({}), tsconfigPaths()],
+ plugins: [
+   solidPlugin(),
+   VitePWA({
+     manifest: manifest,
+     includeAssets: ['robots.txt', 'icons/*.{png,ico}'],
+   }),
+   tsconfigPaths(),
+ ],
```
- SolidJSをインストールした直後はjsonが読める設定になっていないため、tsconfig.jsonのresolveJsonModuleを有効(true)に変更する



## import時のファイルパスのエイリアス化に必要なパッケージのセットアップ
パッケージをインストールします。
```shell
# npmの場合
npm install --save-dev vite-tsconfig-paths

# yarnの場合
yarn add --dev vite-tsconfig-paths
```

インストール後、ルートディレクトリの**tsconfig.json**を開き、次の内容を記述します。
```json
"compilerOptions": {
  (省略)
  // 以下を追記
  "baseUrl": "./",
  "paths": {
    "@/*": ["src/*"],
    "~/*": ["public/*"]
  },
  // ここまで
}
```

VSCodeで作業する場合、ルートディレクトリに**.vscode/setting.json**を作成して次の内容を記述すると、オートインポート時にエイリアスが適用されます。
```json
{
  "path-autocomplete.pathMappings": {
    "@": "${folder}/src",
    "~": "${folder}/public"
  }
}
```

最後にルートディレクトリの**vite.config.ts**を修正します。
```diff
+ import tsconfigPaths from 'vite-tsconfig-paths';
// 省略
- plugins: [solidPlugin(), VitePWA({})], 
+ plugins: [solidPlugin(), VitePWA({}), tsconfigPaths()],
```
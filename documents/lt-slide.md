---
theme : "sky"
transition : "default"
---

<style type="text/css">
  .reveal h1,
  .reveal h2,
  .reveal h3,
  .reveal h4,
  .reveal h5,
  .reveal h6 {
    text-transform: none;
  }
  p,h1,li { 
    text-align: left;
    font-size: 1.75rem;
  }
</style>

## SolidJSでTodoデスクトップアプリを作ってみた

Daisuke@React SolidJS大好き侍

2022.06.15

---

## 自己紹介

- 医療機器メーカーに勤務
  - 電子回路設計 → ソフトウェアの運用テスト設計 & 業務自動化アプリの開発
- 転職活動中...
- TypeScript、ReactやSolidJSが大好き

---

## キッカケ
----

Qiitaの記事
[React大好き侍が、「もうSolidJSでいいじゃん...//」ってなったワケ。](https://qiita.com/shadowTanaka/items/b6d00863a8d6bff37de6)
を読んで興味が湧いた

---

### [公式チュートリアル](https://www.solidjs.com/tutorial/introduction_basics)をやってみた
----

- 変化値の読み書きは関数を用いる
- Cleanupが必要な関数の扱いがラク
- propsの扱いは注意が必要
- 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった

---

### 変化値の読み書きは関数を用いる

---

#### 変化値の読み書きは関数を用いる
----

```typescript
function App() {
  const [count, setCount] = createSignal(0);
  // countがゲッター(値の読み取り)
  // setCountがセッター(値の書き込み)

  return (
    <button onClick={() => setCount(count() + 1)}>
      Count: {count()}
    </button>
  );
}
```
どこでゲッターが読みとられたのかを追跡して変更があれば更新する

---

### Cleanupが必要な関数の扱いがラク

---

#### Cleanupが必要な関数の扱いがラク
----
コンポーネントは**再レンダリングしない**ので、setIntervalは**一度**だけ呼び出される
```typescript
const App = () =>{
  const [count, setCount] = createSignal(0);
  
  // 1秒ごとに加算
  const intervalID = setInterval(() => setCount(count() + 1), 1000);
  // コンポーネントが破棄される時にクリーンアップを実行
  onCleanup(() => clearInterval(intervalID));
  
  return <div>Count: {count()}</div>;
}
```
Reactで同じ書き方をした場合、際限なくsetIntervalを呼び出して暴走する

---

### propsの扱いは注意が必要

---

#### propsの扱いは注意が必要
----
Counterコンポーネントで分割代入をすると、countの追跡が途切れるため初期値0から変わらない
```typescript
const Counter = ({count}) => {
  return <div>{count}</div>   // 0
}

const App = () => {
  const [count, setCount] = createSignal(0);
  
  const intervalID = setInterval(() => setCount(prev => prev +1), 1000);
  onCleanup(() => clearInterval(intervalID));
  
  return <Counter count={count()} />
}

```

---

#### propsの扱い方
---
分割代入せずにprops.countとすることで追跡できる様になる
```typescript
const Counter = (props) => {
  return <div>{props.count}</div>   // 0,1,2...
}
```

propsのデフォルト値はmergePropsで設定できる
```typescript
const Counter = (props) => {
  const merged = mergeProps({ count: 0 }, props);
  return <div>{merged.count}</div>   // 0,1,2...
}
```

---

### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
----
ReactでisLoadingステートの状態を見てfalseなら「```<div>Loading...</div>```」を出力する場合、短絡評価を用いる
```typescript
return (
  <>
    {
      !isLoading && <div>Loading...</div>
    }
    // または
    // {
    //   isLoading || <div>Loading...</div>
    // }
  </>
);
```

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
----
SolidJSで同じことをする場合、ヘルパー関数のShowを用いる
(whenがtrueならchildrenを表示)
```typescript
return (
  <Show when={!isLoading}>
    <div>Loading...</div>
  </Show>
);
```

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
---
Reactで三項演算子用いた複雑な処理を書くと...
```typescript
return (
  <>
    {
      条件1 ? (
        <Component1 />
      ) : 条件2 ? (
        <Component 2/>
      ) : 条件3 ? (
        <Component3 />
      ) : (
        <Component4 />
      )
    }
  </>
);
```

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった

SolidJSの場合、ヘルパー関数のSwitchとMatchを用いる
(fallbackはどの条件にもヒットしなかった場合表示する)

```typescript
return (
  <Switch fallback={<Component4 />}>
    <Match when={条件1} children={<Component1 />} />
    <Match when={!条件1 && 条件2} children={<Component2 />} />
    <Match when={!条件1 && !条件2 && 条件3} children={<Component3 />} />
  </Switch>
);
```

この他にも、配列をイテレーションするForや、コンポーネントをオブジェクトにまとめて直接表示するDynamic等ヘルパーが用意されている

---

## [Todoデスクトップアプリ](https://solid-todo-flame.vercel.app/)を作ってみた！

---

### 技術構成
----
- SolidJS
- Sass(Scss)
- Service Worker + manifest 
  - viteのプラグイン（vite-plugin-pwa）を用いてPWA化
- IndexDB
  - Dexie.jsを用いてToDoデータをローカルに保存
- Vercel(GitHub経由)でデプロイ

---

### アプリを作ってみてわかったこと
----
- Sass(Scss)の導入が非常にラク
- PWA化もラク
- コンテキスト作成もラク
- Dexie.js等のSolidJS専用の解説が無くても、JavaScriptの解説さえあればなんとか実装できる
- refを用いたDOM操作がReactよりも素直に扱える

---

### Sass(Scss)の導入が非常にラク

---

#### Sass(Scss)の導入が非常にラク
----

「```yarn add --dev sass```」を実行するだけ

---

### PWA化もラク

---

#### PWA化もラク
----
Viteのプラグイン（vite-plugin-pwa）を入れて、manifestを宣言するだけ

SASSやPWA化のヒントは[SolidJS公式のtemplete集](https://github.com/solidjs/templates)にある

---

### コンテキスト作成もラク

---

#### コンテキスト作成もラク
----
SolidJSもReactのカスタムフックと同様にロジックを分離することができる
```typescript
function createTodo() {
  const [inputValue, setinputValue] = createSignal('');
  const handleInput = (e) => { setinputValue(e.currentTarget.value)};
  return {inputValue, handleInput};
}

const App1 = () =>{
  const { inputValue, handleInput } = createTodo();
  return ();
}
const App2 = () =>{
  const { inputValue, handleInput } = createTodo();
  return ();
}
```
スコープはそれぞれのコンポーネント内となる

---

#### コンテキスト作成もラク
----
createRootでラップするとコンテキストとして扱える
```typescript
const createTodoCTX = createRoot(createTodo)

const App1 = () =>{
  const { inputValue, handleInput } = createTodoCTX;
  return (...);
}
const App2 = () =>{
  const { inputValue, handleInput } = createTodoCTX;
  return (...);
}
```
App1で変化があるとApp2も変化する

---

### Dexie.js等のSolidJS専用の解説が無くても、JavaScriptの解説さえあればなんとか実装できる

---

#### Dexie.js等のSolidJS専用の解説が無くても、JavaScriptの解説さえあればなんとか実装できる
---
[Dexie.jsの公式サイト](https://dexie.org/docs/Tutorial/Getting-started)を見ると...

---

### refを用いたDOM操作がReactよりも素直に扱える

---

#### refを用いたDOM操作がReactよりも素直に扱える
----
- [Todoデスクトップアプリ](https://solid-todo-flame.vercel.app/)には再編集機能がある
- 登録済みのToDoをクリックすると、Inputに切り替わり自動的にフォーカスが当たる様になっている
  - フォーカスはReact同様refでDOMを操作する
  - しかし、SolidJSにはuseRefのようなものが無い
    - どうするのか？

---

#### refを用いたDOM操作がReactよりも素直に扱える
----
letで宣言して必要なタイミングでfocusを実行するだけ
```typescript
let inputRef
createEffect(() => {
  inputRef.focus();
  ...
});

return <input type="text" ref={inputRef}>
```
ReactだとinputRef.current.focus()となる

---

#### refを用いたDOM操作がReactよりも素直に扱える
----
refを関数として扱うことも可能
```typescript
// elはHTMLInputElement型
const inputRef = (el:HTMLInputElement) => {
  createEffect(() => {
    ...
    el.focus();
  });
}
return <input type="text" ref={inputRef}>
```
ロジック分離する場合はこちらを使う必要がある

---

#### refを用いたDOM操作がReactよりも素直に扱える
----
- Reactの場合、inputに限らず、useRefが必要になるCanvasやWeb Audio API等は、呼び出す度に「.current」と書くので書き辛く、読み辛い
- SolidJSの場合、変数を呼び出すだけで済むので書き易く、読み易い

---

## まとめ

- SolidJSとReactドキュメントを読み比べるので
- 

---

    ---
    
    ## [公式チュートリアル](https://www.solidjs.com/tutorial/introduction_basics)

    [refの動作](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvVwAtaQ19HOGc4AFEZGThmPmk5BWVVDW09CysrGXoIOLRaCF4AYQYIF0YACgBKfiteBwKyPmAMQnpcADUoNXo4XzI4XABJCDbO7t6AXV4AXgcnF3cvboqVQDGGQE6GQAmGFSrLQoaIJt4WsgiRNFx+waGzi9xpudDwpe8KmW6BvcyD5ka+fxQURqOBFDTMADWs141VmAD5agd6gNhndLhVcIxet8DpJ9nVBIMmIVVkjeAAeOEE+r1ckBILUmn1Qz+YQzEBoNG4aqSRlMj5qNQmKCQ9nkwi8ApgtCikCA4Gg8EQyRwjmjdpdHpwHnk-SEOG8sn1KlGmnk1rtPlM3gEYgzFQuCi4FRWpkANwmcHZFvGWp5rppQhk7IqcDUNRmCJAAaZzxcURicQqsMjiOt6ZpnPO6JxGYzYYAdDJaMx6GRqvs80zJLmq5JDVXJRARmMQ3AI1GYzSUS2NZ7QwXS4whGUACpQRgeQYFj1a2t5+tdgoAIR6jBDHbTjd4Pa570+7crdYbGf0JvTuvphnPZrPBJxhqsI7ElRTCPJJRy5V4Z98IhL9DwGUBZTrgEQgkBuDLvgQwiKsYBQIQhC7AAhDiYCSJMQA)
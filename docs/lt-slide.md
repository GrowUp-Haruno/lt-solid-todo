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

## SolidJSでTodoデスクトップアプリを作ってみてわかったこと

Daisuke.W

2022.06.15 フロントエンドLT会 - vol.7

---

## 自己紹介

Daisuke@React SolidJS大好き侍

（Twitter: @fullStackHaruno）

- 医療機器メーカー電気電子系エンジニアとして従事
  - 回路設計やハーネス設計→ソフトウェア運用テスト設計&業務自動化アプリ開発
- 現在はフロントエンドエンジニアを目指して日々アウトプット中！
- TypeScript、ReactやSolidJSが大好き
- LT登壇は2回目（フロントエンドLT会は初!!）

---

### SolidJSでTodoデスクトップアプリを作ってみてわかったこと

---

### キッカケ

---

ある日、Qiitaの記事
「[React大好き侍が、「もうSolidJSでいいじゃん...//」ってなったワケ。](https://qiita.com/shadowTanaka/items/b6d00863a8d6bff37de6)」
を読んで興味が湧いた

---

### [公式チュートリアル](https://www.solidjs.com/tutorial/introduction_basics)をやってみた
----

書き方やコードの見た目はReactそっくりだが、完全に別物だった
- 変化値の読み取りは関数を用いる
- Cleanupが必要な関数の扱いがラク
- propsの扱いは注意が必要
- 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
- etc...

---

#### 変化値の読み取りは関数を用いる
----

```jsx
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

[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrGXoIZlw0WgheAEFCQgAKAEp+K14HeLI+YGYGCFwsXjI4XABhYtwAXV4AXgcnF3cvKDVUgAZ0ywTefX1cqNxAGQZAJoZAYYZAfoZAH4ZUwBIFQDsGQFqowH8GQDXlQCiGdOzB4Yrq2rHAboZZhZXAD7NAWQZAHvj1vYh9oVwmBNT9nIAeE3pcXDxXjxKoaZgAa0aIAyTQAfOVKjVRqkisjMgBqXgARnSklhXxyvCRJUQ-FRJQykgJ330fwB8XxAz6VipzwgQlE4lSMMa8O+yUIg1hZREtGY9HgJQAdB5KgBRNRwSW4ABC+AAkiJPmAoCkVOkAITMzCSOpAA)

return()内とcreateEffect()内のどこでゲッターが読みとられたのかを追跡して変更があれば更新する

---

#### Cleanupが必要な関数の扱いがラク
----
1秒ごとにカウントアップする例
```jsx
const App = () =>{
  const [count, setCount] = createSignal(0);
  
  // 1秒ごとに加算
  const intervalID = setInterval(() => setCount(prev => prev + 1), 1000);
  // コンポーネントが破棄される時にクリーンアップを実行
  onCleanup(() => clearInterval(intervalID));
  
  return <div>Count: {count()}</div>;
}
```
SolidJSはコンポーネントを**再レンダリングしない**ので、setIntervalは**一度**だけ呼び出される

[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvWhABhNTgoCHpCKVl5RRU6DW09CysrZn8yPgBBQgiAXl4ACgBKXhyAPn4rXgc0vmBU+ghcXzI4XACGRoBdEocnF3cvKDV8gAZCywhK3n19XgBGQCXPQBUGQAsGQGsGQAKlQHTvKdSIdN4MF0YANyGASQARHpbcc8bxM+GikvLb9obcfPrGl4BqeaFXxzEag8ZTGa8QDNDIBnhkAuwyAH4ZALMMMMAEwyAGQZACwegBGLQCqDIAYhkA0QyAITM1oB6hkAVwwImGAIoZAMMMgHWGQBJDIB87UAMhFTfxBEJhQj5F5lBzBKCMe7HJ75I6PC6XQrgyYQKpCXBMRUAHhEaBOpQ+jUQ-B+X0KkjV+k12omkgmViEonE-OKgrVWQi+lKvhEtGY9HgjQAdB5WgBRYK+3AAIXw5xE+RUUGyKkKAEJ5WBJJ0gA)

Reactで同じ書き方をした場合、際限なくsetIntervalを呼び出して暴走する

---

#### propsの扱いは注意が必要
----
Counterコンポーネント側で分割代入をすると、countの追跡が途切れるため初期値0から変わらない
```jsx
const Counter = ({ count }) => {
  return <div>Count: {count}</div>; // 0
};

const App = () => {
  const [count, setCount] = createSignal(0);

  return (
    <>
      <Counter count={count()} />
      <button onClick={() => setCount((prev) => prev + 1)}>加算</button>
    </>
  );
};
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrZloIMj4AYQYIFwkAXl4AChBI+kTJAEpeZIA+fiteQThcJgheAB4RNAA3Qvjs3ER+LJya-Xqm8159fV4ABitJSwgIqJjeAEFCQgL0-KKS6odpvmBO3CxeMgqWxIBdJcc4ZzdPbzTh3InS8srGarTHsprC97Lao6SN1rJTIJXBpXLSfRfdY-Womei4XBRXhRWIaZgAayBYIKxQOuD+aTShCEDRWxWJcAavAA1LwAIzgwqAAqVAOne3ThCKiUJh3W5vHuYweECEonEhLJtXmi0hexEtGY9HgiQAdB4KgBRNRwJW4ABC+AAkiI3mAoAsVLkAIQCzCSY5AA)

---

#### SolidJSでのpropsの扱い方
---
分割代入せずにprops.countとすることで追跡できる
```jsx
const Counter = (props) => {
  return <div>{props.count}</div>   // 0,1,2...
}
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrZloIMj4AYQYIFwkAXl4ACkJ5QjIASl5kgD5+K15BOFwmCF4AHhE0ADcC+PpExH5M2myAOkiW3Elq-TrG8159fV4ABitJSwgIqJjeAEFCQnz0vMLiqodFvmBexKxeMnLmxIBdDcc4ZzdPbzTJnLmSsorGKrT30uqC36lGoXJJ7PrJEBHXBpHLSfQA3ZAmomei4XBRXhRWIaZgAawhMPyRTOuBBaQyQnqWyKmTg9V4AGpeABGWEFQAFSoB070GKLRUQRSMGAt4rxmbwgQlE4nJ1Jqq3W8JOIlozHo8ESXQ85QAomo4OrcAAhfAASREPzAUDWKhyAEJRZhJJcgA)

propsのデフォルト値はmergePropsで設定できる
```typescript
const Counter = (props) => {
  const merged = mergeProps({ count: 0 }, props);
  return <div>{merged.count}</div>   // 0,1,2...
}
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrZloIMj4AYQYIFwkAXl4ACkJ5QjIASl5kgD5+K15BOFwmCF4AHhE0ADcC+PpExH5M2myAOkiW3Elq-TrG8159fV4ABitJSwgIqJjeAEFCQnz0vMLiqodFvmBexKxeMnLmxIBdDcc4ZzdPbzTJnLmSsorGKrT30uqC36lGoXJJ7PrJEBHXBpHLSfQA3ZAmomei4XBRXhRWIaZgAawhMPyRTOuBBaQyQnqWyKmTg9V4AGpeABGWEFQAFSoB070GKLRUQRSMGAt4rxmbwgQlE4nJ1Jqq3W8JOIlozHo8ESXQ85QAomo4OrcAAhfAASREPzAUDWKhyAEJRZhJJcgA)

以下の定義方法はならpropsの個別設定ができる
```tsx
const Counter = (props: { count }) => {...}
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvAMIKXBDCfNJyCsqqGtp6FlZWzLQQZHwB9BAuEgC8vAAUhPKEZIj2iemhAJS8WQB8-Fa8gnC4TBC8ADwiaABuNWkZJSAFtEUAdGUZku36Xb3mvPr6vAAMVpKWEAlJKbwAgoSE1XlVtfVtDtt8wBO4vmTN-bgAukeOcM5unt65yxUbDU0Wow2rkAY12jUwY0Oo9xBdylkQDdchVpPpIedoR0TPRcLgkrwkn4NMwANaIlHVOr3XCPXL5ITdE51Apwbq8ADUvAAjKiaoACpUA6d7THF4pIYrHTCW8P5rf4QISicT05kdfaHdG+ES0Zj0eAZUYeZoAUTUcH1uAAQvgAJIiUFgKAHFQVACEsswkieQA)

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
----
Reactで短絡評価を使って「```<div>Loading...</div>```」を出力する場合、
```jsx
<>
  {
    isLoading && <div>Loading...</div>
  }
</>
```

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
----
SolidJSで同じことをする場合、ヘルパー関数のShowを用いる
(whenがtrueならchildrenを表示、falseならfallbackの内容を表示)
```jsx
<Show when={isLoading()} fallback={<div>記事一覧</div>}>
  <div>Loading...</div>
</Show>
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvVwAtaQ19aCABhNTgoCHpCKVl5RRU6DW09CysrGXoIZlw0UN4whggXRgAKAEp+K14HULI+YDQyABlaKBEMD18yOFwASTaOrogPAF1eAF4HJxd3Lyg1ctxGejhKywha+ohG3nz4BkGAEWnePtwAFQ44Y-Kq6YA+Gog6usuh9s7u8pklvqbHaSXwAZgADJCgW9eKEIlEYoQHtUpi8QDs6sxIlBGDcjvRcCtbscBidoXVJNCdkJcEw3uUMbwADwBIK8Qz+YRTEAtb6jDxVaT-NRqExQZgAa25TK6ADcnoAMKMA0XKAADlAOWRTP0cqekiejLqMrQ8r53QAdObNdrGZrWYY9TDoZJMhAhKJxMjnszijkyrx9E9fCJaMx6PBSqaPP0AKKRMO4ABC+AGIgZYCghEIKkqAEJoWBJOMgA)

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった
---
Reactで三項演算子を使うと...
```jsx
<>
  {
    条件1 ? (
      <Component1 />
    ) : 条件2 ? (
      <Component2 />
    ) : 条件3 ? (
      <Component3 />
    ) : (
      <Component4 />
    )
  }
</>
```

---

#### 制御フローのヘルパー関数のおかげでreturn内の見通しが良くなった

SolidJSの場合、ヘルパー関数のSwitchとMatchを用いる
(Switch内を上から順番に評価して、条件に一致するコンポーネントを一つ出力する)

```jsx
return (
  <Switch fallback={<Component4 />}>
    <Match when={条件1} children={<Component1 />} />
    <Match when={条件2} children={<Component2 />} />
    <Match when={条件3} children={<Component3 />} />
  </Switch>
);
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsjuM7gAURkZOGZcLF5XQzRcZgALSIBZZwSpWXlFFToNbT0LKysZeghwtFoIXgBhBggXRgAKAEp+K14HCrI+YGZaiN4yOFwaktwAXV4AXgcnF3cvKDUGgAYmy0qOiC7eDHqAN0WASQARKYGhw7rxA6XmyYA+EEHhvobCIT2H97g9gGoARiakiwAFZlqs2jN-C5gqFwg07o9Ie00DIGr1Rs0ADwAFlWQlwTAgyIcan8jEu+0WDV21yOxyaJN6W3UcAAdGpaB4GipANUMgDKGQDPDIAJhkASQyAToZhYBhhkA6wyAdQZAH4McsA+gwqRkbSTqyEEom8HkbdpY+4krEiNB7R4YurNSRY-Rmi0m6KxNIyRZqExQZgAa0mIFN5vuAGZloBTuUAUHJ2h33STGg3tXhYlJxeK8QzxYR+q24ZqJ6b-ZbSBJoNQiIQQP0Bi0F0OAaDko4HpPo4wmE0nUqn05mQNnc1jpgAmQsOeIlsvdqv3GvhwCADEO6w2LU2W63E8m0l2Kz3Xi1+7wQ0XR6Xy5Xo-PZyGF-bG7xmyb9M6UyvDXeNmsrJJChBy2JGrmHomIxXBIzaRCItDMPQ8B1GyHhDIEZLQbgABC+CHCIPJgFAhCEGqACE76YJIYxAA)

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
  - ToDoデータをローカルに保存
- Vercel(GitHub経由)でデプロイ

---

### アプリを作ってみてわかったこと
----
- Sass(Scss)の導入が非常にラク
- PWA化もラク
- コンテキスト作成もラク
- refを用いたDOM操作がReactよりも素直に扱える

---

#### Sass(Scss)の導入が非常にラク
----

「```yarn add --dev sass```」を実行するだけ

---

#### PWA化もラク
----
Viteのプラグイン（vite-plugin-pwa）を入れて、manifestを宣言するだけ

<br/>

SASSやPWA化のヒントは[SolidJS公式のtemplete集](https://github.com/solidjs/templates)にある

---

#### コンテキスト作成もラク
----
SolidJSもReactのカスタムフックと同じ書き方でにロジックを分離することができる
```jsx
function createTodo() {
  const [count, setCount] = createSignal(0);
  const handleInput = () => setCount((prev) => prev + 1);
  return { count, handleInput };
}

const App1 = () =>{
  const { count, handleInput } = createTodo();
  return (...);
}
const App2 = () =>{
  const { count, handleInput } = createTodo();
  return (...);
}
```
スコープはそれぞれのコンポーネント内となる

[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqps+YpU6DW09CysrGXoIZlw0WggHJxcAFVoRWgAKAEp+K14HeLI+YGYGCFwsXjI4XABhMtwAXV4AXkS4ZzdPbwyABizLBIKIIt4ACyhRNTgASQhCej427NaAPiqa+qjcDIzCIQA3HJb1-bgD3gBqXgBGAbzBGqYEgVLtyomp2fnFqUHJcLRQp8ACChEIN1avBWJ1yQ1KIz4rwaH0mImmcwWfGkbUcHRSaUy9yGQlwz2hD3yAB4RGgDqtKfleCCAAosm6IXhUkyLXDxXjxWoaZgAaxaIE+6O+WMkqxAb3K2UkVP0PNwfIgDKG1P0tPpD2JkkGCNGYMIACYoTD1iAHiakQV3uM0RiftioXjOql0tlBvlSeSMoyaXStUymayWebOdzefzBcKxRKXdLFrL5Q0lSq1Rqw0yVXq84bBlYhKJxEGhtaKdquXnw1SzZD9PX82bLS3g52hlksA90sx6PBygA6Dw1ACi02HuAAQvgZiIg2AoOCVFkAIRWYlgSSNIA)

---

#### コンテキスト作成もラク
----
createRootでラップすることでコンテキストとして扱える
```typescript
function createTodo() {...}
const createTodoCtx = createRoot(createTodo)

const App1 = () =>{
  const { count, handleInput } = createTodoCtx;
  return (...);
}
const App2 = () =>{
  const { count, handleInput } = createTodoCtx;
  return (...);
}
```
App1で変化があるとApp2も変化する

[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsDpy4AlWlo+aTkFZVUNbT0LKysZeghmXDRaCD84ZzgAFVoRWgAKAEp+K14HdLI+YGYGCFxfMjhcAGF63ABdXgBeTOz3Lyg1QoAGYssMyohq3gALKFE1OABJCEJ6Pj6S3oA+Xma2jsLCwiEAN1Ke-bO4c94Aal4ARgnywRamDIE6pMb5xYiZZrDahSaSeLJKp8RxZFx5AqtXAUXr9QLBXCFWHZBG0N4QKx1GZ8ACChEIz1RO2uZSmRNmPw6vgWS1W602UlR2Ph+VoSIokwqQlwX14hXeFQAPCI0OddhKKrwSQAFZXPRC8SUmTa4dK8dKtDTMADWPRALKBbNBkl2IF+DRKkkl+m1uF1EHlUyl+hlcve+Mkk3ppPJACYqVd9iB3sH7Pb-hbgezQlz-LlefzBR8RYwMuKvZrfZ7FYqVcrQxqtTq9QajabzYCk9bbfHHc7Xe7i4rnUX-eDJlYhKJxPmKtT9qPu12S5KyRTePpp925+HFwrnV3ilh3gVmPR4A0AHQeFoAUWWB9wACF8CsROKwFBySpigBCKz4sCSTpAA)

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
変数を宣言して必要なタイミングでfocusを実行するだけ
```typescript
let inputRef
createEffect(() => {
  inputRef.focus();
  ...
});

return <input type="text" ref={inputRef}>
```
[動作デモ](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvVwAtaQ19HOGc4AFEZGThmPmk5BWVVDW09CysrGXoIOLRaCF4AYQYIF0YACgBKfiteBwKyPmAMQnpcADUoNXo4XzI4XABJCDbO7t6AXV4AXgcnF3cvboqVQDGGQE6GQAmGFSrLQoaIJt4WsgiRNFx+waGzi9xpudDwpe8KmW6BvcyDtUHeVrtABKcBkiF4AAkACoAWQAMiMxhE-vAyvs6vMwi4ojE4hVqrMAHy1A71NAyXgVNB3S7VGqA3AgmQAOhktGY9DI1X29Uk3wgGOYjT4-igoj+RQ0zAA1rNKTUZsSQBj6gNhjTcBVcIxevzeTzBIMmIVVqTeAAeQkq+oWgJBa023iGfzCGYgannWlVSQOm0fNRqExQGVu82EXgFSVoEMgUXiuBRmWSQnu0btLo9ODVSTm-SEQk+s31K1Fm3mhm+x0EYgzFQuCi4FSVm0ANwmcDdDIzvWzzfqQhknbTjNBAEJC47JxGIIj2m6KnAFUq+za1bPxpmF8yOYwhGUoVBGB5Bsy25m9VObZIJ5f6gUAEI9Rjzpck2+Otca96fRcG2-X5t9BLKdcztQxgLLICMX5QsrD3MRKgJRULRKHJyl4IDfBEdl6FRXBmWPXBkTgPD73wIYRFWMAoEIQhdlHfkwEkSYgA)

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
[refの動作](https://playground.solidjs.com/?version=1.4.1#NobwRAdghgtgpmAXGGUCWEwBowBcCeADgsrgM4Ae2YZA9gK4BOAxiWGjIbY7gAQi9GcCABM4jXgF9eAM0a0YvADo1aAGzQiAtACsyAegDucAEYqA3EogcuPfr2ZCouOAGU0Ac2hqsvVwAtaQ19HOGc4AFEZGThmPmk5BWVVDW09CysrGXoIOLRaCF4AYQYIF0YACgBKfiteBwKyPmAMQnpcADUoNXo4XzI4XABJCDbO7t6AXV4AXgcnF3cvboqVQDGGQE6GQAmGFSrLQoaIJt4WsgiRNFx+waGzi9xpudDwpe8KmW6BvcyD5ka+fxQURqOBFDTMADWs141VmAD5agd6gNhndLhVcIxet8DpJ9nVBIMmIVVkjeAAeOEE+r1ckBILUmn1Qz+YQzEBoNG4aqSRlMj5qNQmKCQ9nkwi8ApgtCikCA4Gg8EQyRwjmjdpdHpwHnk-SEOG8sn1KlGmnk1rtPlM3gEYgzFQuCi4FRWpkANwmcHZFvGWp5rppQhk7IqcDUNRmCJAAaZzxcURicQqsMjiOt6ZpaBkMM553RVRqYYAdDJaMx6GRqvsM9bJDia-VJIaG5KICMxiG4BGozGaSj2xrPaGi+XGEIygAVKCMDyDIserX1htN3sFABCPUYIe7aZbvH7XPeny71eXzYz+hN6d19MMV7Nl4JOMNVnHYkqKYR5JKOXKvEvvgiGW9DwGURazrgEQgqBuBrvgQwiKsYBQIQhC7AAhDiYCSJMQA)

ロジック分離する場合はこちらを使う必要がある

---

#### refを用いたDOM操作がReactよりも素直に扱える
----
- Reactの場合、inputに限らずCanvasやWeb Audio API等はuseRefが必要になるが、呼び出す度に「.current」と書く必要がある
- SolidJSの場合、変数を呼び出すだけで済むので書き易く、読み易くなる

---

#### まとめ
----
- 公式のドキュメントやチュートリアル、Play Groundが充実している
- コードの見た目はReactそっくりだが、中身は完全に別物
- Reactから移植する場合、再レンダリングされないことに注意する
  - 例）依存配列無しuseEffectはロジックを全て外に出す

---

#### 参考文献など
----

- [SolidJS 公式サイト](https://www.solidjs.com/)
- [SolidJS ドキュメント](https://www.solidjs.com/docs/latest/api)
- [SolidJS チュートリアル](https://www.solidjs.com/tutorial/introduction_basics)
- [SolidJS PLAYGROUND](https://playground.solidjs.com/)
- [React大好き侍が、「もうSolidJSでいいじゃん...//」ってなったワケ。](https://qiita.com/shadowTanaka/items/b6d00863a8d6bff37de6)
- [Todoデスクトップアプリ](https://solid-todo-flame.vercel.app/)
  - [GitHubで公開中](https://github.com/GrowUp-Haruno/solid-todo)

---

### ご清聴ありがとうございました
import {Suspense, useEffect, useState} from "react"

function App() {
  return (
    <Suspense>
      <div>App</div>
      <Foo />
    </Suspense>
  );
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let text = '---'
export function Foo() {
 if (text === '---') {
   throw sleep(10000).then(() => {
     console.log('then')
     text = 'world'
   })
 }

  return <div>Hello {text}</div>;
}

export default App;

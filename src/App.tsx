import React from 'react';
import { invoke } from "@tauri-apps/api/tauri"
import { emit, listen } from "@tauri-apps/api/event"
import { isRegistered } from '@tauri-apps/api/globalShortcut';

import './App.css';

// js原生版的fibonacci (by:菩提树下的杨过 http://yjmyzz.cnblogs.com)
function fibonacci_js(n: number): number {
  if (n <= 1) {
    return 1;
  }
  return fibonacci_js(n - 2) + fibonacci_js(n - 1);
}

function App() {

  //js版fibonacci测试
  let js_test = (n: number) => {
    let begin = new Date().getTime();
    let result = fibonacci_js(n);
    let end = new Date().getTime();
    console.log(`fibonacci_js(${n})\t= ${result},\t执行时间: ${end - begin} ms`);
  }


  //rust版fibonacci测试
  let tauri_test = (n: number) => {
    let begin = new Date().getTime();
    invoke('fibonacci', { n }).then((result) => {
      let end = new Date().getTime();
      console.log(`fibonacci_tauri(${n})\t= ${result},\t执行时间: ${end - begin} ms`);
    });
  }

  let hello3 = (message: String) => {
    invoke("hello3", { msg: message }).then((message) => console.log(message))
  }

  let get_person = (name: String, age: Number) => {
    invoke("get_person", { name, age }).then((person) => console.log(person))
  }

  let is_valid_age = (age: Number) => {
    invoke("is_valid_age", { age })
      .then((msg) => console.log(msg))
      .catch((err) => console.error(err))
  }

  let async_test = () => {
    invoke("method_1").then((result) => {
      console.log("result:", result
      );
    })
  }

  let app_handle_test = () => {
    isRegistered('CommandOrControl+U').then((msg) => {
      console.log("msg:", msg);
    });

    invoke('app_handle_test').then((data) => {
      console.log("data:", data);
      isRegistered('CommandOrControl+U').then((msg) => {
        console.log("msg:", msg);
      })
    })
  }

  return (
    <div className="App">
      <p>
        <button onClick={() => invoke('hello1')}>hello1</button>
        <button onClick={() => invoke('hello2', { msg: "jimmy" })}>hello2</button>
        <button onClick={() => hello3("菩提树下的杨过")}>hello3</button>
        <br />
        <button onClick={() => js_test(38)}>fibonacci_js</button>
        <button onClick={() => tauri_test(38)}>fibonacci_tauri</button>
        <br />
        <button onClick={() => get_person('张三', 18)}>getPerson</button>
        <button onClick={() => is_valid_age(10)}>isAgeValid-ok</button>
        <button onClick={() => is_valid_age(-5)}>isAgeValid-err</button>
        <br />
        <button onClick={() => async_test()}>async-cmd</button>
        <button onClick={() => invoke('get_window_label')}>get_window_label</button>
        <button onClick={() => app_handle_test()}>app_handle_test</button>
        <br />
        <button onClick={() => invoke('query_data')}>query_data</button>
      </p>
    </div >
  );
}

export default App;

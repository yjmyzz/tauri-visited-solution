#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use serde::{Deserialize, Serialize};
use std::{thread, time};

/**
 * 无返回值，无传参
 */
#[tauri::command]
fn hello1() {
  println!("hello-1 tauri!");
}

/**
 * 可传参
 */
#[tauri::command]
fn hello2(msg: String) {
  println!("hello-2 {}!", msg);
}

/**
 * 有传参，带返回值
 */
#[tauri::command]
fn hello3(msg: String) -> String {
  format!("hello-3 {}", msg)
}

/**
 * 测试性能
 */
#[tauri::command]
fn fibonacci(n: i32) -> i32 {
  if n <= 1 {
    1
  } else {
    fibonacci(n - 1) + fibonacci(n - 2)
  }
}

#[derive(Debug, Deserialize, Serialize)]
struct Person {
  name: String,
  age: i32,
}

/**
 * 返回复杂对象
 */
#[tauri::command]
fn get_person(name: String, age: i32) -> Result<Person, String> {
  Ok(Person { name, age })
}

/**
 * 异常处理
 */
#[tauri::command]
fn is_valid_age(age: i32) -> Result<String, String> {
  if age > 0 && age < 150 {
    Ok("pass".into())
  } else {
    Err(format!("age:{} invalid", age))
  }
}

/**
 * 异步方法
 */
#[tauri::command]
async fn method_1() -> String {
  println!("method_1 is called");
  //内部再调用另1个异步方法
  let result = method_2();
  //这里不会block，会继续执行下一句
  println!("do another thing in method_1");
  //这里会阻塞，直到method_2返回
  let result = result.await;
  println!("method_2 result:{} from method_1", result);
  //返回method_2的结果
  result
}

async fn method_2() -> String {
  println!("method_2 is called");
  //刻意停3秒
  thread::sleep(time::Duration::from_secs(3));
  format!("method_2 result")
}

#[tauri::command]
async fn get_window_label(window: tauri::Window) {
  println!(
    "Window: {},is_fullscreen:{:?}",
    window.label(),         //获取应用窗口的label
    window.is_fullscreen()  //获取应用是否全屏
  );
}

#[tauri::command]
async fn app_handle_test(app_handle: tauri::AppHandle) {
  let app_dir = app_handle.path_resolver().app_dir();
  println!("{:?}", app_dir);
  use tauri::GlobalShortcutManager;
  let r = app_handle
    .global_shortcut_manager()
    .register("CTRL + U", move || {})
    .unwrap();
  println!("{:?}", r);
}

struct DatabaseState {
  connnted: bool,
}

fn connect_db() -> DatabaseState {
  DatabaseState { connnted: true }
}

#[tauri::command]
fn query_data(state: tauri::State<DatabaseState>) {
  assert_eq!(state.connnted, true);
  println!("query data success")
}

// fn main() {
//   tauri::Builder::default()
//     .manage(connect_db()) //初始化时，连接db
//     .invoke_handler(tauri::generate_handler![query_data])
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

fn main() {
  tauri::Builder::default()
    .manage(connect_db())
    .invoke_handler(tauri::generate_handler![
      hello1,
      hello2,
      hello3,
      fibonacci,
      get_person,
      is_valid_age,
      method_1,
      get_window_label,
      app_handle_test,
      query_data
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

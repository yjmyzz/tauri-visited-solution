#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

#[tauri::command]
async fn open_about(handle: tauri::AppHandle) {
  tauri::WindowBuilder::new(
    &handle,
    "about", /* the unique window label */
    tauri::WindowUrl::App("/about".into()),
  )
  .inner_size(400.0, 300.0)
  .title("关于我们")
  .center()
  .build()
  .unwrap();
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![open_about])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

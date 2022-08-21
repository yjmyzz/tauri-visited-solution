#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::Manager;

fn main() {
  tauri::Builder::default()
    .setup(|app| {
      let splashscreen_window = app.get_window("splashscreen").unwrap();
      let main_window = app.get_window("home").unwrap();
      // we perform the initialization code on a new task so the app doesn't freeze
      tauri::async_runtime::spawn(async move {
        // initialize your app here instead of sleeping :)
        println!("Initializing...");
        //等待5秒后，再显示主窗口
        std::thread::sleep(std::time::Duration::from_secs(5));
        println!("Done initializing.");

        // After it's done, close the splashscreen and display the main window
        splashscreen_window.close().unwrap();
        main_window.show().unwrap();
      });
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

// #[tauri::command]
// async fn close_splashscreen(window: tauri::Window) {
//   // Close splashscreen
//   if let Some(splashscreen) = window.get_window("splashscreen") {
//     //模拟home主窗口加载慢，刻意停2秒(实际生产中可酌情去掉)
//     std::thread::sleep(std::time::Duration::from_secs(2));
//     splashscreen.close().unwrap();
//   }
//   // Show main window
//   window.get_window("home").unwrap().show().unwrap();
// }

// fn main() {
//   tauri::Builder::default()
//     .invoke_handler(tauri::generate_handler![close_splashscreen])
//     .run(tauri::generate_context!())
//     .expect("error while running tauri application");
// }

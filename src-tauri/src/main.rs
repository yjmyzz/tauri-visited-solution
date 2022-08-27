#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use tauri::{
  CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem,
};

fn main() {
  let quit = CustomMenuItem::new("quit".to_string(), "关闭窗口");
  let hide = CustomMenuItem::new("hide".to_string(), "隐藏窗口");
  let tray_menu = SystemTrayMenu::new()
    .add_item(quit)
    .add_native_item(SystemTrayMenuItem::Separator)
    .add_item(hide);

  let system_tray = SystemTray::new().with_menu(tray_menu);

  tauri::Builder::default()
    .system_tray(system_tray)
    .on_system_tray_event(|app, event| menu_handle(app, event))
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

fn menu_handle(app_handle: &tauri::AppHandle, event: SystemTrayEvent) {
  match event {
    SystemTrayEvent::LeftClick {
      position: _,
      size: _,
      ..
    } => {
      println!("鼠标-左击");
    }
    SystemTrayEvent::RightClick {
      position: _,
      size: _,
      ..
    } => {
      println!("鼠标-右击");
    }
    SystemTrayEvent::DoubleClick {
      position: _,
      size: _,
      ..
    } => {
      println!("鼠标-双击");
    }
    SystemTrayEvent::MenuItemClick { id, .. } => match id.as_str() {
      "quit" => {
        std::process::exit(0);
      }
      "hide" => {
        let item_handle = app_handle.tray_handle().get_item(&id);
        let window = app_handle.get_window("home").unwrap();
        if window.is_visible().unwrap() {
          window.hide().unwrap();
          item_handle.set_title("显示窗口").unwrap();
        } else {
          window.show().unwrap();
          item_handle.set_title("隐藏窗口").unwrap();
        }
      }
      _ => {}
    },
    _ => {}
  }
}

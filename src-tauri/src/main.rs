#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use perf_monitor::cpu::{processor_numbers, ProcessStat, ThreadStat};
use perf_monitor::fd::fd_count_cur;
use perf_monitor::io::get_process_io_stats;
use perf_monitor::mem::get_process_memory_info;
use std::sync::atomic::{AtomicBool, Ordering};
use std::time::{SystemTime, UNIX_EPOCH};
use std::{thread, time};
use tauri::Window;

/**
 * 获取系统时间戳
 */
fn timestamp() -> i64 {
  let start = SystemTime::now();
  let since_the_epoch = start
    .duration_since(UNIX_EPOCH)
    .expect("Time went backwards");
  let ms = since_the_epoch.as_secs() as i64 * 1000i64
    + (since_the_epoch.subsec_nanos() as f64 / 1_000_000.0) as i64;
  ms
}

#[derive(Clone, serde::Serialize)]
struct Payload {
  /**
   * cpu、内存等指标数据
   */
  message: Vec<String>,
  /**
   * 系统时间戳
   */
  timestamp: i64,
}

/**
 * 获取【cpu/内存/文件描述符数量/io】监控值
 */
fn monitor() -> Vec<String> {
  // cpu
  let core_num = processor_numbers().unwrap();
  let mut stat_p = ProcessStat::cur().unwrap();
  let mut stat_t = ThreadStat::cur().unwrap();

  let usage_p = stat_p.cpu().unwrap() * 100f64;
  let usage_t = stat_t.cpu().unwrap() * 100f64;

  let mut monitor_message: Vec<String> = Vec::with_capacity(3);

  monitor_message.push(format!(
    "[CPU] core Number: {}, process usage: {:.2}%, current thread usage: {:.2}%",
    core_num, usage_p, usage_t
  ));

  // mem
  let mem_info = get_process_memory_info().unwrap();

  monitor_message.push(format!(
    "[Memory] memory used: {} bytes, virtural memory used: {} bytes ",
    mem_info.resident_set_size, mem_info.virtual_memory_size
  ));

  // fd
  let fd_num = fd_count_cur().unwrap();
  monitor_message.push(format!("[FD] fd number: {}", fd_num));
  // println!("[FD] fd number: {}", fd_num);

  // io
  let io_stat = get_process_io_stats().unwrap();
  monitor_message.push(format!(
    "[IO] io-in: {} bytes, io-out: {} bytes",
    io_stat.read_bytes, io_stat.write_bytes
  ));

  monitor_message
}

//全局变量，防止多次调用init_process，每次都创建1个线程，重复触发事件
static FLAG: AtomicBool = AtomicBool::new(false);

#[tauri::command]
fn init_process(window: Window) {
  println!("init_process called");
  if !FLAG.fetch_and(true, Ordering::Acquire) {
    FLAG
      .fetch_update(Ordering::SeqCst, Ordering::SeqCst, |x| Some(true))
      .unwrap();

    //单独起个线程，1秒钟发1次事件
    std::thread::spawn(move || loop {
      window
        .emit(
          //事件名
          "my-event",
          Payload {
            message: monitor(),
            timestamp: timestamp(),
          },
        )
        .unwrap();
      println!("emit:{}", timestamp().to_string());
      //1秒1次
      thread::sleep(time::Duration::from_secs(1));
    });
  } else {
    println!("already emitted");
  }
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![init_process])
    .run(tauri::generate_context!())
    .expect("failed to run app");
}

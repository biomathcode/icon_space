use actix_web::{ get, App, HttpResponse, HttpServer, Responder };

use tauri_plugin_sql;
use std::env;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[get("/")]
async fn hello() -> impl Responder {
    HttpResponse::Ok().json("hello")
}

fn main() {
    tauri::Builder

        ::default()
        .setup(|app| {
            tauri::async_runtime::spawn(
                HttpServer::new(|| { App::new().service(hello) })
                    .bind(("127.0.0.1", 8080))?
                    .run()
            );
            Ok(())
        })
        .plugin(tauri_plugin_sql::Builder::default().build())
        .invoke_handler(tauri::generate_handler![greet])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

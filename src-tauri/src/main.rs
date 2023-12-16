use actix_web::{ get, App, HttpResponse, HttpServer, Responder, web };

use sqlx::{ SqlitePool, Row, FromRow };
use tauri::{ api::path::{ BaseDirectory, resolve_path }, Manager };
use serde::{ Deserialize, Serialize };

#[derive(Clone, FromRow, Debug, Deserialize, Serialize)]
struct Icon {
    id: i64,
    name: String,
    svg: String,
}

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

struct AppState {
    app_name: String,
}

#[get("/")]
async fn hello(data: web::Data<AppState>) -> impl Responder {
    let db = SqlitePool::connect(&data.app_name).await.unwrap();

    let icons_result = sqlx
        ::query_as::<_, Icon>("SELECT name, id, svg
         FROM icons;")
        .fetch_all(&db).await
        .unwrap();

    HttpResponse::Ok().json(icons_result)
}

fn main() {
    tauri::Builder

        ::default()
        .setup(|app| {
            let path = resolve_path(
                &app.config(),
                app.package_info(),
                &app.env(),
                "com.coolhead.dev/track3.db",
                Some(BaseDirectory::Config)
            )?;

            let sqlit_dir = path.to_str().to_owned().unwrap().to_string();

            println!("{:?}", path.to_str().unwrap());

            tauri::async_runtime::spawn(
                HttpServer::new(move || {
                    App::new()
                        .app_data(
                            web::Data::new(AppState {
                                app_name: sqlit_dir.to_owned(),
                            })
                        )
                        .service(hello)
                })
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

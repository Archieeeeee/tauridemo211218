#![cfg_attr(
all(not(debug_assertions), target_os = "windows"),
windows_subsystem = "windows"
)]

use std::collections::{HashMap, HashSet};
use std::error::Error;
use std::str::FromStr;
use clap::Arg;
use tauri::{App, AppHandle, Manager, Wry};
use tracing::{debug, error, trace, info, warn, event};
use tracing_subscriber::{EnvFilter, Layer};
use serde::{Deserialize, Serialize};
use serde_json::{json, Map, Value};

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let matches = clap::App::new("aa")
        .arg(Arg::new("log").long("log").value_name("log"))
        .get_matches();

    let mut log_level = tracing::Level::DEBUG;
    if let Some(s) = matches.value_of("log") {
        log_level = tracing::Level::from_str(s).unwrap();
    }

    tracing_subscriber::fmt().with_target(true).with_max_level(log_level).init();


    // std::env::set_var("WEBVIEW2_ADDITIONAL_BROWSER_ARGUMENTS", "--proxy-server=socks5://127.0.0.1:27007");
    tauri::Builder::default()
        .setup(|app| {
            // listen to the `event-name` (emitted on any window)
            let id = app.listen_global("webEvent", |event| {
                debug!("got event-name with payload {:?}", event.payload());
            });
            // app.unlisten(id);
            // app.emit_all("backendEvent", Payload { message: "Tauri is awesome!".into() }).unwrap();
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![handle_js_json])

        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}

#[tauri::command]
async fn handle_js_json(window: tauri::Window<>, app: tauri::AppHandle<>, json: String) -> String {
    // debug!("handle_js_json {}", json);

    let mut jd = serde_json::from_str::<serde_json::Value>(json.as_str()).unwrap();
    debug!("handle_js_json jd {:?}", jd);

    let cmd = jd.get("cmd").unwrap().as_str().unwrap();
    // debug!("handle_js_json cmd {}", cmd);

    let mut sd: serde_json::Map<String, serde_json::Value> = serde_json::Map::new();
    match cmd {
        "landingCreated" => {
            sd.insert("cmd".to_string(), serde_json::Value::String("loadMainWeb".to_string()));
            sd.insert("mainUrl".to_string(), serde_json::Value::String("http://localhost:3002".to_string()));
            // sd.insert("mainUrl".to_string(), serde_json::Value::String("http://backend.yunsurf.xyz/aiong/web/aiongwebnative/index.html".to_string()));
        }
        "webCreated" => {
            send_to_web("sayWelcome", "Welcome to tauri", &app);
        }

        x => {
            error!("handle_js_json unhandled cmd {}", cmd);
        }
    }
    app.emit_all("backendEvent", sd).unwrap();

    return "{}".to_string();
}

fn send_to_web<T>(cmd: &str, obj: T, app: &AppHandle) where T: Serialize {
    let mut sd: serde_json::Map<String, serde_json::Value> = serde_json::Map::new();
    sd.insert("cmd".to_string(), serde_json::Value::String(cmd.to_string()));
    sd.insert("obj".to_string(), serde_json::to_value(obj).unwrap());
    app.emit_all("backendEvent", sd).unwrap();
}


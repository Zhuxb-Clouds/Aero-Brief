mod rss_manager;
mod gemini_manager;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn fetch_feed(url: String) -> Result<Vec<rss_manager::RssArticle>, String> {
    rss_manager::fetch_rss(&url).await
}

#[tauri::command]
async fn summarize_article(text: String, api_key: String) -> Result<String, String> {
    gemini_manager::summarize_text(&text, &api_key).await
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, fetch_feed, summarize_article])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

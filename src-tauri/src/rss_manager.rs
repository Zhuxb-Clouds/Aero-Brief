use serde::{Deserialize, Serialize};
use rss::Channel;

#[derive(Debug, Serialize, Deserialize)]
pub struct RssArticle {
    pub title: String,
    pub link: String,
    pub description: String,
    pub pub_date: String,
}

pub async fn fetch_rss(url: &str) -> Result<Vec<RssArticle>, String> {
    let content = reqwest::get(url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;
        
    let channel = Channel::read_from(&content[..])
        .map_err(|e| e.to_string())?;
    
    let articles = channel.items().iter().map(|item| {
        RssArticle {
            title: item.title().unwrap_or_default().to_string(),
            link: item.link().unwrap_or_default().to_string(),
            description: item.description().unwrap_or_default().to_string(),
            pub_date: item.pub_date().unwrap_or_default().to_string(),
        }
    }).collect();

    Ok(articles)
}

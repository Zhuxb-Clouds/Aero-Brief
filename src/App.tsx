import { useState } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";

interface Article {
  title: string;
  link: string;
  description: string;
  pub_date: string;
}

function App() {
  const [rssUrl, setRssUrl] = useState("https://hnrss.org/frontpage");
  const [apiKey, setApiKey] = useState("");
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [summaries, setSummaries] = useState<Record<number, string>>({});
  const [summarizing, setSummarizing] = useState<Record<number, boolean>>({});

  async function fetchFeed() {
    // @ts-ignore
    if (!window.__TAURI_INTERNALS__) {
      setError("Error: This app must be run within the Tauri window, not in a browser.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await invoke<Article[]>("fetch_feed", { url: rssUrl });
      setArticles(res);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }

  async function summarize(index: number, text: string) {
    if (!apiKey) {
      alert("Please enter a Gemini API Key");
      return;
    }
    setSummarizing(prev => ({ ...prev, [index]: true }));
    try {
      // Use description for summary for now, ideally we fetch the full content
      const summary = await invoke<string>("summarize_article", { text, apiKey });
      setSummaries(prev => ({ ...prev, [index]: summary }));
    } catch (e) {
      alert("Failed to summarize: " + e);
    } finally {
      setSummarizing(prev => ({ ...prev, [index]: false }));
    }
  }

  return (
    <main className="container">
      <h1>AeroBrief</h1>
      
      <div className="row" style={{ marginBottom: "20px", flexDirection: "column", gap: "10px" }}>
        <div className="row">
            <input
            value={apiKey}
            onChange={(e) => setApiKey(e.currentTarget.value)}
            placeholder="Enter Gemini API Key..."
            type="password"
            style={{ width: "300px" }}
            />
        </div>
        <div className="row">
            <input
            value={rssUrl}
            onChange={(e) => setRssUrl(e.currentTarget.value)}
            placeholder="Enter RSS URL..."
            style={{ width: "300px" }}
            />
            <button onClick={fetchFeed} disabled={loading}>
            {loading ? "Fetching..." : "Fetch Feed"}
            </button>
        </div>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="articles">
        {articles.map((article, i) => (
          <div key={i} className="article-card" style={{ border: "1px solid #ccc", margin: "10px", padding: "10px", textAlign: "left" }}>
            <h3><a href={article.link} target="_blank">{article.title}</a></h3>
            <p style={{ fontSize: "0.8em", color: "#666" }}>{article.pub_date}</p>
            <div dangerouslySetInnerHTML={{ __html: article.description }} />
            
            <div style={{ marginTop: "10px" }}>
                <button 
                    onClick={() => summarize(i, article.description)} 
                    disabled={summarizing[i] || !!summaries[i]}
                    style={{ fontSize: "0.8em", padding: "5px 10px" }}
                >
                    {summarizing[i] ? "Summarizing..." : summaries[i] ? "Summarized" : "Summarize with AI"}
                </button>
            </div>
            {summaries[i] && (
                <div style={{ marginTop: "10px", padding: "10px", backgroundColor: "#f0f0f0", borderRadius: "5px" }}>
                    <strong>AI Summary:</strong>
                    <p>{summaries[i]}</p>
                </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default App;

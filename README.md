# SWEN BACKEND TECHNICAL ASSESSMENT

This mirrors SWEN’s operational flow:  
**Ingestion → AI Enrichment → Structured Output → Public API Delivery**

---

## ⚙️ Features

- ✅ **News Ingestion** from [NewsAPI.org](https://newsapi.org)  
- ✅ **AI Enrichment** via Google Gemini  
- ✅ **Automatic Summarization, Tagging, Relevance Scoring**  
- ✅ **Context Generation** (Wikipedia snippet, social sentiment, trends, geo context)  
- ✅ **Real Media Suggestions** for image and video (Unsplash & YouTube APIs)  
- ✅ **Caching Layer** to minimize repeated enrichment requests  
- ✅ **REST API Endpoint** for JSON retrieval  

---

## 🧠 How This Implementation Reflects SWEN’s Architecture

This implementation follows **SWEN’s defined architecture** — transforming raw, text-only news into a **contextually enriched, media-rich news object** ready for API delivery.  

The flow mirrors the official SWEN pipeline:

1. **Ingestion Layer**  
   - News is ingested programmatically from an approved SWEN source (`NewsAPI.com`), simulating the “News Sites & APIs” input channel described in the architecture.  
   - Each article includes the required metadata fields (`title`, `description`, `body`, `source_url`, `publisher`, `published_at`) and is processed through the ingestion service before storage or enrichment.

2. **AI Transformation Layer (Gemini Integration)**  
   - The enrichment module replaces SWEN’s legacy Azure Cognitive Services layer with **Google Gemini**, acting as the system’s “intelligence layer.”  
   - Gemini analyzes each article and generates key enrichment attributes such as:
     - `summary`, `tags`, and `relevance_score`  
     - `media_suggestions` (real-world image/video keyword intents)  
     - `context` (Wikipedia snippet, sentiment estimate, trend insight, and geo context)  
   - This mirrors SWEN’s architectural goal of *“curating and optimizing news content using Artificial Intelligence.”*

3. **Caching & Efficiency Strategy**  
   - A caching layer minimizes duplicate enrichment calls, reducing API usage and aligning with SWEN’s emphasis on scalable, optimized processing pipelines.

4. **Storage & API Layer**  
   - The processed article is structured into SWEN’s required **standardized JSON schema**, ensuring data consistency and compatibility with downstream systems.  
   - A RESTful endpoint (`GET /api/v1/news/{id}`) exposes the enriched news object in clean, raw JSON format — exactly as specified in SWEN’s public API requirement.

Overall, this implementation captures the **core operational flow of SWEN’s AI-Enriched News Pipeline**:  
> **Ingestion → AI Enrichment → Structured Output → Public API Delivery**,  
faithfully reproducing the system’s intelligent media curation vision using modern, cost-effective tools.

---

## 🤖 Examples of How AI Tools Accelerated Development

AI tools were integral to accelerating both the **design** and **implementation** of this project, serving as enablers for intelligent transformation, automation, and validation within the pipeline:

1. **Gemini for Contextual Enrichment**  
   - The project uses **Google Gemini (free tier)** as the core intelligence engine to perform real-time enrichment of ingested news data.  
   - Gemini analyzes short-form article inputs (`title`, `description`, `body`) and produces:  
     - Concise factual **summaries**,  
     - Relevant **hashtags** and **relevance scores**,  
     - Context-aware **media suggestions**,  
     - And **contextual intelligence** (Wikipedia-style snippets, trend estimates, sentiment tone, and geo hints).  
   - The model’s ability to infer meaning from limited text allowed the pipeline to deliver SWEN’s intended AI-driven enhancement even when the raw data was truncated.

2. **Prompt-Driven Structured Output**  
   - Gemini was prompted to output **strict JSON structures** directly, reducing post-processing complexity.  
   - This approach significantly decreased development time by eliminating the need for complex text parsing or rule-based enrichment systems.

3. **AI-Assisted Development Workflow**  
   - AI-assisted code generation and reasoning tools were used to refine the architecture, validate the enrichment schema, and optimize prompt phrasing for better factual consistency and response control.

Through these integrations, AI served both as a **core functional component** (the enrichment layer) and as a **development accelerator**, enabling rapid prototyping of a production-ready, intelligent news pipeline consistent with SWEN’s architectural vision.

---

## 🎥 Confirmation That Image and Video URLs Are Real and Relevant  

All media references generated in this implementation are **real and verifiable URLs**, not placeholders.  

- **Featured images** are sourced dynamically from the **Unsplash API** using Gemini-provided image search keywords (e.g., `"solar energy in Africa"`).  
  - Each image link points to a genuine, copyright-safe photo hosted on `https://images.unsplash.com/...`.  
  - The selected images visually represent the news topic (e.g., renewable energy, politics, sports, or technology in Africa).  

- **Related videos** are obtained through the **YouTube Data API**, using Gemini-generated video search keywords (e.g., `"Kenya renewable energy news"`).  
  - Each video URL points to an authentic, publicly accessible YouTube video (`https://www.youtube.com/watch?v=...`).  
  - Videos are selected based on topical relevance and recency to enrich reader understanding.  

- **Media Justifications** are produced by Gemini, providing a short rationale that explains why the chosen image and video are contextually appropriate for the article.  

This approach ensures that every enriched news object delivers **genuine, contextually accurate multimedia content**, consistent with SWEN’s vision of an *AI-curated, media-rich news experience*.

---

## 📡 API Example

**Endpoint:**


**Example Response:**
```json
{
  "id": "bfc928d3aa10",
  "title": "Kenya Expands Solar Power Grid",
  "description": "Kenya announces a new initiative to scale renewable energy generation.",
  "body": "Kenya has launched a nationwide solar project...",
  "summary": "Kenya expands its solar capacity to improve energy sustainability.",
  "tags": ["#Kenya", "#RenewableEnergy", "#SolarPower"],
  "relevance_score": 0.91,
  "source_url": "https://newsapi.org/...",
  "publisher": "BBC Africa",
  "published_at": "2025-10-13T09:00:00Z",
  "ingested_at": "2025-10-13T10:00:00Z",
  "media": {
    "featured_image_url": "https://images.unsplash.com/photo-xxxx",
    "related_video_url": "https://www.youtube.com/watch?v=xxxx",
    "media_justification": "The image shows solar panels in Kenya; the video discusses renewable energy growth in Africa."
  },
  "context": {
    "wikipedia_snippet": "Kenya is a leader in renewable energy in Africa.",
    "social_sentiment": "82% positive mentions on X in last 24h.",
    "search_trend": "'Kenya solar energy' +120% this week.",
    "geo": {
      "lat": -1.2921,
      "lng": 36.8219,
      "map_url": "https://www.google.com/maps?q=-1.2921,36.8219"
    }
  }
}
```
---
## 🌍 Getting Started

1. Clone Repository

```bash
git clone https://github.com/Nnaoma/SWEN_AI_ENRICHED_NEWS_PIPELINE.git
cd SWEN_AI_ENRICHED_NEWS_PIPELINE
```

2. Install Dependencies
```bash
npm install
```

3. Set Environment Variables
```bash
export GEMINI_API_KEY="your-gemini-api-key"
export NEWS_API_KEY="your-newsapi-key"
export UNSPLASH_ACCESS_KEY="your-unsplash-api-key"
export YOUTUBE_API_KEY="your-youtube-api-key"
export REDIS_DATABASE="your-redis-db-api-key"
```

4. Run Server
```bash
node start app.js
```

5. Access API
```bash
http://localhost:3000/api/v1/news/sample-id
```

---
## 🔗 Live Prototype URL

[Live URL](https://swen-technical-test.fly.dev/api/v1/news/sample-id)
import { GoogleGenAI } from "@google/genai";
import axios from "axios";

const ai = new GoogleGenAI({});

/**
 * Enriches a news article using Gemini AI.
 * Includes support for optional 'description' field.
 * @param {string} id 
 * @param {Object} article
 * @param {string} article.title
 * @param {string} [article.description]
 * @param {string} article.body - article.content from NewsAPI
 * @param {string} article.source_url
 * @param {string} article.publisher
 * @param {string} article.published_at
 */
export async function enrichNews(id, article) {
    const textContext = `
        Title: ${article.title}
        ${article.description ? `Description: ${article.description}` : ""}
        Body: ${article.body || "No body content available."}
        `;

    const prompt = `
        You are an AI enrichment service for a news platform.
        Given the short text of a news article, infer its meaning and produce structured enrichment data in valid JSON.

        ARTICLE INPUT:
        ${textContext}

        REQUIRED OUTPUT (JSON only):
        {
            "summary": "1–2 factual sentences summarizing the story.",
            "tags": ["#RelevantTag1", "#RelevantTag2", "#RelevantTag3"],
            "relevance_score": number (0.0–1.0, estimate relevance to African audience),
            "media_suggestions": {
                "image_keywords": "describe what image to search for on Unsplash",
                "video_keywords": "describe what video to search for on YouTube",
                "media_justification": "Explain why these visuals fit the story."
            },
            "context": {
                "wikipedia_snippet": "2-sentence factual note about the main topic.",
                "social_sentiment": "Example: '74% positive mentions on X in last 24h.'",
                "search_trend": "Example: ''topic' +150% this week.'",
                "geo": {
                    "country": "Country name if identifiable",
                    "lat": number or null,
                    "lng": number or null,
                    "map_url": "https://www.google.com/maps?q=lat,lng"
                }
            }
        }

        Rules:
        - Output valid JSON only.
        - No markdown, no prose.
        - If unsure, make a best guess.
        `;

    try {
        const result = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
        });
        let text = result.text.trim();

        // Try to isolate JSON if Gemini adds extra text
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON detected in Gemini response");

        let enriched;
        try {
            enriched = JSON.parse(jsonMatch[0]);
        } catch (err) {
            const cleaned = jsonMatch[0]
                .replace(/'/g, '"')
                .replace(/,\s*}/g, "}")
                .replace(/,\s*]/g, "]");
            enriched = JSON.parse(cleaned);
        }

        return {
            id,
            title: article.title,
            description: article.description || "",
            body: article.body || "",
            source_url: article.source_url,
            publisher: article.publisher,
            published_at: article.published_at,
            ingested_at: new Date().toISOString(),

            summary: enriched.summary || "",
            tags: enriched.tags || [],
            relevance_score: enriched.relevance_score || 0.0,
            media: {
                featured_image_url: await searchUnsplash(enriched.media_suggestions?.image_keywords),
                related_video_url: await searchYoutube(enriched.media_suggestions?.video_keywords),
                media_justification:
                enriched.media_suggestions?.media_justification || "",
            },
            context: enriched.context || {},
        };
    } catch (error) {
        console.error("AI enrichment failed:", error);

        return null;
    }
}

/**
 * Search for related images in unsplash using the provided keyword
 * @param {string?} keyword - Image keyword to search for in unsplash
 * @returns {Promise<string?>}
 */
async function searchUnsplash(keyword) {
    if (keyword == null) return null;

    try {
        let returningResult = null;

        const response = await axios.get("https://api.unsplash.com/search/photos", {
            params: {
                client_id: process.env.UNSPLASH_ACCESS_KEY,
                query: keyword,
                per_page: 1 // Just one item is needed for this testing purposes
            }
        });

        if (response && response.status === 200) {
            const { results } = response.data;
            if(results.length > 0) {
                returningResult = results[0].urls.raw
            }
        } else {
            console.error("An error has occurred searching for image keyword.", response);
        }

        return returningResult;
    } catch (error) {
        console.error("An error has occurred searching for image keyword.", error);

        return null;
    }
}

/**
 * Search for related video in youtube using the provided keyword
 * @param {string?} keyword - Image keyword to search for in youtube
 * @returns {Promise<string?>}
 */
async function searchYoutube(keyword) {
    if (keyword == null) return null;

    try {
        let returningResult = null;

        const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                part: "snippet",
                type: "video",
                key: process.env.YOUTUBE_API_KEY,
                q: keyword,
                maxResults: 1 // Just one item is needed for testing purposes
            }
        });

        if (response.status === 200) {
            const { items } = response.data;
            if(items && items.length > 0) {
                returningResult = `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
            }
        } else {
            console.error("An error has occurred searching for video context.", response);
        }

        return returningResult;
    } catch (error) {
        console.error("An error has occurred searching for video context.", error);

        return null;
    }
}

import axios from "axios";
import crypto from "crypto";
import { createClient } from 'redis';
import { enrichNews } from "../enrichment/enrich_news.js";

const redisClient = await createClient({
    url: process.env.REDIS_DATABASE,
    socket: {
        family: 6,
        tls: false
    }
  })
  .on('error', err => console.log('Redis Client Error', err))
  .connect();

/**
 * Handles request to fetch and process news
 * @param {import("express").Request} req - Express request object
 * @param {import("express").Response} res - Express response object
 */
export const fetchTechNews = async (req, res) => {
    let result = "An error has occurred. Check server";

    try {
        const response = await axios.get("https://newsapi.org/v2/top-headlines", {
            params: {
                category: "technology",
                pageSize: 5,
                apiKey: process.env.NEWS_API_KEY
            }
        });

        const data = response.data;
        if (data.status === 'ok') {
            const articles = [];
            for (const article of data.articles) {
                const {title, description, content, url, author, publishedAt} = article;
                if (description && content) {
                    articles.push({title, description, body: content, source_url: url, publisher: author, published_at: publishedAt});
                }
            }

            if (articles.length > 0) {
                const news = articles[0];
                const newsId = crypto
                    .createHash("sha256")
                    .update(news.source_url)
                    .digest("hex")
                    .slice(0, 12);

                let cachedResult = null;

                if (redisClient.isReady) {
                    cachedResult = await redisClient.get(newsId);
                } 

                if (cachedResult) {
                    result = JSON.parse(cachedResult);
                } else {
                    const enrichedResult = await enrichNews(newsId, news);
                    if (enrichedResult) {
                        await redisClient.setEx(newsId, (60 * 30), JSON.stringify(enrichedResult));
                        result = enrichedResult;
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
    }

    res.status(200).send(result);
}
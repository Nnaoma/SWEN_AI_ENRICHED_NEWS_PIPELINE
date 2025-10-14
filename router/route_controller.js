import { Router } from "express";
import { fetchTechNews } from "./routes.js";

export const routes = Router();

routes.get("/api/v1/news/:id", fetchTechNews);

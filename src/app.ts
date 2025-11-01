import express from "express";
import cors from "cors";
import departmentRoutes from "./routes/DepartmentRoutes.ts";
import typeOfAssetRoutes from "./routes/TypeOfAsset.ts";
const app = express();
const API_PREFIX = "/api/v1";

app.use(cors());
app.use(express.json());
app.use(`${API_PREFIX}/departments`, departmentRoutes);
app.use(`${API_PREFIX}/type-of-assets`, typeOfAssetRoutes);

export default app;

import express from "express";
import cors from "cors";
import accountTypeRoutes from "./routes/base/AccountTypeRoutes.ts";
import currencyRoutes from "./routes/base/CurrencyRoutes.ts";
import accountRoutes from "./routes/base/AccountRoutes.ts";
import chartOfAccountRoutes from "./routes/base/ChartOfAccountRoutes.ts";
// ----
import employeeRoutes from "./routes/EmployeeRoutes.ts";
import departmentRoutes from "./routes/DepartmentRoutes.ts";
import typeOfAssetRoutes from "./routes/TypeOfAssetRoutes.ts";
import fixedAssetRoutes from "./routes/FixedAssetsRoutes.ts";
import depreciationRoutes from "./routes/DepreciationRoutes.ts";
const app = express();
const API_PREFIX = "/api/v1";
app.use(cors());
app.use(express.json());
app.use(`${API_PREFIX}/departments`, departmentRoutes);
app.use(`${API_PREFIX}/type-of-assets`, typeOfAssetRoutes);
app.use(`${API_PREFIX}/employees`, employeeRoutes);
app.use(`${API_PREFIX}/fixed-assets`, fixedAssetRoutes);
app.use(`${API_PREFIX}/depreciations`, depreciationRoutes);
// Seeded Entities
app.use(`${API_PREFIX}/accounts`, accountRoutes);
app.use(`${API_PREFIX}/currencies`, currencyRoutes);
app.use(`${API_PREFIX}/account-types`, accountTypeRoutes);
app.use(`${API_PREFIX}/chart-of-accounts`, chartOfAccountRoutes);

export default app;

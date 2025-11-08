import express from "express";
import cors from "cors";
import accountTypeRoutes from "./routes/AccountTypeRoutes.ts";
import currencyRoutes from "./routes/CurrencyRoutes.ts";
import accountRoutes from "./routes/AccountRoutes.ts";
import chartOfAccountRoutes from "./routes/AuxiliarySystemRoutes.ts";
import accountingEntryRoutes from "./routes/AccountingEntryRoutes.ts";
const app = express();
const API_PREFIX = "/api/v1";
app.use(cors());
app.use(express.json());
app.use(`${API_PREFIX}/accounts`, accountRoutes);
app.use(`${API_PREFIX}/currencies`, currencyRoutes);
app.use(`${API_PREFIX}/account-types`, accountTypeRoutes);
app.use(`${API_PREFIX}/auxiliary-systems`, chartOfAccountRoutes);
app.use(`${API_PREFIX}/accounting-entries`, accountingEntryRoutes);

export default app;

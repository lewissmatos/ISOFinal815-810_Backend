import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Department } from "../entities/Department.ts";
import { TypeOfAsset } from "../entities/TypeOfAsset.ts";
import { ChartOfAccount } from "../entities/base/ChartOfAccount.ts";
import { Currency } from "../entities/base/Currency.ts";
import { Employee } from "../entities/Employee.ts";
import { AccountType } from "../entities/base/AccountType.ts";
import { Account } from "../entities/base/Account.ts";
import { FixedAsset } from "../entities/FixedAsset.ts";
import { DepreciationCalculation } from "../entities/DepreciationCalculation.ts";
import { AccountingEntry } from "../entities/AccountingEntry.ts";

dotenv.config();

const parsePort = (value?: string, fallback = 1433) => {
	const n = value ? Number(value) : NaN;
	return Number.isInteger(n) && n > 0 ? n : fallback;
};

const parseBool = (value?: string, fallback = false) => {
	if (value === undefined) return fallback;
	return value === "true" || value === "1";
};

export const AppDataSource = new DataSource({
	type: "mssql",
	host: process.env.DB_HOST || "localhost",
	port: parsePort(process.env.DB_PORT, 1433),
	username: process.env.DB_USERNAME || "",
	password: process.env.DB_PASSWORD || "",
	database: process.env.DB_NAME || "",
	synchronize: true,
	logging: false,
	entities: [
		Department,
		TypeOfAsset,
		Employee,
		FixedAsset,
		DepreciationCalculation,
		AccountingEntry,
		...[AccountType, Account, ChartOfAccount, Currency] /* Seed Entities */,
	],
	options: {
		encrypt: parseBool(process.env.DB_ENCRYPT, false),
		connectTimeout: process.env.DB_CONNECT_TIMEOUT
			? Number(process.env.DB_CONNECT_TIMEOUT)
			: 30000,
	},
	// migrations: ["src/migration/**/*.ts"],
});

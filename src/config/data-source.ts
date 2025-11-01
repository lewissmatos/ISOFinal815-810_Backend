import "reflect-metadata";
import dotenv from "dotenv";
import { DataSource } from "typeorm";
import { Department } from "../entities/Department.ts";
import { TypeOfAsset } from "../entities/TypeOfAsset.ts";

dotenv.config();

// Helper to parse integer ports with a sensible default (MSSQL default 1433)
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
	entities: [Department, TypeOfAsset],
	options: {
		encrypt: parseBool(process.env.DB_ENCRYPT, false),
		connectTimeout: process.env.DB_CONNECT_TIMEOUT
			? Number(process.env.DB_CONNECT_TIMEOUT)
			: 30000,
	},
	// migrations: ["src/migration/**/*.ts"],
});

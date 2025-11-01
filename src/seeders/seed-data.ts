import "reflect-metadata";
import { AppDataSource } from "../config/data-source.ts";
import { AccountType } from "../entities/AccountType.ts";
import { Account } from "../entities/Account.ts";
import { ChartOfAccount } from "../entities/ChartOfAccount.ts";
import { Currency } from "../entities/Currency.ts";
import type { Base } from "../entities/Base.ts";
import type { DeepPartial } from "typeorm";

export async function seedData() {
	console.log("🌱 Starting seeding process...");

	// 1️⃣ Ensure DB connection
	if (!AppDataSource.isInitialized) {
		await AppDataSource.initialize();
		console.log("✅ Database connected");
	}

	const accountTypeRepo = AppDataSource.getRepository(AccountType);
	const currencyRepo = AppDataSource.getRepository(Currency);
	const chartOfAccountRepo = AppDataSource.getRepository(ChartOfAccount);
	const accountRepo = AppDataSource.getRepository(Account);

	async function seedIfEmpty<T extends { id: number }>(
		repo: ReturnType<typeof AppDataSource.getRepository<T>>,
		name: "AccountType" | "Currency" | "Account" | "ChartOfAccount",
		data: DeepPartial<T>[]
	) {
		const count = await repo.count();
		if (count > 0) {
			console.log(`⚠️  ${name} already has data — skipping...`);
			return;
		}
		const createdData = repo.create(data);
		await repo.save(createdData);
		console.log(`✅  ${name} seeded successfully`);
	}

	// Tipos de cuenta
	await seedIfEmpty(accountTypeRepo, "AccountType", [
		{ id: 1, description: "Activos", origin: "DB" },
		{ id: 2, description: "Pasivos", origin: "CR" },
		{ id: 3, description: "Capital", origin: "CR" },
		{ id: 4, description: "Ingresos", origin: "CR" },
		{ id: 5, description: "Costos", origin: "DB" },
		{ id: 6, description: "Gastos", origin: "DB" },
	]);

	// Tipos de cuenta
	await seedIfEmpty(currencyRepo, "Currency", [
		{ id: 1, ISOCode: "DOP", description: "Peso", exchangeRate: 1 },
		{ id: 2, ISOCode: "USD", description: "Dollar", exchangeRate: 45.87 },
		{ id: 3, ISOCode: "EUR", description: "Euro", exchangeRate: 57.89 },
	]);

	// Catalogo de Auxiliares
	await seedIfEmpty(chartOfAccountRepo, "ChartOfAccount", [
		{ id: 1, description: "Contabilidad" },
		{ id: 2, description: "Nomina" },
		{ id: 3, description: "Facturacion" },
		{ id: 4, description: "Inventario" },
		{ id: 5, description: "Cuentas x Cobrar" },
		{ id: 6, description: "Cuentas x Pagar" },
		{ id: 7, description: "Compras" },
		{ id: 8, description: "Activos Fijos" },
		{ id: 9, description: "Cheques" },
	]);

	// Cuentas
	await seedIfEmpty(accountRepo, "Account", [
		{
			id: 1,
			description: "Activos",
			allowsMovement: "N" as const,
			type: 1,
			level: 1,
			balance: 0,
			parentAccountCode: null,
		},
		{
			id: 2,
			description: "Efectivo en caja y banco",
			allowsMovement: "N" as const,
			type: 1,
			level: 2,
			balance: 0,
			parentAccountCode: 1,
		},
		{
			id: 3,
			description: "Caja Chica",
			allowsMovement: "S" as const,
			type: 1,
			level: 3,
			balance: 0,
			parentAccountCode: 2,
		},
		{
			id: 4,
			description: "Cuenta Corriente Banco x",
			allowsMovement: "S" as const,
			type: 1,
			level: 3,
			balance: 0,
			parentAccountCode: 3,
		},
		{
			id: 5,
			description: "Inventarios y Mercancias",
			allowsMovement: "N" as const,
			type: 1,
			level: 2,
			balance: 0,
			parentAccountCode: 1,
		},
		{
			id: 6,
			description: "Inventario",
			allowsMovement: "S" as const,
			type: 1,
			level: 3,
			balance: 0,
			parentAccountCode: 5,
		},
		{
			id: 7,
			description: "Cuentas x Cobrar",
			allowsMovement: "N" as const,
			type: 1,
			level: 2,
			balance: 0,
			parentAccountCode: 1,
		},
		{
			id: 8,
			description: "Cuentas x Cobrar Cliente X",
			allowsMovement: "S" as const,
			type: 1,
			level: 3,
			balance: 0,
			parentAccountCode: 7,
		},
		{
			id: 12,
			description: "Ventas",
			allowsMovement: "N" as const,
			type: 4,
			level: 2,
			balance: 0,
			parentAccountCode: 9,
		},
		{
			id: 13,
			description: "Ingresos x Ventas",
			allowsMovement: "S" as const,
			type: 4,
			level: 3,
			balance: 0,
			parentAccountCode: 12,
		},
		{
			id: 47,
			description: "Gastos",
			allowsMovement: "N" as const,
			type: 6,
			level: 1,
			balance: 0,
			parentAccountCode: null,
		},
		{
			id: 48,
			description: "Gastos Administrativos",
			allowsMovement: "N" as const,
			type: 6,
			level: 2,
			balance: 0,
			parentAccountCode: 47,
		},
		{
			id: 50,
			description: "Gastos Generales",
			allowsMovement: "S" as const,
			type: 6,
			level: 3,
			balance: 0,
			parentAccountCode: 48,
		},
		{
			id: 65,
			description: "Gasto depreciación Activos Fijos",
			allowsMovement: "N" as const,
			type: 6,
			level: 2,
			balance: 0,
			parentAccountCode: 47,
		},
		{
			id: 66,
			description: "Depreciación Acumulada Activos Fijos",
			allowsMovement: "S" as const,
			type: 6,
			level: 3,
			balance: 0,
			parentAccountCode: 65,
		},
		{
			id: 70,
			description: "Salarios y Sueldos Empleados",
			allowsMovement: "S" as const,
			type: 2,
			level: 3,
			balance: 0,
			parentAccountCode: 18,
		},
		{
			id: 71,
			description: "Gastos de Nomina Empresa",
			allowsMovement: "S" as const,
			type: 6,
			level: 3,
			balance: 0,
			parentAccountCode: 58,
		},
		{
			id: 80,
			description: "Compra de Mercancias",
			allowsMovement: "S" as const,
			type: 5,
			level: 3,
			balance: 0,
			parentAccountCode: 78,
		},
		{
			id: 81,
			description: "Cuentas x Pagar",
			allowsMovement: "N" as const,
			type: 2,
			level: 2,
			balance: 0,
			parentAccountCode: 19,
		},
		{
			id: 82,
			description: "Cuentas x Pagar Proveedor X",
			allowsMovement: "S" as const,
			type: 2,
			level: 3,
			balance: 0,
			parentAccountCode: 81,
		},
		{
			id: 83,
			description: "Cuentas Cheques en Banco X",
			allowsMovement: "S" as const,
			type: 1,
			level: 3,
			balance: 0,
			parentAccountCode: 3,
		},
	]);

	console.log("🌾 Seeding finished!");
}

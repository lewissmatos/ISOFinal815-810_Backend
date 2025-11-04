import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { TypeOfAsset } from "./TypeOfAsset.ts"; // si relacionas con el tipo de inventario
import { Account } from "./base/Account.ts";
import { DepreciationCalculation } from "./DepreciationCalculation.ts";
import { decimalTransformer } from "../utils/transformers.ts";

@Entity({ name: "accounting_entries" })
export class AccountingEntry {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	description: string;

	@ManyToOne(() => TypeOfAsset, { nullable: true })
	@JoinColumn({ name: "inventoryTypeId" })
	inventoryType?: TypeOfAsset;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "accountId" })
	account: Account;

	@ManyToOne(
		() => DepreciationCalculation,
		(calculation) => calculation.accountingEntries,
		{ nullable: true }
	)
	@JoinColumn({ name: "depreciationCalculationId" })
	depreciationCalculation: DepreciationCalculation;

	@Column({ type: "char", length: 2 })
	movementType: "DB" | "CR";

	@Column({ type: "date" })
	entryDate: Date;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		transformer: decimalTransformer,
	})
	amount: number;

	@Column({ default: "PENDIENTE" })
	status: "PENDIENTE" | "PROCESADO" | "ANULADO";
}

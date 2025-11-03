import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { TypeOfAsset } from "./TypeOfAsset"; // si relacionas con el tipo de inventario
import { ChartOfAccount } from "./base/ChartOfAccount";

@Entity({ name: "accounting_entries" })
export class AccountingEntry {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 255 })
	description: string;

	@ManyToOne(() => TypeOfAsset, { nullable: true })
	@JoinColumn({ name: "inventoryTypeId" })
	inventoryType?: TypeOfAsset;

	@ManyToOne(() => ChartOfAccount)
	@JoinColumn({ name: "accountId" })
	account: ChartOfAccount;

	@Column({ type: "char", length: 2 })
	movementType: "DB" | "CR";

	@Column({ type: "date" })
	entryDate: Date;

	@Column({ type: "decimal", precision: 18, scale: 2 })
	amount: number;

	@Column({ default: "PENDIENTE" })
	status: "PENDIENTE" | "PROCESADO" | "ANULADO"; // Estado
}

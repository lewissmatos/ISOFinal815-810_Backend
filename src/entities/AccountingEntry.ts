import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { decimalTransformer } from "../utils/transformers.ts";
import { AuxiliarySystem } from "./AuxiliarySystem.ts";
import { Account } from "./Account.ts";
import { Base } from "./Base.ts";

@Entity({ name: "accounting_entries" })
export class AccountingEntry extends Base {
	@Column({ length: 255 })
	description: string;

	@ManyToOne(() => AuxiliarySystem)
	@JoinColumn({ name: "auxiliaryId" })
	auxiliary: AuxiliarySystem;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "accountId" })
	account: Account;

	@Column({ type: "char", length: 2 })
	movementType: "DB" | "CR";

	@Column({
		type: "date",
		default: () => "GETDATE()",
	})
	entryDate: Date;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		transformer: decimalTransformer,
	})
	amount: number;

	@Column({ default: "R" })
	transactionStatus: string;
}

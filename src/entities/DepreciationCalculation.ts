import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
	OneToMany,
} from "typeorm";
import { FixedAsset } from "./FixedAsset.ts";
import { Account } from "./base/Account.ts";
import { AccountingEntry } from "./AccountingEntry.ts";
import { decimalTransformer } from "../utils/transformers.ts";

@Entity({ name: "depreciation_calculations" })
export class DepreciationCalculation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "int" })
	processYear: number;

	@Column({ type: "int" })
	processMonth: number;

	@ManyToOne(() => FixedAsset)
	@JoinColumn({ name: "assetId" })
	asset: FixedAsset;

	@Column({ type: "date" })
	processDate: Date;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		transformer: decimalTransformer,
	})
	depreciatedAmount: number;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		transformer: decimalTransformer,
	})
	accumulatedDepreciation: number;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "purchaseAccountId" })
	purchaseAccount: Account;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "depreciationAccountId" })
	depreciationAccount: Account;

	@OneToMany(() => AccountingEntry, (entry) => entry.depreciationCalculation)
	accountingEntries: AccountingEntry[];
}

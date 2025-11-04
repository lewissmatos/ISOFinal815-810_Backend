import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { FixedAsset } from "./FixedAsset";
import { Account } from "./base/Account";

@Entity({ name: "depreciation_calculations" })
export class DepreciationCalculation {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ type: "int" })
	processYear: number;

	@Column({ type: "int" })
	processMonth: number;

	@ManyToOne(() => FixedAsset)
	@JoinColumn({ name: "asset_id" })
	asset: FixedAsset;

	@Column({ type: "date" })
	processDate: Date;

	@Column({ type: "decimal", precision: 18, scale: 2 })
	depreciatedAmount: number;

	@Column({ type: "decimal", precision: 18, scale: 2 })
	accumulatedDepreciation: number;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "purchase_account_id" })
	purchaseAccount: Account;

	@ManyToOne(() => Account)
	@JoinColumn({ name: "depreciation_account_id" })
	depreciationAccount: Account;
}

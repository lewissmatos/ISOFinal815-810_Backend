import {
	Column,
	Entity,
	PrimaryGeneratedColumn,
	ManyToOne,
	JoinColumn,
} from "typeorm";
import { FixedAsset } from "./FixedAsset";
import { ChartOfAccount } from "./base/ChartOfAccount";

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

	@Column({ type: "decimal", precision: 18, scale: 2 })
	depreciatedAmount: number;

	@Column({ type: "decimal", precision: 18, scale: 2 })
	accumulatedDepreciation: number;

	@ManyToOne(() => ChartOfAccount)
	@JoinColumn({ name: "purchaseAccountId" })
	purchaseAccount: ChartOfAccount;

	@ManyToOne(() => ChartOfAccount)
	@JoinColumn({ name: "depreciationAccountId" })
	depreciationAccount: ChartOfAccount;
}

import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base/Base.ts";
import { Department } from "./Department.ts";
import { TypeOfAsset } from "./TypeOfAsset.ts";
import { decimalTransformer } from "../utils/transformers.ts";

@Entity({ name: "fixed_assets" })
export class FixedAsset extends Base {
	@Column({ length: 100 })
	description: string;

	@ManyToOne(() => Department, { nullable: false })
	@JoinColumn({ name: "departmentId" })
	department: Department;

	@ManyToOne(() => TypeOfAsset, { nullable: false })
	@JoinColumn({ name: "typeOfAssetId" })
	typeOfAsset: TypeOfAsset;

	@Column({ type: "int", default: 1 })
	usefulLifeMonths: number;

	@Column({
		type: "date",
		default: () => "GETDATE()",
	})
	purchaseDate: Date;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		default: 0,
		transformer: decimalTransformer,
	})
	purchaseValue: number;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 2,
		default: 0,
		transformer: decimalTransformer,
	})
	accumulatedDepreciation: number;
}

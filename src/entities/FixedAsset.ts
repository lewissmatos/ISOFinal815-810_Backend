import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base/Base.ts";
import { Department } from "./Department.ts";
import { TypeOfAsset } from "./TypeOfAsset.ts";

@Entity({ name: "fixed_assets" })
export class FixedAsset extends Base {
	@Column({ length: 100 })
	description: string;

	@ManyToOne(() => Department, { nullable: false })
	@JoinColumn({ name: "department_id" })
	department: Department;

	@ManyToOne(() => TypeOfAsset, { nullable: false })
	@JoinColumn({ name: "type_of_asset_id" })
	typeOfAsset: TypeOfAsset;

	@Column({
		type: "date",
		default: () => "GETDATE()",
	})
	enrollmentDate: Date;

	@Column({ default: 0.0 })
	buyingValue: number;

	@Column({ default: 0.0 })
	accumulatedDepreciation: number;
}

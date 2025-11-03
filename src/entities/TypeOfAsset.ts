import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./base/Base.ts";
import { Account } from "./base/Account.ts";

@Entity({ name: "type_of_assets" })
export class TypeOfAsset extends Base {
	@Column({ length: 100 })
	description: string;

	@ManyToOne(() => Account, { nullable: false })
	@JoinColumn({ name: "buying_account_id" })
	buyingAccount: Account;

	@ManyToOne(() => Account, { nullable: false })
	@JoinColumn({ name: "depreciation_account_id" })
	depreciationAccount: Account;
}

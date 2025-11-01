import { Column, Entity, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./Base.ts";
import { Account } from "./Account.ts";

@Entity()
export class TypeOfAsset extends Base {
	@Column({ length: 100 })
	description: string;

	@ManyToOne(() => Account, { nullable: false })
	@JoinColumn({ name: "buyingAccountId" })
	buyingAccount: Account;

	@ManyToOne(() => Account, { nullable: false })
	@JoinColumn({ name: "depreciationAccountId" })
	depreciationAccount: Account;
}

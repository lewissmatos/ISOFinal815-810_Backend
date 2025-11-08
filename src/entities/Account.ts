import { Entity, Column, ManyToOne, JoinColumn } from "typeorm";
import { Base } from "./Base";
import { AccountType } from "./AccountType";

// Cuentas Contables
@Entity({ name: "accounts" })
export class Account extends Base {
	@Column({ unique: true })
	description: string;

	@Column({ length: 1, type: "char" })
	allowsMovement: "S" | "N";

	@ManyToOne(() => AccountType)
	@JoinColumn({ name: "accountTypeId" })
	accountType: AccountType;

	@Column({ type: "int" })
	level: 1 | 2 | 3;

	@Column({ nullable: false, default: 0.0 })
	balance: number;

	@ManyToOne(() => Account, { nullable: true })
	@JoinColumn({ name: "parentAccountId" })
	parentAccount?: Account;
}

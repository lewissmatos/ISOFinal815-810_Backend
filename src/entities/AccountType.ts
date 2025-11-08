import { Entity, Column } from "typeorm";
import { Base } from "./Base";

// Tipo de cuenta
export type AccountTypeOrigin = "CR" | "DB";
@Entity({ name: "account_types" })
export class AccountType extends Base {
	@Column({ unique: true })
	description: string;

	@Column({
		type: "char",
		length: 2,
		default: "CR",
	})
	origin: AccountTypeOrigin;
}

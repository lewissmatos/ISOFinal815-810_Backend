import { Entity, Column } from "typeorm";

// Tipo de cuenta
export type AccountTypeOrigin = "CR" | "DB";
@Entity({ name: "account_types" })
export class AccountType {
	@Column({ primary: true, unique: true })
	id: number;

	@Column({ unique: true })
	description: string;

	@Column({
		type: "char",
		length: 2,
		default: "CR",
	})
	origin: AccountTypeOrigin;
}

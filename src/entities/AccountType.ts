import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

// Tipo de cuenta
export type AccountTypeOrigin = "CR" | "DB";
@Entity()
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

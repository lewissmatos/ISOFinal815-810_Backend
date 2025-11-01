import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

// Cuentas Contables
@Entity()
export class Account {
	@Column({ primary: true, unique: true })
	id: number;

	@Column({ unique: true })
	description: string;

	@Column({ length: 1, type: "char" })
	allowsMovement: "S" | "N";

	@Column({ type: "int" })
	type: number;

	@Column({ type: "int" })
	level: number;

	@Column({ nullable: true, default: 0.0 })
	balance: number;

	@Column({ type: "int", nullable: true })
	parentAccountCode?: number | null;
}

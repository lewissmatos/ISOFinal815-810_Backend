import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

// Catalogo de auxiliares
@Entity()
export class ChartOfAccount {
	@Column({ primary: true, unique: true })
	id: number;
	@Column({ unique: true })
	description: string;

	@Column({ name: "status", default: true })
	isActive: boolean;
}

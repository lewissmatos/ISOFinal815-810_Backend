import { Entity, Column } from "typeorm";

// Catálogo de Auxiliares
@Entity({ name: "chart_of_accounts" })
export class ChartOfAccount {
	@Column({ primary: true, unique: true })
	id: number;
	@Column({ unique: true })
	description: string;

	@Column({ name: "status", default: true })
	isActive: boolean;
}

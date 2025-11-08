import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

//Moneda
@Entity({ name: "currencies" })
export class Currency extends Base {
	@Column({ unique: true, length: 5 })
	ISOCode: string;

	@Column({ unique: true })
	description: string;

	@Column()
	exchangeRate: number;
}

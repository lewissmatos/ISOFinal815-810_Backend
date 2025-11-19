import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";
import { decimalTransformer } from "../utils/transformers.ts";

//Moneda
@Entity({ name: "currencies" })
export class Currency extends Base {
	@Column({ unique: true, length: 5 })
	ISOCode: string;

	@Column({ unique: true })
	description: string;

	@Column({
		type: "decimal",
		precision: 18,
		scale: 6,
		transformer: decimalTransformer,
	})
	exchangeRate: number;
}

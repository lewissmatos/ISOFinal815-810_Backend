import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

//Moneda
@Entity()
export class Currency {
	@Column({ primary: true, unique: true })
	id: number;

	@Column({ unique: true, length: 5 })
	ISOCode: string;

	@Column({ unique: true })
	description: string;

	@Column()
	exchangeRate: number;
}

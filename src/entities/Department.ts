import { Entity, Column } from "typeorm";
import { Base } from "./Base.ts";

@Entity()
export class Department extends Base {
	@Column({ length: 100 })
	description: string;
}

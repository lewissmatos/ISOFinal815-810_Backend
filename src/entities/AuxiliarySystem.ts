import { Entity, Column } from "typeorm";
import { Base } from "./Base";

// Catálogo de Auxiliares
@Entity({ name: "auxiliary_systems" })
export class AuxiliarySystem extends Base {
	@Column({ unique: true })
	name: string;
}

import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Base } from "./base/Base";
import { Department } from "./Department";

@Entity({ name: "employees" })
export class Employee extends Base {
	@Column({ length: 100 })
	name: string;

	@Column({ length: 11 })
	cedula: string;

	@Column({ length: 100 })
	position: string;

	@ManyToOne(() => Department, { nullable: false })
	@JoinColumn({ name: "department_id" })
	department: Department;

	@Column()
	kindOfPerson: "FISICA" | "JURIDICA";

	@Column({
		type: "date",
		default: () => "GETDATE()",
	})
	enrollmentDate: Date;
}

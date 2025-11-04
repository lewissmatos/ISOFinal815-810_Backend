import { Entity, Column, OneToOne, JoinColumn } from "typeorm";
import { Base } from "./base/Base.ts";
import { Employee } from "./Employee.ts";

@Entity({ name: "departments" })
export class Department extends Base {
	@Column({ length: 100, unique: true })
	description: string;

	@Column({ nullable: true })
	details?: string;

	@OneToOne(() => Employee, { nullable: true, onDelete: "SET NULL" })
	@JoinColumn({ name: "managerId" })
	manager?: Employee | null;
}

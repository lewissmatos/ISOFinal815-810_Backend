import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	CreateDateColumn,
} from "typeorm";

@Entity()
export class Base {
	@PrimaryGeneratedColumn()
	id: number;

	@CreateDateColumn({
		type: "datetime",
		default: () => "GETDATE()",
	})
	createdAt: Date;

	@Column({
		type: "bit",
		name: "status",
		default: true,
	})
	isActive: boolean; // true = active, false = inactive
}

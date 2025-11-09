import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
} from "typeorm";
import { AuxiliarySystem } from "./AuxiliarySystem.ts";
import { Base } from "./Base.ts";
import { hashPasswordSync, isPasswordHashed } from "../utils/password.util.ts";

@Entity({ name: "auth" })
export class Auth extends Base {
	@Column({ unique: true })
	username: string;

	@Column()
	password: string;

	@ManyToOne(() => AuxiliarySystem)
	@JoinColumn({ name: "auxiliaryId" })
	auxiliarySystem: AuxiliarySystem;

	@BeforeInsert()
	@BeforeUpdate()
	private hashPassword() {
		if (!this.password || isPasswordHashed(this.password)) {
			return;
		}

		this.password = hashPasswordSync(this.password);
	}
}

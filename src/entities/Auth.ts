import {
	BeforeInsert,
	BeforeUpdate,
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
} from "typeorm";
import { AuxiliarySystem } from "./AuxiliarySystem";
import { Base } from "./Base";
import { hashPasswordSync, isPasswordHashed } from "../utils/password.util";

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

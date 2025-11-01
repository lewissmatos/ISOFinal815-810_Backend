import { Column, Entity } from "typeorm";
import { Base } from "./Base.ts";

@Entity()
export class TypeOfAsset extends Base {
	@Column({
		length: 100,
	})
	description: string;

	// This must be a relationship later
	@Column({
		length: 100,
	})
	buyingAccount: string;

	// This must be a relationship later
	@Column({
		length: 100,
	})
	depreciationAccount: string;
}

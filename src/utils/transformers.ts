import type { ValueTransformer } from "typeorm";

export const decimalTransformer: ValueTransformer = {
	to: (value) => (value === null || value === undefined ? 0 : Number(value)),
	from: (value) => {
		if (value === null || value === undefined) {
			return 0;
		}
		if (typeof value === "number") {
			return value;
		}
		const parsed = Number(value);
		return Number.isNaN(parsed) ? 0 : parsed;
	},
};

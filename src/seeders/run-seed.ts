import { seedData } from "./seed-data.ts";

seedData()
	.then(() => {
		console.log("✅ All seeding tasks completed");
		process.exit(0);
	})
	.catch((err) => {
		console.error("❌ Seeding failed:", err);
		process.exit(1);
	});

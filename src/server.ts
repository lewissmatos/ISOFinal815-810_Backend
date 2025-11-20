import "reflect-metadata";
import { AppDataSource } from "./config/data-source";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 8001;

AppDataSource.initialize()
	.then(async () => {
		console.log("Data Source has been initialized!");

		app.listen(PORT, () => {
			console.log(`Server is running on port ${PORT}`);
		});
	})
	.catch((err) => {
		console.error("Error during Data Source initialization:", err);
	});

import https from "https";
import dotenv from "dotenv";
dotenv.config();

interface JsonRateResponse {
	moneda?: string;
	tasa?: number;
	rate?: number;
	fechaActualizacion?: string;
}

export class JsonExchangeService {
	static host =
		process.env.CURRENCIES_API_JSON_HOST ||
		process.env.CURRENCIES_API_URL ||
		"wsapi.wslab.qzz.io";

	static basePath =
		process.env.CURRENCIES_API_JSON_BASE_PATH || "/api/TasaCambio";

	static async getRate(currencyCode: string): Promise<number> {
		const options = {
			hostname: JsonExchangeService.host,
			path: `${JsonExchangeService.basePath}/${encodeURIComponent(
				currencyCode
			)}`,
			method: "GET",
			headers: {
				Accept: "application/json",
			},
		} as const;

		return new Promise<number>((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					try {
						if (res.statusCode && res.statusCode >= 400) {
							return reject(
								new Error(
									`JSON rate request failed with status ${res.statusCode}`
								)
							);
						}

						if (!data) {
							return reject(new Error("JSON rate response was empty"));
						}

						const payload = JSON.parse(data) as JsonRateResponse;
						const rate =
							typeof payload.tasa === "number"
								? payload.tasa
								: typeof payload.rate === "number"
								? payload.rate
								: undefined;

						if (rate === undefined || Number.isNaN(rate)) {
							const snippet = data.replace(/\s+/g, " ").trim().slice(0, 200);
							return reject(
								new Error(
									`Unable to read JSON exchange rate for "${currencyCode}". Response snippet: ${
										snippet || "<empty>"
									}`
								)
							);
						}

						return resolve(rate);
					} catch (err) {
						return reject(err instanceof Error ? err : new Error(String(err)));
					}
				});
			});

			req.on("error", (err) => reject(err));
			req.end();
		});
	}
}

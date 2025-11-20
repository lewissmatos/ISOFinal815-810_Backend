import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

interface JsonRateResponse {
	moneda?: string;
	tasa?: number;
	rate?: number;
	fechaActualizacion?: string;
}

export class JsonExchangeService {
	static baseUrl =
		process.env.CURRENCIES_API_JSON_URL ||
		process.env.CURRENCIES_API_URL ||
		"https://wsapi.wslab.qzz.io";

	static basePath =
		process.env.CURRENCIES_API_JSON_BASE_PATH || "/api/TasaCambio";

	static timeoutMs = Number(process.env.CURRENCIES_API_JSON_TIMEOUT ?? 10000);

	static async getRate(currencyCode: string): Promise<number> {
		const url = JsonExchangeService.composeUrl(currencyCode);
		try {
			const response = await axios.get<JsonRateResponse>(url, {
				timeout: JsonExchangeService.timeoutMs,
				headers: { Accept: "application/json" },
				validateStatus: (status) => status < 400,
			});

			const payload = response.data;
			const rate =
				typeof payload.tasa === "number"
					? payload.tasa
					: typeof payload.rate === "number"
					? payload.rate
					: undefined;

			if (rate === undefined || Number.isNaN(rate)) {
				const snippet = JsonExchangeService.buildSnippet(payload);
				throw new Error(
					`Unable to read JSON exchange rate for "${currencyCode}". Response snippet: ${snippet}`
				);
			}

			return rate;
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const status = error.response?.status;
				const snippet = JsonExchangeService.buildSnippet(error.response?.data);
				const message = status
					? `JSON rate request failed with status ${status}. Payload snippet: ${snippet}`
					: error.message;
				throw new Error(message);
			}
			throw error instanceof Error ? error : new Error(String(error));
		}
	}

	private static composeUrl(currencyCode: string): string {
		const trimmedBase = JsonExchangeService.baseUrl.replace(/\/$/, "");
		const trimmedPath = JsonExchangeService.basePath.replace(/^\//, "");
		return `${trimmedBase}/${trimmedPath}/${encodeURIComponent(currencyCode)}`;
	}

	private static buildSnippet(data: unknown): string {
		if (!data) {
			return "<empty>";
		}
		try {
			if (typeof data === "string") {
				return data.replace(/\s+/g, " ").trim().slice(0, 200) || "<empty>";
			}
			return (
				JSON.stringify(data).replace(/\s+/g, " ").trim().slice(0, 200) ||
				"<empty>"
			);
		} catch (err) {
			return "<unserializable>";
		}
	}
}

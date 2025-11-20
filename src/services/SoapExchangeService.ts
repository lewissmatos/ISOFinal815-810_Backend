import https from "https";
import dotenv from "dotenv";
dotenv.config();

export class SoapExchangeService {
	static host = process.env.CURRENCIES_API_URL || "wsapi.wslab.qzz.io";
	static path = "/TasaCambio.asmx";

	static async getRate(currencyCode: string): Promise<number> {
		const xml = `<?xml version="1.0" encoding="utf-8"?>
      <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:tem="http://tempuri.org/">
         <soapenv:Header/>
         <soapenv:Body>
            <tem:ObtenerTasa>
               <tem:codigoMoneda>${currencyCode}</tem:codigoMoneda>
            </tem:ObtenerTasa>
         </soapenv:Body>
      </soapenv:Envelope>`;

		const options = {
			hostname: SoapExchangeService.host,
			path: SoapExchangeService.path,
			method: "POST",
			headers: {
				"Content-Type": "text/xml; charset=utf-8",
				"Content-Length": Buffer.byteLength(xml),
				SOAPAction: "http://tempuri.org/ObtenerTasa",
			},
		} as const;

		return new Promise<number>((resolve, reject) => {
			const req = https.request(options, (res) => {
				let data = "";
				res.on("data", (chunk) => (data += chunk));
				res.on("end", () => {
					try {
						const faultMatch = data.match(
							/<(?:[\w:]*faultstring|faultstring)>([\s\S]*?)<\/(?:[\w:]*faultstring|faultstring)>/i
						);
						if (faultMatch && faultMatch[1]) {
							const fault = faultMatch[1].trim();
							return reject(new Error(`SOAP Fault: ${fault}`));
						}

						const match = data.match(
							/<ObtenerTasaResult[^>]*>([^<]+)<\/ObtenerTasaResult>/i
						);
						if (match && match[1]) {
							const raw = match[1].trim();
							const parsed = Number(raw.replace(/,/g, "."));
							if (!Number.isNaN(parsed)) {
								return resolve(parsed);
							}
						}

						const numMatch = data.match(/[-+]?\d+[\.,]?\d*/);
						if (numMatch) {
							const parsed = Number(numMatch[0].replace(/,/g, "."));
							if (!Number.isNaN(parsed)) {
								return resolve(parsed);
							}
						}

						return reject(
							new Error("Exchange rate not found in SOAP response")
						);
					} catch (err) {
						return reject(err);
					}
				});
			});

			req.on("error", (err) => reject(err));
			req.write(xml);
			req.end();
		});
	}
}

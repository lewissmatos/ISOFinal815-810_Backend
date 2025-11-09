declare global {
	namespace Express {
		interface Request {
			authContext?: {
				usernameHash: string;
				auxiliaryHash: string;
				userId: number;
				username: string;
				auxiliarySystemId: number;
				token: string;
			};
		}
	}
}

export {};

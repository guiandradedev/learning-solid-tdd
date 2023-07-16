export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      URL: string;
      PORT: number;
      SECURITY: string;
      ENV: "test" | "dev" | "prod";
      DATABASE_URL: string;
      ACCESS_TOKEN: string;
      REFRESH_TOKEN: string;
      EXPIRES_IN_TOKEN: number;
      EXPIRES_IN_REFRESH_TOKEN: number;
      EXPIRES_REFRESH_TOKEN_DAYS: number;

    }
  }
}
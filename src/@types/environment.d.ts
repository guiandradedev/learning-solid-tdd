export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      URL: string;
      PORT: number;
      SECURITY: string;
      ENV: "test" | "dev" | "prod";
      DATABASE_URL: string;
      JWT_ACCESS_TOKEN: string;
      JWT_REFRESH_TOKEN: string;
      JWT_EXPIRES_IN_TOKEN: string;
      JWT_EXPIRES_IN_REFRESH_TOKEN: string;
      JWT_EXPIRES_REFRESH_TOKEN_DAYS: number;

    }
  }
}
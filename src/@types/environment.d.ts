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
      MAIL_HOST: string
      MAIL_PORT: string,
      MAIL_USER: string,
      MAIL_PASSWORD: string
    }
  }
}
declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test" | "staging";
    DISCORD_API_TOKEN: string;

    DISCORD_DEV_SERVER: string;
    DISCORD_DEV_ID: string;
  }
}

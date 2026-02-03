declare namespace NodeJS {
  interface ProcessEnv {
    API_URL: string;
    OPENROUTER_API_KEY: string;
    OPENROUTER_API_URL: string;
    OCR_MODEL: string;
  }
}

declare global {
  const process: { env: NodeJS.ProcessEnv };
}

export {};

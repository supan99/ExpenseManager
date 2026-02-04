declare namespace NodeJS {
  interface ProcessEnv {
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_PUBLISHABLE_DEFAULT_KEY: string;
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

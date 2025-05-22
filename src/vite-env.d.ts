
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_AWS_REGION: string;
  readonly VITE_AWS_ACCESS_KEY_ID: string;
  readonly VITE_AWS_SECRET_ACCESS_KEY: string;
  readonly VITE_AWS_S3_BUCKET: string;
  readonly VITE_AWS_S3_ACCELERATE_ENDPOINT: string;
  readonly VITE_AWS_IDENTITY_POOL_ID?: string;
  readonly VITE_ENABLE_S3_ACCELERATION?: string;
  readonly VITE_APPSYNC_API_KEY?: string;
  readonly VITE_APPSYNC_ENDPOINT?: string;
  readonly VITE_APPSYNC_REALTIME_ENDPOINT?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

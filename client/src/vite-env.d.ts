interface ImportMetaEnv {
  VITE_APP_NODE_ENV: string;
  // define more env variables if needed
}

interface ImportMeta {
  env: ImportMetaEnv;
}

declare module "*.png" {
  const value: any;
  export = value;
}

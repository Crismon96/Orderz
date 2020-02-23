declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'testing';
      DB_HOST: string;
      JWT_SECRET: string;
    }
  }
}

export default X;

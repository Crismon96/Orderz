declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production';
      DB_HOST: string;
      JWT_SECRET: string;
    }
  }
}

export default X;

declare namespace NodeJS {
    interface ProcessEnv {
        NODE_ENV: string;
        NODE_PATH: string;

        SET_COOKIE_SECURE: boolean;
        SET_COOKIE_SAME_SITE: string;

        SERVER_PORT: number

        DB_HOST: string;
        DB_HOST_MONGO: string;
        DB_USER: string;
        DB_DATABASE: string;
        DB_PASSWORD: string;
        DB_PORT: number;
        DB_PORT_MONGO: number;
        DB_SYNCHRONIZE: boolean;
        DB_TYPE_DEFAULT: string;
        DB_TYPE: string;

        CACHE_HOST: string;
        CACHE_PORT: number;
        CACHE_PASSWORD: string;

        MINIO_HOST: string;
        MINIO_ACCESS_KEY: string;
        MINIO_SECRET_KEY: string;
        MINIO_USE_SSL: boolean;
        MINIO_PORT: number;
        MINIO_PUBLIC_BUCKET: string;
        MINIO_PRIVATE_BUCKET: string;
        MINIO_ROOT_PATH: string;
        MINIO_REGION: string;
        FILESYSTEM_DEFAULT: string;

        TZ: string;

        JWT_SECRET: string;
        JWT_EXPIRES: number;
        JWT_ISS: string;
        JWT_AUD: string;

        SMTP_HOST: string;
        SMTP_PORT: number;
        SMTP_USERNAME: string;
        SMTP_PASSWORD: string;
        SMTP_SECURE_SSL: boolean;
        SMTP_SENDER_NAME: string;
        SMTP_SENDER_EMAIL_DEFAULT: string;

        URL_API: string;
        URL_WEB: string;

        AUTHORIZATION: boolean;

        PRODUCT_NAME: string;

        ENCRYPTION_DEFAULT: string;

        EXECUTE_CRONS: boolean;

        PUSH_PUBLIC_KEY: string;
        PUSH_PRIVATE_KEY: string;

        LOCALE: string;

        SYMMETRIC_KEY: string;
    }
}
